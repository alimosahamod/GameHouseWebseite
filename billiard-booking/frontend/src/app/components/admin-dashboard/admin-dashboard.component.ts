import { Component, OnInit, OnDestroy, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService, Reservation, Table } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

interface ReservationWithTable extends Reservation {
  tableName?: string;
}

@Component({
  selector: 'app-admin-dashboard',
  imports: [CommonModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit, OnDestroy {
  private apiService = inject(ApiService);
  private authService = inject(AuthService);
  private refreshInterval?: number;

  reservations = signal<ReservationWithTable[]>([]);
  tables = signal<Table[]>([]);
  loading = signal<boolean>(false);
  errorMessage = signal<string>('');
  successMessage = signal<string>('');
  selectedReservation = signal<ReservationWithTable | null>(null);
  lastUpdate = signal<Date>(new Date());
  
  // Refresh alle 30 Sekunden
  private readonly REFRESH_INTERVAL = 30000;

  // Gefilterte und sortierte Reservierungen
  filteredReservations = computed(() => {
    return this.reservations()
      .filter(r => r.status !== 'cancelled')
      .sort((a, b) => {
        const dateA = new Date(a.startTime);
        const dateB = new Date(b.startTime);
        return dateA.getTime() - dateB.getTime();
      });
  });

  // Gruppiere Reservierungen nach Datum
  reservationsByDate = computed(() => {
    const grouped = new Map<string, ReservationWithTable[]>();
    
    this.filteredReservations().forEach(reservation => {
      const date = this.formatDate(reservation.startTime);
      if (!grouped.has(date)) {
        grouped.set(date, []);
      }
      grouped.get(date)!.push(reservation);
    });

    return Array.from(grouped.entries()).sort((a, b) => 
      new Date(a[0]).getTime() - new Date(b[0]).getTime()
    );
  });

  ngOnInit() {
    this.loadData();
    this.startAutoRefresh();
  }

  ngOnDestroy() {
    this.stopAutoRefresh();
  }

  private startAutoRefresh() {
    this.refreshInterval = window.setInterval(() => {
      this.loadDataSilently();
    }, this.REFRESH_INTERVAL);
  }

  private stopAutoRefresh() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  }

  loadData() {
    this.loading.set(true);
    this.errorMessage.set('');

    // Lade Tische und Reservierungen parallel
    Promise.all([
      this.apiService.getTables().toPromise(),
      this.apiService.getReservations().toPromise()
    ]).then(([tables, reservations]) => {
      this.tables.set(tables || []);
      
      // Füge Tischnamen zu Reservierungen hinzu
      const reservationsWithTables = (reservations || []).map(r => ({
        ...r,
        tableName: tables?.find(t => t.id === r.tableId)?.name
      }));
      
      this.reservations.set(reservationsWithTables);
      this.lastUpdate.set(new Date());
      this.loading.set(false);
    }).catch(error => {
      this.errorMessage.set('Fehler beim Laden der Daten');
      this.loading.set(false);
    });
  }

  // Lade Daten im Hintergrund ohne Loading-Indikator
  private loadDataSilently() {
    Promise.all([
      this.apiService.getTables().toPromise(),
      this.apiService.getReservations().toPromise()
    ]).then(([tables, reservations]) => {
      this.tables.set(tables || []);
      
      const reservationsWithTables = (reservations || []).map(r => ({
        ...r,
        tableName: tables?.find(t => t.id === r.tableId)?.name
      }));
      
      this.reservations.set(reservationsWithTables);
      this.lastUpdate.set(new Date());
    }).catch(error => {
      // Fehler im Hintergrund ignorieren, um UX nicht zu stören
      console.error('Fehler beim automatischen Neuladen:', error);
    });
  }

  viewDetails(reservation: ReservationWithTable) {
    this.selectedReservation.set(reservation);
  }

  closeDetails() {
    this.selectedReservation.set(null);
  }

  deleteReservation(reservation: ReservationWithTable) {
    if (!reservation.id) return;

    const confirmDelete = confirm(
      `Möchten Sie die Reservierung von ${reservation.customerName} wirklich löschen?`
    );

    if (!confirmDelete) return;

    this.loading.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    this.apiService.cancelReservation(reservation.id).subscribe({
      next: () => {
        this.successMessage.set('Reservierung erfolgreich gelöscht');
        this.selectedReservation.set(null);
        this.loadData();
      },
      error: (err) => {
        this.errorMessage.set('Fehler beim Löschen der Reservierung');
        this.loading.set(false);
      }
    });
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('de-DE', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  formatTime(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleTimeString('de-DE', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  calculateEndTime(startTime: string, duration: number): string {
    const date = new Date(startTime);
    date.setMinutes(date.getMinutes() + duration);
    return this.formatTime(date.toISOString());
  }

  logout() {
    this.authService.logout();
  }
}
