import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AvailabilityService } from './availability.service';
import { AvailabilityController } from './availability.controller';
import { OpeningHours } from '../../entities/opening-hours.entity';
import { Reservation } from '../../entities/reservation.entity';
import { Blackout } from '../../entities/blackout.entity';
import { Table } from '../../entities/table.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([OpeningHours, Reservation, Blackout, Table])
  ],
  controllers: [AvailabilityController],
  providers: [AvailabilityService],
})
export class AvailabilityModule {}
