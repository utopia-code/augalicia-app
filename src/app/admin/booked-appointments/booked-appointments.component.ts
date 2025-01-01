import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { AppointmentDTO } from '../../Models/appointment.dto';
import { BookingDTO } from '../../Models/booking.dto';
import { Image, ProductDTO } from '../../Models/product.dto';
import { AppointmentsService } from '../../Services/appointments.service';
import { LocalStorageService } from '../../Services/local-storage.service';
import { ProductService } from '../../Services/product.service';
import { LayoutComponent } from '../layout/layout.component';

@Component({
  selector: 'app-booked-appointments',
  standalone: true,
  imports: [CommonModule, LayoutComponent, TranslateModule],
  templateUrl: './booked-appointments.component.html',
  styleUrl: './booked-appointments.component.scss'
})
export class BookedAppointmentsComponent {
  appointments!: AppointmentDTO[];
  bookings!: BookingDTO[];
  emptyList: string = "";

  appointmentsGroupedByProduct!: {
    product: ProductDTO;
    bookings: BookingDTO[];
    appointmentDetails: AppointmentDTO;
  }[];

  constructor(
    private appointmentService: AppointmentsService,
    private productService: ProductService,
    private localStorageService: LocalStorageService
  ) {
    this.getAllBookedAppointments();
  }

  getAllBookedAppointments(): void {
    const userEmail = this.localStorageService.get('user_email');

    if (userEmail) {
      this.appointmentService.getAllAppointments().subscribe({
        next: (appointments: AppointmentDTO[]) => {
          if (appointments) {
            this.appointments = appointments.filter(appointment => appointment.bookings && appointment.bookings.length > 0);

            const groupedByProduct: { [key: string]: { product: ProductDTO; bookings: BookingDTO[]; appointmentDetails: AppointmentDTO } } = {};

            this.appointments.forEach(appointment => {
              if (!groupedByProduct[appointment.productId]) {
                groupedByProduct[appointment.productId] = {
                  product: undefined as any,
                  bookings: [],
                  appointmentDetails: appointment,
                };
              }
              groupedByProduct[appointment.productId].bookings.push(...appointment.bookings!);
            });
  
            Object.keys(groupedByProduct).forEach(productId => {
              this.productService.getProductById(productId).subscribe({
                next: (product: ProductDTO) => {
                  if (product.images && product.images.length > 0) {
                    product.images.forEach(image => {
                      if (!image.url.startsWith('http://localhost:3000')) {
                        image.url = `http://localhost:3000${image.url.replace('/public', '')}`;
                      }
                    });
                  }
                  groupedByProduct[productId].product = product;
                }
              });
            });

            this.appointmentsGroupedByProduct = Object.values(groupedByProduct);
            this.emptyList = (this.appointmentsGroupedByProduct.length === 0) ? 'ALERT.EMPTY_LIST' : '';
          } 
        }
      })
    }
  }

  getMainImage(images: Image[] | undefined): Image | undefined {
    return images?.find(image => image.url.endsWith('01.webp'));
  }
}
