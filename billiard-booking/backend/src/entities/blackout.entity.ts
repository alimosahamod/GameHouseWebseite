import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Table } from './table.entity';

@Entity('blackouts')
export class Blackout {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'table_id', nullable: true })
  tableId: number;

  @Column({ name: 'start_time', type: 'datetime' })
  startTime: Date;

  @Column({ name: 'end_time', type: 'datetime' })
  endTime: Date;

  @Column({ length: 255, nullable: true })
  reason: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => Table, table => table.blackouts)
  @JoinColumn({ name: 'table_id' })
  table: Table;
}
