import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('opening_hours')
export class OpeningHours {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'day_of_week' })
  dayOfWeek: number; // 0=Sonntag, 1=Montag, ..., 6=Samstag

  @Column({ name: 'open_time', type: 'time' })
  openTime: string;

  @Column({ name: 'close_time', type: 'time' })
  closeTime: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;
}
