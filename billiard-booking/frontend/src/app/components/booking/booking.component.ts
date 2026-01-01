import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService, Table, AvailabilityResponse, TimeSlot, Reservation } from '../../services/api.service';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css']
})
export class BookingComponent implements OnInit {
  private apiService = inject(ApiService);
  private router = inject(Router);

  menuOpen = signal<boolean>(false);
  showScheduleModal = signal<boolean>(false);
  scheduleDate = signal<string>(this.getTodayDate());
  tables = signal<Table[]>([]);
  currentWeekStart = signal<Date>(this.getWeekStart(new Date()));
  selectedDate = signal<string>(this.getTodayDate());
  availability = signal<AvailabilityResponse | null>(null);
  selectedDuration = signal<number>(0); // 0 = noch nicht ausgewählt
  selectedStartTime = signal<string>('');
  selectedTimeSlot = signal<{ tableId: number; tableName: string; startTime: string } | null>(null);

  weekDays = computed(() => {
    const start = this.currentWeekStart();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const days = [];

    for (let i = 0; i < 7; i++) {
      const day = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i);
      const isPast = day < today;

      // Formatiere Datum als YYYY-MM-DD ohne Timezone-Konvertierung
      const year = day.getFullYear();
      const month = String(day.getMonth() + 1).padStart(2, '0');
      const date = String(day.getDate()).padStart(2, '0');
      const dateString = `${year}-${month}-${date}`;

      days.push({
        date: day,
        dateString: dateString,
        dayName: day.toLocaleDateString('de-DE', { weekday: 'short' }),
        dayNumber: day.getDate(),
        isToday: this.isSameDay(day, new Date()),
        isSelected: dateString === this.selectedDate(),
        isPast: isPast
      });
    }
    return days;
  });

  // Kundendaten
  customerName = signal<string>('');
  customerEmail = signal<string>('');
  customerPhone = signal<string>('');

  loading = signal<boolean>(false);
  errorMessage = signal<string>('');
  successMessage = signal<string>('');
  reservationSuccess = signal<boolean>(false);
  reservationData = signal<{
    tableName: string;
    date: string;
    startTime: string;
    duration: number;
  }>({ tableName: '', date: '', startTime: '', duration: 0 });

  // Dauer-Optionen: 30min bis 12 Stunden in 30min Schritten
  durationOptions: number[] = [];

  constructor() {
    // Generiere Optionen von 1h bis 6h (60, 90, 120, ..., 360)
    for (let i = 60; i <= 360; i += 30) {
      this.durationOptions.push(i);
    }
  }

  ngOnInit() {
    this.loadTables();
  }

  toggleMenu() {
    this.menuOpen.set(!this.menuOpen());
  }

  closeMenu() {
    this.menuOpen.set(false);
  }

  navigateToHome() {
    this.closeMenu();
    this.router.navigate(['/']);
  }

  navigateToPage(page: string) {
    this.closeMenu();
    this.router.navigate([`/${page}`]);
  }

  resetBooking() {
    this.reservationSuccess.set(false);
    this.successMessage.set('');
    this.errorMessage.set('');
    this.selectedDuration.set(0);
    this.selectedStartTime.set('');
    this.selectedTimeSlot.set(null);
    this.loadAvailability();
  }

  showSchedule() {
    this.scheduleDate.set(this.selectedDate());
    this.showScheduleModal.set(true);
    this.loadScheduleAvailability();
  }

  closeSchedule() {
    this.showScheduleModal.set(false);
  }

  changeScheduleDate(direction: number) {
    const currentDate = new Date(this.scheduleDate());
    currentDate.setDate(currentDate.getDate() + direction);
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const date = String(currentDate.getDate()).padStart(2, '0');
    this.scheduleDate.set(`${year}-${month}-${date}`);
    this.loadScheduleAvailability();
  }

  loadScheduleAvailability() {
    this.apiService.getAvailability(this.scheduleDate()).subscribe({
      next: (data) => {
        this.availability.set(data);
      },
      error: (err) => {
        console.error('Error loading schedule availability:', err);
      }
    });
  }

  showFloorPlan() {
    // TODO: Zeige Lageplan-Modal oder navigiere zu Lageplan-Seite
    console.log('Lageplan anzeigen');
  }

  getTableNumber(name: string): string {
    return name.replace(/Tisch\s*/i, '');
  }

  getReservationBlocks(): Array<{left: number; top: number; width: number; height: number; customerName: string}> {
    const availability = this.availability();
    const allTables = this.tables(); // Referenz für die Spaltenreihenfolge

    if (!availability || allTables.length === 0) return [];

    const blocks: Array<{left: number; top: number; width: number; height: number; customerName: string}> = [];
    const tableWidth = 100; // pixels per table column

    // Process each table's slots
    availability.tables.forEach((table) => {
      // FIX: Bestimme die Position basierend auf der ID in der Haupt-Tischliste (Spalten)
      // anstatt einfach den Index der Verfügbarkeits-Liste zu nehmen.
      const columnIndex = allTables.findIndex(t => t.id === table.tableId);

      if (columnIndex === -1) return; // Tisch nicht in den Spalten gefunden

      const tableLeft = 70 + (columnIndex * tableWidth); // 70px for time labels

      table.slots.forEach((slot) => {
        if (!slot.available) {
          let startHour = 0;
          let startMinute = 0;

          if (slot.startTime.includes('T')) {
            const date = new Date(slot.startTime);
            startHour = date.getHours();
            startMinute = date.getMinutes();
          } else {
            const parts = slot.startTime.split(':');
            if (parts.length >= 2) {
              startHour = parseInt(parts[0], 10);
              startMinute = parseInt(parts[1], 10);
            }
          }

          // Adjust for opening hours (14:00 = 0)
          let hourOffset = startHour >= 14 ? startHour - 14 : startHour + 10; // Handle midnight wrap
          const top = (hourOffset * 60) + (startMinute); // 60px per hour

          const height = 30; // Each slot is 30 minutes = 30px

          blocks.push({
            left: tableLeft,
            top: top,
            width: tableWidth - 10, // Some padding
            height: height,
            customerName: slot.reservation?.customerName || 'Belegt'
          });
        }
      });
    });

    return blocks;
  }

  getTodayDate(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const date = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${date}`;
  }

  getWeekStart(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Montag als Wochenstart
    d.setDate(diff);
    d.setHours(0, 0, 0, 0); // Setze auf Mitternacht
    return d;
  }

  isSameDay(date1: Date, date2: Date): boolean {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
  }

  nextWeek() {
    const current = this.currentWeekStart();
    const next = new Date(current);
    next.setDate(current.getDate() + 7);
    this.currentWeekStart.set(next);
  }

  previousWeek() {
    const current = this.currentWeekStart();
    const prev = new Date(current);
    prev.setDate(current.getDate() - 7);
    const today = this.getWeekStart(new Date());
    if (prev >= today) {
      this.currentWeekStart.set(prev);
    }
  }

  canGoToPreviousWeek(): boolean {
    const current = this.currentWeekStart();
    const prev = new Date(current);
    prev.setDate(current.getDate() - 7);
    const todayWeekStart = this.getWeekStart(new Date());
    // Vergleiche nur die Daten (ohne Uhrzeit)
    return prev.getTime() >= todayWeekStart.getTime();
  }

  selectDate(dateString: string) {
    const selectedDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Verhindere Auswahl vergangener Tage
    if (selectedDate >= today) {
      this.selectedDate.set(dateString);
      this.selectedStartTime.set('');
      this.selectedTimeSlot.set(null);
      this.loadAvailability();
    }
  }

  selectDuration(duration: number) {
    this.selectedDuration.set(duration);
    this.selectedStartTime.set('');
    this.selectedTimeSlot.set(null);
  }

  selectStartTime(startTime: string) {
    this.selectedStartTime.set(startTime);
    this.selectedTimeSlot.set(null);
  }

  selectTable(tableId: number) {
    const tableName = this.tables().find(t => t.id === tableId)?.name || '';
    const startTime = this.selectedStartTime();
    if (startTime && tableName) {
      this.selectedTimeSlot.set({ tableId, tableName, startTime });
    }
  }

  formatDuration(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (mins === 0) {
      return `${hours}h`;
    } else if (mins === 30) {
      return `${hours} 1/2h`;
    } else {
      return `${hours}h ${mins}min`;
    }
  }

  formatDate(dateString: string): string {
    // Konvertiert YYYY-MM-DD zu DD.MM.YYYY
    const [year, month, day] = dateString.split('-');
    return `${day}.${month}.${year}`;
  }

  getAvailableDurations(): number[] {
    const availability = this.availability();
    const selectedDate = this.selectedDate();
    const todayDate = this.getTodayDate();

    if (!availability) return [];

    const availableDurations = new Set<number>();
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    // Prüfe für jede mögliche Dauer
    for (const duration of this.durationOptions) {
      const slotsNeeded = duration / 30;

      // Prüfe für jeden Tisch
      for (const table of availability.tables) {
        let foundValidSlot = false;

        // Prüfe jeden möglichen Startpunkt
        for (let i = 0; i <= table.slots.length - slotsNeeded; i++) {
          let allAvailable = true;

          // Prüfe ob alle benötigten Slots verfügbar sind
          for (let j = 0; j < slotsNeeded; j++) {
            if (!table.slots[i + j]?.available) {
              allAvailable = false;
              break;
            }
          }

          if (allAvailable) {
            const startTime = this.extractTime(table.slots[i].startTime);

            // Filtere vergangene Zeiten am heutigen Tag
            if (selectedDate === todayDate) {
              const [slotHour, slotMinute] = startTime.split(':').map(Number);
              const slotTotalMinutes = slotHour * 60 + slotMinute;
              const currentTotalMinutes = currentHour * 60 + currentMinute;

              if (slotTotalMinutes <= currentTotalMinutes) {
                continue;
              }
            }

            foundValidSlot = true;
            break;
          }
        }

        if (foundValidSlot) {
          availableDurations.add(duration);
          break; // Diese Dauer ist verfügbar, nächste Dauer prüfen
        }
      }
    }

    return Array.from(availableDurations).sort((a, b) => a - b);
  }

  loadTables() {
    this.apiService.getTables().subscribe({
      next: (tables) => {
        this.tables.set(tables);
        if (tables.length > 0) {
          this.loadAvailability();
        }
      },
      error: (err) => this.errorMessage.set('Fehler beim Laden der Tische')
    });
  }

  loadAvailability() {
    const date = this.selectedDate();

    if (!date) return;

    this.loading.set(true);
    this.errorMessage.set('');

    this.apiService.getAvailability(date).subscribe({
      next: (data) => {
        this.availability.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.errorMessage.set('Fehler beim Laden der Verfügbarkeit');
        this.loading.set(false);
      }
    });
  }

  getAllPossibleStartTimes(): string[] {
    const availability = this.availability();
    if (!availability || availability.tables.length === 0) return [];

    const allTimes = new Set<string>();
    for (const table of availability.tables) {
      for (const slot of table.slots) {
        allTimes.add(this.extractTime(slot.startTime));
      }
    }

    return Array.from(allTimes).sort();
  }

  getAvailableStartTimes(): string[] {
    const availability = this.availability();
    const duration = this.selectedDuration();
    const selectedDate = this.selectedDate();
    const todayDate = this.getTodayDate();

    if (!availability || duration === 0) return [];

    const startTimes = new Set<string>();
    const slotsNeeded = duration / 30;
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    for (const table of availability.tables) {
      for (let i = 0; i <= table.slots.length - slotsNeeded; i++) {
        let allAvailable = true;
        for (let j = 0; j < slotsNeeded; j++) {
          if (!table.slots[i + j]?.available) {
            allAvailable = false;
            break;
          }
        }

        if (allAvailable) {
          const startTime = this.extractTime(table.slots[i].startTime);

          // Filtere vergangene Zeiten am heutigen Tag
          if (selectedDate === todayDate) {
            const [slotHour, slotMinute] = startTime.split(':').map(Number);
            const slotTotalMinutes = slotHour * 60 + slotMinute;
            const currentTotalMinutes = currentHour * 60 + currentMinute;

            if (slotTotalMinutes <= currentTotalMinutes) {
              continue; // Überspringe vergangene Zeiten
            }
          }

          startTimes.add(startTime);
        }
      }
    }

    return Array.from(startTimes).sort();
  }

  isTableAvailable(tableId: number): boolean {
    return this.getAvailableTablesForTime().some(t => t.tableId === tableId);
  }

  getAvailableTablesForTime(): { tableId: number; tableName: string }[] {
    const availability = this.availability();
    const duration = this.selectedDuration();
    const selectedStartTime = this.selectedStartTime();

    if (!availability || !selectedStartTime) return [];

    const tables: Array<{ tableId: number; tableName: string }> = [];
    const slotsNeeded = duration / 30;

    for (const table of availability.tables) {
      for (let i = 0; i <= table.slots.length - slotsNeeded; i++) {
        const startTime = this.extractTime(table.slots[i].startTime);

        if (startTime === selectedStartTime) {
          let allAvailable = true;
          for (let j = 0; j < slotsNeeded; j++) {
            if (!table.slots[i + j]?.available) {
              allAvailable = false;
              break;
            }
          }

          if (allAvailable) {
            tables.push({
              tableId: table.tableId,
              tableName: table.tableName
            });
          }
          break;
        }
      }
    }

    return tables;
  }

  extractTime(timestamp: string): string {
    // Extrahiere HH:MM aus ISO timestamp oder Zeit-String
    if (timestamp.includes('T')) {
      const date = new Date(timestamp);
      return date.toTimeString().substring(0, 5);
    }
    return timestamp.substring(0, 5);
  }

  calculateSlotDuration(startTime: string, endTime: string): number {
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);
    return (end.getTime() - start.getTime()) / (1000 * 60);
  }

  addMinutesToTime(time: string, minutes: number): string {
    const date = new Date(`2000-01-01T${time}`);
    date.setMinutes(date.getMinutes() + minutes);
    return date.toTimeString().substring(0, 5);
  }

  selectTimeSlot(tableId: number, tableName: string, startTime: string) {
    this.selectedTimeSlot.set({ tableId, tableName, startTime });
    this.errorMessage.set('');
    this.successMessage.set('');
  }

  isTimeSlotSelected(tableId: number, startTime: string): boolean {
    const selected = this.selectedTimeSlot();
    return !!selected && selected.tableId === tableId && selected.startTime === startTime;
  }

  canMakeReservation(): boolean {
    return !!(
      this.selectedTimeSlot() &&
      this.customerName().trim()
    );
  }

  makeReservation() {
    if (!this.canMakeReservation()) {
      this.errorMessage.set('Bitte alle erforderlichen Felder ausfüllen');
      return;
    }

    const timeSlot = this.selectedTimeSlot()!;

    const reservation: Reservation = {
      tableId: timeSlot.tableId,
      customerName: this.customerName(),
      customerEmail: this.customerEmail() || undefined,
      customerPhone: this.customerPhone() || undefined,
      startTime: `${this.selectedDate()}T${timeSlot.startTime}:00`,
      durationMinutes: this.selectedDuration()
    };

    this.loading.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    this.apiService.createReservation(reservation).subscribe({
      next: (result) => {
        // Speichere Reservierungsdaten bevor wir sie zurücksetzen
        this.reservationData.set({
          tableName: timeSlot.tableName,
          date: this.selectedDate(),
          startTime: timeSlot.startTime,
          duration: this.selectedDuration()
        });

        this.reservationSuccess.set(true);
        this.successMessage.set('Reservierung erfolgreich erstellt!');
        this.loading.set(false);

        // Formular zurücksetzen
        this.customerName.set('');
        this.customerEmail.set('');
        this.customerPhone.set('');
        this.selectedTimeSlot.set(null);
      },
      error: (err) => {
        this.errorMessage.set(
          err.error?.message || 'Fehler bei der Reservierung. Bitte versuchen Sie es erneut.'
        );
        this.loading.set(false);
      }
    });
  }

}
