import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCircleExclamation, faCircleInfo, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { AppointmentDTO } from '../../Models/appointment.dto';
import { BookingDTO } from '../../Models/booking.dto';
import { ProductDTO } from '../../Models/product.dto';
import { AppointmentsService } from '../../Services/appointments.service';
import { LocalStorageService } from '../../Services/local-storage.service';
import { NearbyProductService } from '../../Services/nearby-products.service';
import { ProductService } from '../../Services/product.service';
import { SharedService } from '../../Services/shared.service';
import { LineBreakPipe } from '../../pipes/line-break.pipe';
import { ShortUrlPipe } from '../../pipes/short-url.pipe';
import { ListDisplayComponent } from '../../shared/list-display/list-display.component';
import { MapComponent } from '../../shared/map/map.component';
import { RelatedProductsListComponent } from '../related-products-list/related-products-list.component';

export interface bindPopupMapInfo {
  lat: number;
  lng: number;
  type: string;
  name: string;
  address: string;
  cp: string;
  location: string;
}

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    ReactiveFormsModule, 
    LineBreakPipe, 
    ShortUrlPipe, 
    TranslateModule, 
    MapComponent,
    RouterModule,
    RelatedProductsListComponent,
    ListDisplayComponent,
    FontAwesomeModule
  ],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss'
})
export class ProductDetailComponent implements OnInit {
  product!: ProductDTO;
  productInfoMap!: bindPopupMapInfo;
  nearbyProducts!: ProductDTO[];
  nearbyProductsInfoMap: bindPopupMapInfo[] = [];

  booking!: BookingDTO;
  people: UntypedFormControl;
  appointmentId: UntypedFormControl;
  bookingForm: UntypedFormGroup;
  appointmentsList: AppointmentDTO[] = [];
  showBookingButton: boolean = false;
  activeRowIndex: number | null = null;

  isUserAccount: boolean;
  showBookingForm: boolean;
  private productId: string | null = null;
  errorMessage: string | null = null;

  faCircleInfo = faCircleInfo;
  faCircleExclamation = faCircleExclamation;
  faTriangleExclamation = faTriangleExclamation;

  constructor (
    private activatedRoute: ActivatedRoute,
    private productService: ProductService,
    private nearbyProductsService: NearbyProductService,
    private formBuilder: UntypedFormBuilder,
    private localStorageService: LocalStorageService,
    private appointmentsService: AppointmentsService,
    private sharedService: SharedService
  ) {
    this.productId = this.activatedRoute.snapshot.paramMap.get('id');
    this.booking = new BookingDTO(0, 0, '');
    this.isUserAccount = false;
    this.showBookingForm = false;

    this.people = new UntypedFormControl(0, [
      Validators.required, Validators.min(1)
    ]);

    this.appointmentId = new UntypedFormControl(0, [Validators.required]);

    this.bookingForm = this.formBuilder.group({
      people: this.people,
      appointmentId: this.appointmentId
    });
  }

  getCoordinates(product: ProductDTO): { lat: number, lng: number } {
    const coordinates = product.coordinates.split(',').map(coordinate => parseFloat(coordinate.trim()));
    if (coordinates.length === 2 && !isNaN(coordinates[0]) && !isNaN(coordinates[1])) {
      return { lat: coordinates[0], lng: coordinates[1] };
    }
    return { lat: 0, lng: 0 };
  }

  loadAppointments(): void {
    const userRole = this.localStorageService.get('user_role');
  
    if (userRole === 'user') {
      if(this.productId) {
        this.appointmentsService.getAllAppointmentsByProduct(this.productId).subscribe({
          next: (appointments: AppointmentDTO[]) => {
            this.appointmentsList = appointments;
            if (this.appointmentsList.length > 0) {
              this.showBookingButton = true;
            }
            console.log('appointments: ', this.appointmentsList)
          },
          error: (error: HttpErrorResponse) => {
            console.log(error)
          }
        })
      }
    } 
  }

