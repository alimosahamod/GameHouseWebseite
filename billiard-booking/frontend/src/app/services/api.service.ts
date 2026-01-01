import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Table {
  id: number;
  name: string;
  description: string;
  isActive: boolean;
}

export interface Reservation {
  id?: number;
  tableId: number;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  startTime: string;
  endTime?: string;
  durationMinutes: number;
  status?: string;
}

export interface TimeSlot {
  startTime: string;
  endTime: string;
  available: boolean;
  reservation?: {
    id: number;
    customerName: string;
    customerEmail?: string;
    customerPhone?: string;
  };
}

export interface TableAvailability {
  tableId: number;
  tableName: string;
  slots: TimeSlot[];
}

export interface AvailabilityResponse {
  date: string;
  openingHours: {
    open: string;
    close: string;
  };
  tables: TableAvailability[];
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000';

  getTables(): Observable<Table[]> {
    return this.http.get<Table[]>(`${this.apiUrl}/tables`);
  }

  getAvailability(date: string, tableId?: number): Observable<AvailabilityResponse> {
    const params: Record<string, string> = { date };
    if (tableId) {
      params['tableId'] = tableId.toString();
    }
    return this.http.get<AvailabilityResponse>(`${this.apiUrl}/availability`, { params });
  }

  createReservation(reservation: Reservation): Observable<Reservation> {
    return this.http.post<Reservation>(`${this.apiUrl}/reservations`, reservation);
  }

  getReservations(): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.apiUrl}/reservations`);
  }

  cancelReservation(id: number): Observable<Reservation> {
    return this.http.patch<Reservation>(`${this.apiUrl}/reservations/${id}/cancel`, {});
  }
}
