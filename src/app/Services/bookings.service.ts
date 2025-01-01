import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BookingDTO } from '../Models/booking.dto';

@Injectable({
  providedIn: 'root'
})
export class BookingsService {
  private urlAuGaliciaApi: string;
  private controller: string;

  constructor( private http: HttpClient ) {
    this.controller = 'bookings';
    this.urlAuGaliciaApi = `http://localhost:3000/api/${this.controller}`;
  }

  getAllBookingsByUser(): Observable<BookingDTO[]> {
    return this.http.get<BookingDTO[]>(this.urlAuGaliciaApi);
  }
}
