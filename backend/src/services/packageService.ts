import { Repository } from 'typeorm';
import { AppDataSource } from '../config/database';
import { UserPackage } from '../entities/UserPackage';
import { Package } from '../entities/Package';
import { AppError } from '../types';

export class PackageService {
    private userPackageRepository: Repository<UserPackage>;
    private packageRepository: Repository<Package>;

    constructor() {
        this.userPackageRepository = AppDataSource.getRepository(UserPackage);
        this.packageRepository = AppDataSource.getRepository(Package);
    }

    async getUserPackages(userId: string): Promise<UserPackage[]> {
        return await this.userPackageRepository.find({
            where: { userId },
            relations: ['package', 'package.restaurant'],
            order: { purchaseDate: 'DESC' }
        });
    }

    async purchasePackage(userId: string, packageId: string): Promise<UserPackage> {
        const pkg = await this.packageRepository.findOne({ where: { id: packageId } });
        if (!pkg) {
            throw new AppError('Package not found', 404);
        }

        // In a real app, we'd handle Stripe here. 
        // This is the mock purchase logic.

        const userPackage = this.userPackageRepository.create({
            userId,
            packageId,
            datesPurchased: 5, // Default for now, could be from package details
            datesUsed: 0,
            status: 'active',
            purchaseDate: new Date()
        });

        return await this.userPackageRepository.save(userPackage);
    }

    async useDate(userPackageId: string): Promise<UserPackage> {
        const userPackage = await this.userPackageRepository.findOne({ where: { id: userPackageId } });
        if (!userPackage) {
            throw new AppError('User package not found', 404);
        }

        if (userPackage.datesUsed >= userPackage.datesPurchased) {
            throw new AppError('No dates remaining on this package', 400);
        }

        userPackage.datesUsed += 1;
        if (userPackage.datesUsed === userPackage.datesPurchased) {
            userPackage.status = 'exhausted';
        }

        return await this.userPackageRepository.save(userPackage);
    }
}

export const packageService = new PackageService();
