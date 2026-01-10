import { Repository, Like, MoreThan } from 'typeorm';
import { User } from '../entities/User';
import { UserPackage } from '../entities/UserPackage';
import { Booking } from '../entities/Booking';
import { Message } from '../entities/Message';
import { MatchingRequest } from '../entities/MatchingRequest';
import { AppError } from '../types';
import * as bcrypt from 'bcrypt';
import dataSource from '../config/database';

export class UserService {
  private userRepository: Repository<User>;
  private userPackageRepository: Repository<UserPackage>;
  private bookingRepository: Repository<Booking>;
  private messageRepository: Repository<Message>;
  private matchingRequestRepository: Repository<MatchingRequest>;

  constructor() {
    this.userRepository = dataSource.getRepository(User);
    this.userPackageRepository = dataSource.getRepository(UserPackage);
    this.bookingRepository = dataSource.getRepository(Booking);
    this.messageRepository = dataSource.getRepository(Message);
    this.matchingRequestRepository = dataSource.getRepository(MatchingRequest);
  }

  async findById(id: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { id },
      relations: ['packages', 'bookingsAsUserA', 'bookingsAsUserB', 'sentMessages', 'receivedMessages', 'matchingRequests']
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { email }
    });
  }

  async findByVerificationToken(token: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { verificationToken: token }
    });
  }

  async findByResetToken(token: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { 
        resetToken: token,
        resetTokenExpiry: MoreThan(new Date())
      }
    });
  }

  async create(userData: any): Promise<User> {
    const user = this.userRepository.create(userData);
    return await this.userRepository.save(user);
  }

  async update(id: string, updateData: any): Promise<User | null> {
    const user = await this.findById(id);
    if (!user) {
      throw new AppError('User not found', 404, 'USER_NOT_FOUND');
    }

    // Don't allow updating sensitive fields
    const { passwordHash, verificationToken, resetToken, resetTokenExpiry, ...updateFields } = updateData;
    
    Object.assign(user, updateFields);
    return await this.userRepository.save(user);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.userRepository.softDelete(id);
    return result.affected !== 0;
  }

  async verifyEmail(token: string): Promise<User | null> {
    const user = await this.findByVerificationToken(token);
    if (!user) {
      throw new AppError('Invalid verification token', 400, 'INVALID_TOKEN');
    }

    user.verificationToken = null;
    user.verificationStatus = 'verified';
    user.verifiedAt = new Date();
    
    return await this.userRepository.save(user);
  }

  async updatePassword(userId: string, newPassword: string): Promise<User | null> {
    const user = await this.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404, 'USER_NOT_FOUND');
    }

    const saltRounds = 12;
    user.passwordHash = await bcrypt.hash(newPassword, saltRounds);
    user.resetToken = null;
    user.resetTokenExpiry = null;
    
    return await this.userRepository.save(user);
  }

  async updateProfile(userId: string, profileData: any): Promise<User | null> {
    const user = await this.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404, 'USER_NOT_FOUND');
    }

    // Update allowed fields
    const allowedFields: (keyof User)[] = [
      'firstName', 'lastName', 'bio', 'interests', 'languages',
      'dietaryRestrictions', 'radiusPreference', 'ageRangeMin',
      'ageRangeMax', 'location', 'profilePhotoUrl', 'profilePhotos'
    ];

    allowedFields.forEach(field => {
      if (profileData[field] !== undefined && profileData[field] !== null) {
        (user as any)[field] = profileData[field];
      }
    });

    return await this.userRepository.save(user);
  }

  async getUserPackages(userId: string): Promise<UserPackage[]> {
    return await this.userPackageRepository.find({
      where: { userId },
      relations: ['package']
    });
  }

  async getUserBookings(userId: string): Promise<Booking[]> {
    return await this.bookingRepository.find({
      where: [
        { userAId: userId },
        { userBId: userId }
      ],
      relations: ['restaurant', 'package', 'slot'],
      order: { bookingTime: 'DESC' }
    });
  }

  async getUserMessages(userId: string, limit: number = 50): Promise<Message[]> {
    return await this.messageRepository.find({
      where: [
        { senderId: userId },
        { receiverId: userId }
      ],
      relations: ['sender', 'receiver', 'booking'],
      order: { createdAt: 'DESC' },
      take: limit
    });
  }

  async getUserMatchingRequests(userId: string): Promise<MatchingRequest[]> {
    return await this.matchingRequestRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' }
    });
  }

  async searchUsers(query: string, limit: number = 20): Promise<User[]> {
    return await this.userRepository.find({
      where: [
        { firstName: Like(`%${query}%`) },
        { lastName: Like(`%${query}%`) },
        { email: Like(`%${query}%`) }
      ],
      select: [
        'id', 'firstName', 'lastName', 'bio', 'profilePhotoUrl', 
        'location', 'city', 'state', 'country', 'ageRangeMin', 
        'ageRangeMax', 'interests', 'languages', 'verifiedAt'
      ],
      take: limit
    });
  }

  async incrementTokenVersion(userId: string): Promise<void> {
    await this.userRepository.increment({ id: userId }, 'tokenVersion', 1);
  }

  async findByTokenVersion(userId: string, tokenVersion: number): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { id: userId, tokenVersion }
    });
  }

  async updateLastLogin(userId: string): Promise<void> {
    await this.userRepository.update(userId, { lastLoginAt: new Date() });
  }

  async getUserStats(userId: string): Promise<any> {
    const user = await this.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404, 'USER_NOT_FOUND');
    }

    const totalBookings = await this.bookingRepository.count({
      where: [
        { userAId: userId },
        { userBId: userId }
      ]
    });

    const confirmedBookings = await this.bookingRepository.count({
      where: [
        { userAId: userId, status: 'confirmed' },
        { userBId: userId, status: 'confirmed' }
      ]
    });

    const totalMessages = await this.messageRepository.count({
      where: [
        { senderId: userId },
        { receiverId: userId }
      ]
    });

    return {
      totalBookings,
      confirmedBookings,
      totalMessages,
      packagesCount: user.packages.length,
      isVerified: user.verificationStatus === 'verified',
      lastLoginAt: user.lastLoginAt
    };
  }
}

// Export singleton instance
export const userService = new UserService();
export const userRepository = dataSource.getRepository(User);