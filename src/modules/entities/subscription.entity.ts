import { User } from './users.entity';
import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, CreateDateColumn, JoinColumn } from 'typeorm';
import { MarketPlace } from './marketplace.entity';

@Entity()
export class Subscription {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;
  @ManyToOne(() => User, (user) => user.id)
  user: User;

  @Column({
    default: '',
  })
  environment: string;

  @Column({
    default: '',
  })
  orig_tx_id: string;

  @Column({ type: 'text' })
  latest_receipt: string;

  @CreateDateColumn()
  start_date: Date;

  @Column({ type: 'datetime' })
  end_date: Date;

  @Column({
    default: '',
  })
  app: string;

  @Column({
    name: 'product_id',
  })
  product_id: string;

  @Column({
    default: false,
  })
  is_cancelled: boolean;

  @Column({ type: 'text' })
  validation_response: string;

  @Column({
    default: false,
  })
  fake: boolean;
}
