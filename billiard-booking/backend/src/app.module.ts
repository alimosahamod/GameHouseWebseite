import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { TablesModule } from './modules/tables/tables.module';
import { ReservationsModule } from './modules/reservations/reservations.module';
import { AvailabilityModule } from './modules/availability/availability.module';
import { AuthModule } from './modules/auth/auth.module';
import { Table } from './entities/table.entity';
import { Reservation } from './entities/reservation.entity';
import { OpeningHours } from './entities/opening-hours.entity';
import { Blackout } from './entities/blackout.entity';
import { Admin } from './entities/admin.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 3306,
      username: process.env.DB_USERNAME || 'billiard_user',
      password: process.env.DB_PASSWORD || 'billiard_pass',
      database: process.env.DB_DATABASE || 'billiard_booking',
      entities: [Table, Reservation, OpeningHours, Blackout, Admin],

      // WICHTIG: Auf 'true' setzen, damit TypeORM die Tabellen auf dem Server erstellt!
      // Später in Produktion (wenn Daten wichtig sind) auf 'false' ändern und Migrationen nutzen.
      synchronize: true,

      logging: true,
    }),
    TablesModule,
    ReservationsModule,
    AvailabilityModule,
    AuthModule,
  ],
})
export class AppModule {}