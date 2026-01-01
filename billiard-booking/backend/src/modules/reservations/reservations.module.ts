import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations.controller';
import { Reservation } from '../../entities/reservation.entity';
import { OpeningHours } from '../../entities/opening-hours.entity';
import { Blackout } from '../../entities/blackout.entity';
import { Table } from '../../entities/table.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Reservation, OpeningHours, Blackout, Table])
  ],
  controllers: [ReservationsController],
  providers: [ReservationsService],
})
export class ReservationsModule {}