  groupProducts(products: any[]): any[] {
    const chunkSize = 4;
    const result = [];
    
    for (let i = 0; i < products.length; i += chunkSize) {
      result.push(products.slice(i, i + chunkSize));
    }
    
    return result;
  }

  private formatImages(product: ProductDTO): void {
    if (product.images &&  product.images.length > 0) {
      product.images.forEach(image => {
        if (!image.url.startsWith('http://localhost:3000')) {
          image.url = `http://localhost:3000${image.url.replace('/public', '')}`;
        }
      });
    }
  }

  private getProductInfo(product: ProductDTO): bindPopupMapInfo {
    const { lat, lng } = this.getCoordinates(product);
    const type = product.typeProduct?.name || 'Unknown';
    const { name, address, cp, location } = product;

    return { lat, lng, type, name, address, cp, location };
  }
  
  ngOnInit(): void {
    if(this.productId) {
      this.productService.getProductById(this.productId).subscribe({
        next: (product: ProductDTO) => {
          this.product = { ...product };

          this.formatImages(this.product);
          this.productInfoMap = this.getProductInfo(this.product)

          this.loadAppointments()

          const { lat, lng } = this.getCoordinates(this.product);
          const distanceKm = 20;

          this.nearbyProductsService.getNearbyProducts(lat, lng, distanceKm).subscribe({
            next: (nearbyProducts: ProductDTO[]) => {
              this.nearbyProducts = nearbyProducts; 

              this.nearbyProducts.forEach(product => this.formatImages(product));
              this.nearbyProductsInfoMap = this.nearbyProducts.map(product => this.getProductInfo(product));

              console.log(this.nearbyProducts)
            },
            error: (err) => {
              console.error('Error fetching nearby products:', err);
            }
          });
        },
        error: (error) => {
          console.log('Error loading the product', error);
        }
      });
    }
  }

  toggleBookingForm(index: number): void {
    const userRole = this.localStorageService.get('user_role');
  
    if (userRole === 'user') {
      this.activeRowIndex = index; 
      const selectedAppointment = this.appointmentsList[index];
      this.bookingForm.patchValue({ appointmentId: selectedAppointment.id });
    } else {
      this.errorMessage = 'BOOKINGS.IF_NOT_USER';
      this.sharedService.showToast(this.errorMessage);
    }
  }

  closeBookingForm(): void {
    this.activeRowIndex = null;
  }

  showPopUpBooking() {
    const userRole = this.localStorageService.get('user_role');

    if (userRole === 'user') {
      this.isUserAccount = true;
      this.loadAppointments();
    } else {
      console.log('Access denied: user is not authenticated or does not have the USER role');
    }
  }

  getRemainingPlacesTitle(appointment: { max_capacity: number; booked_count: number }): string {
    const remainingPlaces = appointment.max_capacity - appointment.booked_count;

    if (remainingPlaces <= 5) {
      return `Sólo quedan ${remainingPlaces} plazas`;
    }

    return '';
  }

  getAppointmentDetails(appointmentId: number | null): string {
    const appointment = this.appointmentsList.find((appointment) => appointment.id === appointmentId);
    return appointment ? `${appointment.date} - ${appointment.hour}` : 'No disponible';
  }

  bookAppointment(): void {
    this.errorMessage = null;

    const userEmail = this.localStorageService.get('user_email');

    if(userEmail) {
      const bookingData = {
        userEmail,
        appointmentId: this.bookingForm.value.appointmentId,
        people: this.bookingForm.value.people
      }

      console.log('BookingData: ', bookingData)

      if (this.bookingForm.valid) {
        this.appointmentsService.bookAppointment(bookingData.appointmentId, bookingData).subscribe({
          next: (appointment) => {
            console.log('Booked appointment: ', appointment);
            this.closeBookingForm();
            this.loadAppointments();
          },
          error: (error: HttpErrorResponse) => {
            console.log('Error to book the appointment: ', error)
            this.errorMessage = error.error.message;
          }
        })
      } else {
        console.log('Invalid form')
      }
    }
  }

}
