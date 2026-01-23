import { Repository } from 'typeorm';
import { AppDataSource } from '../config/database';
import { User } from '../entities/User';
import { Booking } from '../entities/Booking';
import { UserPackage } from '../entities/UserPackage';

export class DashboardService {
    private userRepository: Repository<User>;
    private bookingRepository: Repository<Booking>;
    private userPackageRepository: Repository<UserPackage>;

    constructor() {
        this.userRepository = AppDataSource.getRepository(User);
        this.bookingRepository = AppDataSource.getRepository(Booking);
        this.userPackageRepository = AppDataSource.getRepository(UserPackage);
    }

    async getDashboardStats(userId: string) {
        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: ['packages', 'packages.package']
        });

        const activePackages = await this.userPackageRepository.find({
            where: { userId, status: 'active' },
            relations: ['package', 'package.restaurant']
        });

        const bookings = await this.bookingRepository.find({
            where: [
                { userAId: userId },
                { userBId: userId }
            ],
            relations: ['restaurant', 'package', 'slot', 'userA', 'userB'],
            order: { bookingTime: 'ASC' }
        });

        const totalDatesPurchased = activePackages.reduce((acc, p) => acc + p.datesPurchased, 0);
        const totalDatesUsed = activePackages.reduce((acc, p) => acc + p.datesUsed, 0);

        const upcomingDates = bookings.filter(b => b.status === 'confirmed' && new Date(b.bookingTime) > new Date());
        const pendingInvites = bookings.filter(b => b.inviteStatus === 'pending');
        const completedDates = bookings.filter(b => b.status === 'completed' || (b.status === 'confirmed' && new Date(b.bookingTime) < new Date()));

        return {
            user: user ? user.sanitize() : null,
            stats: {
                totalDatesPurchased,
                totalDatesUsed,
                datesRemaining: totalDatesPurchased - totalDatesUsed,
                upcomingCount: upcomingDates.length,
                pendingInviteCount: pendingInvites.length
            },
            activePackages,
            upcomingDates,
            pendingInvites,
            completedDates
        };
    }
}

export const dashboardService = new DashboardService();
