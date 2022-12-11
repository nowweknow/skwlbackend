import { Entity, OneToOne, PrimaryGeneratedColumn, JoinColumn, Column } from 'typeorm';
import { User } from './users.entity';

@Entity()
export class UserDevice {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;
  @OneToOne(() => User, (user) => user.userDevice)
  user: User;

  @Column()
  deviceId: string;

  @Column()
  deviceName: string;

  @Column()
  deviceUniqueId: string;

  @Column()
  brand: string;

  @Column()
  token: string;
}
