import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { OpeningHours } from '../../entities/opening-hours.entity';
import { Reservation } from '../../entities/reservation.entity';
import { Blackout } from '../../entities/blackout.entity';
import { Table } from '../../entities/table.entity';

interface TimeSlot {
  startTime: string;
  endTime: string;
  available: boolean;
  tableId?: number;
  reservation?: {
    id: number;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
  };
}

@Injectable()
export class AvailabilityService {
  constructor(
    @InjectRepository(OpeningHours)
    private openingHoursRepository: Repository<OpeningHours>,
    @InjectRepository(Reservation)
    private reservationsRepository: Repository<Reservation>,
    @InjectRepository(Blackout)
    private blackoutsRepository: Repository<Blackout>,
    @InjectRepository(Table)
    private tablesRepository: Repository<Table>,
  ) {}

  async getAvailableSlots(date: string, tableId?: number): Promise<any> {
    const targetDate = new Date(date);
    const dayOfWeek = targetDate.getDay();

    // Öffnungszeiten für den Tag abrufen
    const openingHours = await this.openingHoursRepository.findOne({
      where: { dayOfWeek, isActive: true }
    });

    if (!openingHours) {
      return { date, slots: [], message: 'Geschlossen' };
    }

    // Alle aktiven Tische oder spezifischen Tisch
    let tables: Table[];
    if (tableId) {
      const table = await this.tablesRepository.findOne({ 
        where: { id: tableId, isActive: true } 
      });
      tables = table ? [table] : [];
    } else {
      tables = await this.tablesRepository.find({ 
        where: { isActive: true } 
      });
    }

    if (tables.length === 0) {
      return { date, slots: [], message: 'Keine Tische verfügbar' };
    }

    // Zeitslots generieren (30-min Intervalle)
    const slots = this.generateTimeSlots(
      targetDate,
      openingHours.openTime,
      openingHours.closeTime
    );

    // Reservierungen für den Tag abrufen
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    const reservations = await this.reservationsRepository.find({
      where: {
        tableId: tableId || undefined,
        startTime: Between(startOfDay, endOfDay),
        status: 'confirmed'
      }
    });

    const blackouts = await this.blackoutsRepository.find({
      where: {
        tableId: tableId || undefined,
        startTime: LessThanOrEqual(endOfDay),
        endTime: MoreThanOrEqual(startOfDay)
      }
    });

    // Verfügbarkeit pro Tisch und Slot berechnen
    const availability = tables.map(table => {
      const tableSlots = slots.map(slot => {
        const slotStart = new Date(slot.startTime);
        const slotEnd = new Date(slot.endTime);

        // Prüfen ob Slot durch Reservierung blockiert ist
        const blockingReservation = reservations.find(res => {
          if (tableId && res.tableId !== tableId) return false;
          if (!tableId && res.tableId !== table.id) return false;
          
          const resStart = new Date(res.startTime);
          const resEnd = new Date(res.endTime);
          
          return (slotStart < resEnd && slotEnd > resStart);
        });

        // Prüfen ob Slot durch Blackout blockiert ist
        const isBlackedOut = blackouts.some(blackout => {
          if (tableId && blackout.tableId && blackout.tableId !== tableId) return false;
          if (!tableId && blackout.tableId && blackout.tableId !== table.id) return false;
          
          const blackoutStart = new Date(blackout.startTime);
          const blackoutEnd = new Date(blackout.endTime);
          
          return (slotStart < blackoutEnd && slotEnd > blackoutStart);
        });

        const slotData: TimeSlot = {
          startTime: slot.startTime,
          endTime: slot.endTime,
          available: !blockingReservation && !isBlackedOut
        };

        // Reservierungsdetails hinzufügen wenn Slot durch Reservierung blockiert
        if (blockingReservation) {
          slotData.reservation = {
            id: blockingReservation.id,
            customerName: blockingReservation.customerName,
            customerEmail: blockingReservation.customerEmail,
            customerPhone: blockingReservation.customerPhone
          };
        }

        return slotData;
      });

      return {
        tableId: table.id,
        tableName: table.name,
        slots: tableSlots
      };
    });

    return {
      date,
      openingHours: {
        open: openingHours.openTime,
        close: openingHours.closeTime
      },
      tables: availability
    };
  }

  private generateTimeSlots(date: Date, openTime: string, closeTime: string): TimeSlot[] {
    const slots: TimeSlot[] = [];
    const [openHour, openMinute] = openTime.split(':').map(Number);
    const [closeHour, closeMinute] = closeTime.split(':').map(Number);

    const current = new Date(date);
    current.setHours(openHour, openMinute, 0, 0);

    const end = new Date(date);
    end.setHours(closeHour, closeMinute, 0, 0);

    while (current < end) {
      const slotStart = new Date(current);
      const slotEnd = new Date(current);
      slotEnd.setMinutes(slotEnd.getMinutes() + 30);

      if (slotEnd <= end) {
        slots.push({
          startTime: slotStart.toISOString(),
          endTime: slotEnd.toISOString(),
          available: true
        });
      }

      current.setMinutes(current.getMinutes() + 30);
    }

    return slots;
  }
}
