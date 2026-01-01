import { Injectable, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan, MoreThan, DataSource } from 'typeorm';
import { Reservation } from '../../entities/reservation.entity';
import { OpeningHours } from '../../entities/opening-hours.entity';
import { Blackout } from '../../entities/blackout.entity';
import { Table } from '../../entities/table.entity';
import { CreateReservationDto } from '../../dto/create-reservation.dto';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectRepository(Reservation)
    private reservationsRepository: Repository<Reservation>,
    @InjectRepository(OpeningHours)
    private openingHoursRepository: Repository<OpeningHours>,
    @InjectRepository(Blackout)
    private blackoutsRepository: Repository<Blackout>,
    @InjectRepository(Table)
    private tablesRepository: Repository<Table>,
    private dataSource: DataSource,
  ) {}

  async create(createReservationDto: CreateReservationDto): Promise<Reservation> {
    const { tableId, startTime, durationMinutes, customerName, customerEmail, customerPhone } = createReservationDto;

    // Validierung: Tisch existiert und ist aktiv
    const table = await this.tablesRepository.findOne({ 
      where: { id: tableId, isActive: true } 
    });
    if (!table) {
      throw new BadRequestException('Tisch nicht gefunden oder nicht verfügbar');
    }

    // Startzeit und Endzeit berechnen
    const start = new Date(startTime);
    const end = new Date(start);
    end.setMinutes(end.getMinutes() + durationMinutes);

    // Validierung: Dauer in 30-Minuten-Schritten
    if (durationMinutes % 30 !== 0) {
      throw new BadRequestException('Dauer muss in 30-Minuten-Schritten sein');
    }

    // Validierung: Innerhalb der Öffnungszeiten
    const dayOfWeek = start.getDay();
    const openingHours = await this.openingHoursRepository.findOne({
      where: { dayOfWeek, isActive: true }
    });

    if (!openingHours) {
      throw new BadRequestException('An diesem Tag geschlossen');
    }

    const startTimeStr = start.toTimeString().substring(0, 5);
    const endTimeStr = end.toTimeString().substring(0, 5);

    if (startTimeStr < openingHours.openTime || endTimeStr > openingHours.closeTime) {
      throw new BadRequestException(
        `Reservierung muss innerhalb der Öffnungszeiten sein (${openingHours.openTime} - ${openingHours.closeTime})`
      );
    }

    // Transaction für Konfliktsicherheit
    return await this.dataSource.transaction(async manager => {
      // Prüfen auf Blackouts
      const blackoutConflict = await manager.findOne(Blackout, {
        where: [
          {
            tableId,
            startTime: LessThan(end),
            endTime: MoreThan(start)
          },
          {
            tableId: null,
            startTime: LessThan(end),
            endTime: MoreThan(start)
          }
        ]
      });

      if (blackoutConflict) {
        throw new ConflictException('Tisch ist zu dieser Zeit nicht verfügbar (Wartung/Event)');
      }

      // Prüfen auf bestehende Reservierungen (mit Locking für Race Conditions)
      const existingReservation = await manager
        .createQueryBuilder(Reservation, 'reservation')
        .setLock('pessimistic_write')
        .where('reservation.tableId = :tableId', { tableId })
        .andWhere('reservation.status = :status', { status: 'confirmed' })
        .andWhere('reservation.startTime < :end', { end })
        .andWhere('reservation.endTime > :start', { start })
        .getOne();

      if (existingReservation) {
        throw new ConflictException('Tisch ist zu dieser Zeit bereits reserviert');
      }

      // Reservierung erstellen
      const reservation = manager.create(Reservation, {
        tableId,
        customerName,
        customerEmail,
        customerPhone,
        startTime: start,
        endTime: end,
        durationMinutes,
        status: 'confirmed'
      });

      return await manager.save(reservation);
    });
  }

  async findAll(): Promise<Reservation[]> {
    return this.reservationsRepository.find({
      relations: ['table'],
      order: { startTime: 'DESC' }
    });
  }

  async findOne(id: number): Promise<Reservation> {
    return this.reservationsRepository.findOne({
      where: { id },
      relations: ['table']
    });
  }

  async cancel(id: number): Promise<Reservation> {
    const reservation = await this.reservationsRepository.findOne({ where: { id } });
    
    if (!reservation) {
      throw new BadRequestException('Reservierung nicht gefunden');
    }

    if (reservation.status === 'cancelled') {
      throw new BadRequestException('Reservierung wurde bereits storniert');
    }

    reservation.status = 'cancelled';
    return this.reservationsRepository.save(reservation);
  }
}
