import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm';

@Entity('menu_items')
export class MenuItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  packageId: string;

  @Column()
  course: 'appetizer' | 'main' | 'dessert' | 'drink' | 'amuse_bouche' | 'side';

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  imageUrl: string;

  @Column({ type: 'jsonb', nullable: true })
  ingredients: string[];

  @Column({ type: 'jsonb', nullable: true })
  allergens: string[];

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  deletedAt: Date | null;

  sanitize(): Partial<MenuItem> {
    const { deletedAt, ...sanitizedMenuItem } = this;
    return sanitizedMenuItem;
  }
}