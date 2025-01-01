import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppointmentDTO } from '../Models/appointment.dto';
import { BookingDTO } from '../Models/booking.dto';

@Injectable({
  providedIn: 'root'
})
export class AppointmentsService {
  private urlAuGaliciaApi: string;
  private controller: string;

  constructor( private http: HttpClient ) {
    this.controller = 'appointments';
    this.urlAuGaliciaApi = `http://localhost:3000/api/${this.controller}`;
  }

  getAppointmentById(appointmentId: string): Observable<AppointmentDTO> {
    return this.http.get<AppointmentDTO>(`${this.urlAuGaliciaApi}/${appointmentId}`);
  }
 
  getAllAppointments(): Observable<AppointmentDTO[]> {
    return this.http.get<AppointmentDTO[]>(this.urlAuGaliciaApi);
  }


  createAppointment(appointment: AppointmentDTO): Observable<AppointmentDTO> {
    return this.http.post<AppointmentDTO>(this.urlAuGaliciaApi, appointment);
  }

  updateAppointment(appointmentId: string, appointment: Partial<AppointmentDTO>): Observable<AppointmentDTO> {
    return this.http.patch<AppointmentDTO>(`${this.urlAuGaliciaApi}/${appointmentId}`, appointment);
  }

  deleteAppointment(appointmentId: string): Observable<void> {
    return this.http.delete<void>(`${this.urlAuGaliciaApi}/${appointmentId}`);
  }

  bookAppointment(appointmentId: string, bookingDTO: BookingDTO): Observable<any> {
    return this.http.post<any>(`${this.urlAuGaliciaApi}/${appointmentId}/booking`, bookingDTO);
  }

  cancelBooking(id: number): Observable<void> {
    return this.http.delete<void>(`${this.urlAuGaliciaApi}/${id}/cancel`);
  }

  getAllAppointmentsByProduct(productId: string): Observable<AppointmentDTO[]> {
    return this.http.get<AppointmentDTO[]>(`${this.urlAuGaliciaApi}/${productId}/product`)
  }
}
