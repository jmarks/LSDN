import { Repository } from 'typeorm';
import { AppDataSource } from '../config/database';
import { ShoppingCart } from '../entities/ShoppingCart';
import { AppError } from '../types';

export class CartService {
    private cartRepository: Repository<ShoppingCart>;

    constructor() {
        this.cartRepository = AppDataSource.getRepository(ShoppingCart);
    }

    async getCart(userId: string): Promise<ShoppingCart | null> {
        return await this.cartRepository.findOne({
            where: { userId },
            relations: ['package', 'package.restaurant']
        });
    }

    async addToCart(userId: string, packageId: string): Promise<ShoppingCart> {
        let cart = await this.cartRepository.findOne({ where: { userId } });

        if (cart) {
            cart.packageId = packageId;
            cart.updatedAt = new Date();
        } else {
            cart = this.cartRepository.create({
                userId,
                packageId
            });
        }

        return await this.cartRepository.save(cart);
    }

    async removeFromCart(userId: string): Promise<void> {
        await this.cartRepository.delete({ userId });
    }

    async clearCart(userId: string): Promise<void> {
        await this.removeFromCart(userId);
    }
}

export const cartService = new CartService();
