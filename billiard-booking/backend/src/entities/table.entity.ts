import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToMany } from 'typeorm';
import { Reservation } from './reservation.entity';
import { Blackout } from './blackout.entity';

@Entity('tables')
export class Table {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @OneToMany(() => Reservation, reservation => reservation.table)
  reservations: Reservation[];

  @OneToMany(() => Blackout, blackout => blackout.table)
  blackouts: Blackout[];
}
