import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, OneToMany } from 'typeorm';
import { Marketplace_Saved } from './marketplace_saved.entity';
import { User } from './users.entity';

export enum marketplace_product_status {
  PABLISHED = 'published',
  DRAFT = 'draft',
}
@Entity()
export class MarketPlace {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  image_link: string;

  @Column()
  title: string;

  @Column()
  link: string;

  @Column()
  price: string;

  @Column({
    type: 'enum',
    enum: marketplace_product_status,
    default: marketplace_product_status.PABLISHED,
  })
  status: marketplace_product_status;

  @CreateDateColumn()
  created_at: Date;

  @Column()
  userId: number;
  @ManyToOne(() => User, (user) => user.marketplaces, { nullable: false })
  user: User;

  @OneToMany(() => Marketplace_Saved, (marketplace_saved) => marketplace_saved.marketplace, { nullable: false, onDelete: 'CASCADE' })
  marketplace_saved: Marketplace_Saved[];
}
