import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Table } from './table.entity';

@Entity('reservations')
export class Reservation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'table_id' })
  tableId: number;

  @Column({ name: 'customer_name', length: 100 })
  customerName: string;

  @Column({ name: 'customer_email', length: 255, nullable: true })
  customerEmail: string;

  @Column({ name: 'customer_phone', length: 50, nullable: true })
  customerPhone: string;

  @Column({ name: 'start_time', type: 'datetime' })
  startTime: Date;

  @Column({ name: 'end_time', type: 'datetime' })
  endTime: Date;

  @Column({ name: 'duration_minutes' })
  durationMinutes: number;

  @Column({
    type: 'enum',
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'confirmed'
  })
  status: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => Table, table => table.reservations)
  @JoinColumn({ name: 'table_id' })
  table: Table;
}
