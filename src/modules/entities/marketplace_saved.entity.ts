import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { MarketPlace } from './marketplace.entity';
import { User } from './users.entity';

@Entity()
export class Marketplace_Saved {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.id)
  user: User;

  @ManyToOne(() => MarketPlace, (marketplace) => marketplace.id, { nullable: false, onDelete: 'CASCADE' })
  marketplace: MarketPlace;
}
