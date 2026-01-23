import { Repository, Like, ILike } from 'typeorm';
import { AppDataSource } from '../config/database';
import { InterestTag } from '../entities/InterestTag';

export class InterestTagService {
    private tagRepository: Repository<InterestTag>;

    constructor() {
        this.tagRepository = AppDataSource.getRepository(InterestTag);
    }

    async getAllTags(): Promise<InterestTag[]> {
        return await this.tagRepository.find({
            order: { usageCount: 'DESC', name: 'ASC' }
        });
    }

    async searchTags(query: string): Promise<InterestTag[]> {
        return await this.tagRepository.find({
            where: { name: ILike(`%${query}%`) },
            order: { usageCount: 'DESC', name: 'ASC' },
            take: 20
        });
    }

    async createTag(name: string, userId?: string): Promise<InterestTag> {
        const existingTag = await this.tagRepository.findOne({ where: { name } });
        if (existingTag) {
            existingTag.usageCount += 1;
            return await this.tagRepository.save(existingTag);
        }

        const tag = this.tagRepository.create({
            name,
            createdByUserId: userId,
            isSystemTag: false,
            usageCount: 1
        });

        return await this.tagRepository.save(tag);
    }

    async incrementUsage(name: string): Promise<void> {
        await this.tagRepository.increment({ name }, 'usageCount', 1);
    }
}

export const interestTagService = new InterestTagService();
