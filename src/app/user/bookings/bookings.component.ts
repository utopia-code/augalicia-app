import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { AppointmentDTO } from '../../Models/appointment.dto';
import { BookingDTO } from '../../Models/booking.dto';
import { ProductDTO } from '../../Models/product.dto';
import { AppointmentsService } from '../../Services/appointments.service';
import { BookingsService } from '../../Services/bookings.service';
import { LocalStorageService } from '../../Services/local-storage.service';
import { LayoutComponent } from '../layout/layout.component';

@Component({
  selector: 'app-bookings',
  standalone: true,
  imports: [CommonModule, LayoutComponent, TranslateModule, FontAwesomeModule],
  templateUrl: './bookings.component.html',
  styleUrl: './bookings.component.scss'
})
export class BookingsComponent {
  bookings!: BookingDTO[];
  appointments!: AppointmentDTO[];
  product!: ProductDTO;
  emptyList: string = "";
  showBookings: boolean = false;

  currentDeleteBooking!: BookingDTO;

  faTrashCan = faTrashCan;

  constructor(
    private bookingsService: BookingsService,
    private localStorageService: LocalStorageService,
    private appointmentsService: AppointmentsService
  ) {
    this.getAllBookings()
  }

  getAllBookings(): void {
    const userEmail = this.localStorageService.get('user_email');

    if(userEmail) {
      this.bookingsService.getAllBookingsByUser().subscribe({
        next: (bookings: BookingDTO[]) => {
          this.bookings = bookings;
          console.log(bookings)

          this.appointments = bookings
            .map(booking => booking.appointment)
            .filter((appointment): appointment is AppointmentDTO => appointment !== undefined);

          console.log('booking appointment', this.appointments);
          

          this.appointments.forEach(appointment => {
            console.log('appointments id', appointment.product);
          });

          this.showBookings = (this.bookings.length > 0) ? true : false;
          this.emptyList = (this.bookings.length > 0) ? '' : 'ALERT.EMPTY_LIST';

        },
        error: (error: HttpErrorResponse) => {
          console.log(error.error.message)
        }
      })
    }
  }

  setCurrentDeleteBooking(booking: BookingDTO): void {
    this.currentDeleteBooking = booking;
  }

  cancelBooking(booking: BookingDTO): void {
    const userEmail = this.localStorageService.get('user_email');

    if (userEmail && booking.id && booking.appointment?.id) {
      if (confirm(`Está seguro que quiere eliminar la reserva con fecha ${booking.appointment?.date} y hora ${booking.appointment?.hour}?`)) {
        this.appointmentsService.cancelBooking(booking.id).subscribe({
          next: (res) => {
            console.log(res)
            this.getAllBookings();
          },
          error: (error) => {
            console.log('Error cancelling booking:', error.error.message)
          }
        })
      }
    }
  }
}
