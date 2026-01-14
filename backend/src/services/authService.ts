import { User } from '../entities/User';
import { AppError } from '../types';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import * as speakeasy from 'speakeasy';
import * as QRCode from 'qrcode';
import { sendEmail } from '../utils/email';
import { redisClient } from '../config/redis';
import { userService } from './userService';
import dataSource from '../config/database';

export class AuthService {
  private userRepository = dataSource.getRepository(User);

  async register(userData: Partial<User>): Promise<{ user: User; token: string }> {
    // Check if user already exists
    const existingUser = await this.userRepository.findOne({
      where: { email: userData.email }
    });

    if (existingUser) {
      throw new AppError('User already exists', 400, 'USER_EXISTS');
    }

    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(userData.password, saltRounds);

    // Generate verification token
    const verificationToken = this.generateToken();

    // Create user
    const user = this.userRepository.create({
      ...userData,
      passwordHash,
      verificationToken,
      tokenVersion: 0
    });

    const savedUser = await this.userRepository.save(user);

    // Send verification email
    await this.sendVerificationEmail(savedUser);

    // Generate JWT token
    const token = this.generateJWT(savedUser);

    return { user: savedUser, token };
  }

  async login(email: string, password: string): Promise<{ user: User; token: string; refreshToken: string }> {
    const user = await this.userRepository.findOne({
      where: { email }
    });

    if (!user) {
      throw new AppError('Invalid credentials', 401, 'INVALID_CREDENTIALS');
    }

    if (!user.isActive) {
      throw new AppError('Account is disabled', 403, 'ACCOUNT_DISABLED');
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      throw new AppError('Invalid credentials', 401, 'INVALID_CREDENTIALS');
    }

    // Check if email is verified
    if (user.verificationStatus !== 'verified') {
      throw new AppError('Please verify your email address', 403, 'EMAIL_NOT_VERIFIED');
    }

    // Check if 2FA is enabled
    if (user.totpEnabled) {
      throw new AppError('2FA required', 403, '2FA_REQUIRED');
    }

    // Generate tokens
    const token = this.generateJWT(user);
    const refreshToken = this.generateRefreshToken(user);

    // Store refresh token in Redis
    await this.storeRefreshToken(user.id, refreshToken);

    // Update last login
    await userService.updateLastLogin(user.id);

    return { user, token, refreshToken };
  }

  async verify2FA(email: string, password: string, totpToken: string): Promise<{ user: User; token: string; refreshToken: string }> {
    const user = await this.userRepository.findOne({
      where: { email }
    });

    if (!user) {
      throw new AppError('Invalid credentials', 401, 'INVALID_CREDENTIALS');
    }

    if (!user.isActive) {
      throw new AppError('Account is disabled', 403, 'ACCOUNT_DISABLED');
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      throw new AppError('Invalid credentials', 401, 'INVALID_CREDENTIALS');
    }

    if (!user.totpEnabled || !user.totpSecret) {
      throw new AppError('2FA is not enabled for this account', 400, '2FA_NOT_ENABLED');
    }

    // Verify 2FA token
    const verified = speakeasy.totp.verify({
      secret: user.totpSecret,
      token: totpToken,
      window: 2
    });

    if (!verified) {
      throw new AppError('Invalid 2FA token', 401, 'INVALID_2FA_TOKEN');
    }

    // Generate tokens
    const token = this.generateJWT(user);
    const refreshToken = this.generateRefreshToken(user);

    // Store refresh token in Redis
    await this.storeRefreshToken(user.id, refreshToken);

    // Update last login
    await userService.updateLastLogin(user.id);

    return { user, token, refreshToken };
  }

  async refreshToken(refreshToken: string): Promise<{ token: string; refreshToken: string }> {
    // Verify refresh token
    const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as any;

    const user = await this.userRepository.findOne({
      where: { id: payload.userId }
    });

    if (!user || !user.isActive) {
      throw new AppError('Invalid refresh token', 401, 'INVALID_REFRESH_TOKEN');
    }

    // Check if token version matches
    if (user.tokenVersion !== payload.tokenVersion) {
      throw new AppError('Token version mismatch', 401, 'TOKEN_VERSION_MISMATCH');
    }

    // Check if refresh token is still valid in Redis
    const storedToken = await redisClient.get(`refresh_token:${user.id}`);
    if (storedToken !== refreshToken) {
      throw new AppError('Invalid refresh token', 401, 'INVALID_REFRESH_TOKEN');
    }

    // Generate new tokens
    const token = this.generateJWT(user);
    const newRefreshToken = this.generateRefreshToken(user);

    // Update refresh token in Redis
    await this.storeRefreshToken(user.id, newRefreshToken);

    return { token, refreshToken: newRefreshToken };
  }

