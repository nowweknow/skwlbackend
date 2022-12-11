import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UserPhone {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
    nullable: true,
  })
  phone: string | null;

  @Column({
    nullable: true,
  })
  validation_code: number | null;

  @Column()
  username: string;

  @CreateDateColumn()
  created_at: Date;
}