  async verifyEmail(token: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { verificationToken: token }
    });

    if (!user) {
      throw new AppError('Invalid verification token', 400, 'INVALID_TOKEN');
    }

    user.verificationToken = null;
    user.verificationStatus = 'verified';
    user.verifiedAt = new Date();

    return await this.userRepository.save(user);
  }

  async requestPasswordReset(email: string): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { email }
    });

    if (!user) {
      // Don't reveal if user exists or not
      return;
    }

    const resetToken = this.generateToken();
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    user.resetToken = resetToken;
    user.resetTokenExpiry = resetTokenExpiry;

    await this.userRepository.save(user);

    // Send password reset email
    await this.sendPasswordResetEmail(user);
  }

  async resetPassword(token: string, password: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { resetToken: token }
    });

    if (!user) {
      throw new AppError('Invalid reset token', 400, 'INVALID_TOKEN');
    }

    if (user.resetTokenExpiry && user.resetTokenExpiry < new Date()) {
      throw new AppError('Reset token has expired', 400, 'TOKEN_EXPIRED');
    }

    const saltRounds = 12;
    user.passwordHash = await bcrypt.hash(password, saltRounds);
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
 
    // Increment token version to invalidate all existing tokens
    user.tokenVersion = (user.tokenVersion ?? 0) + 1;

    return await this.userRepository.save(user);
  }

  async logout(userId: string): Promise<void> {
    // Remove refresh token from Redis
    await redisClient.del(`refresh_token:${userId}`);
  }

  async enable2FA(userId: string): Promise<{ qrCode: string; secret: string }> {
    const user = await this.userRepository.findOne({
      where: { id: userId }
    });

    if (!user) {
      throw new AppError('User not found', 404, 'USER_NOT_FOUND');
    }

    // Generate 2FA secret
    const secret = speakeasy.generateSecret({
      name: `Local Singles Date Night (${user.email})`,
      issuer: 'Local Singles Date Night'
    });

    user.totpSecret = secret.base32;
    user.totpEnabled = false; // Will be enabled after verification

    await this.userRepository.save(user);

    // Generate QR code
    const qrCode = await QRCode.toDataURL(secret.otpauth_url!);

    return { qrCode, secret: secret.base32! };
  }

  async disable2FA(userId: string, token: string): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { id: userId }
    });

    if (!user) {
      throw new AppError('User not found', 404, 'USER_NOT_FOUND');
    }

    if (!user.totpEnabled || !user.totpSecret) {
      throw new AppError('2FA is not enabled for this account', 400, '2FA_NOT_ENABLED');
    }

    // Verify 2FA token
    const verified = speakeasy.totp.verify({
      secret: user.totpSecret,
      token,
      window: 2
    });

    if (!verified) {
      throw new AppError('Invalid 2FA token', 401, 'INVALID_2FA_TOKEN');
    }

    user.totpSecret = '';
    user.totpEnabled = false;

    await this.userRepository.save(user);
  }

  private generateJWT(user: User): string {
    return jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
        tokenVersion: user.tokenVersion
      },
      process.env.JWT_SECRET!,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || '15m',
        issuer: 'Local Singles Date Night',
        audience: 'lsdn-users'
      } as jwt.SignOptions
    );
  }

  private generateRefreshToken(user: User): string {
    return jwt.sign(
      {
        userId: user.id,
        tokenVersion: user.tokenVersion
      },
      process.env.JWT_REFRESH_SECRET!,
      {
        expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
        issuer: 'Local Singles Date Night',
        audience: 'lsdn-users'
      } as jwt.SignOptions
    );
  }

  private generateToken(): string {
    return jwt.sign(
      { timestamp: Date.now() },
      process.env.JWT_SECRET!,
      {
        expiresIn: '24h',
        issuer: 'Local Singles Date Night'
      } as jwt.SignOptions
    );
  }

  private async storeRefreshToken(userId: string, refreshToken: string): Promise<void> {
    const expiry = 7 * 24 * 60 * 60; // 7 days in seconds
    await redisClient.setEx(`refresh_token:${userId}`, expiry, refreshToken);
  }

  private async sendVerificationEmail(user: User): Promise<void> {
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${user.verificationToken}`;
    
    await sendEmail({
      to: user.email,
      subject: 'Verify Your Email Address',
      template: 'email-verification',
      data: {
        name: `${user.firstName} ${user.lastName}`,
        verificationUrl,
        appName: 'Local Singles Date Night'
      }
    });
  }

  private async sendPasswordResetEmail(user: User): Promise<void> {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${user.resetToken}`;
    
    await sendEmail({
      to: user.email,
      subject: 'Reset Your Password',
      template: 'password-reset',
      data: {
        name: `${user.firstName} ${user.lastName}`,
        resetUrl,
        appName: 'Local Singles Date Night'
      }
    });
  }
}

// Export singleton instance
export const authService = new AuthService();