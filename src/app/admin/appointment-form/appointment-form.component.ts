import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ReactiveFormsModule, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { AppointmentDTO } from '../../Models/appointment.dto';
import { ProductDTO } from '../../Models/product.dto';
import { AppointmentsService } from '../../Services/appointments.service';
import { LocalStorageService } from '../../Services/local-storage.service';
import { ProductService } from '../../Services/product.service';

@Component({
  selector: 'app-appointment-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule],
  templateUrl: './appointment-form.component.html',
  styleUrl: './appointment-form.component.scss'
})
export class AppointmentFormComponent implements OnInit {
  @Input() appointmentId: string | null = null;
  @Output() sentComplete = new EventEmitter<boolean>();
  @Output() formCancelled = new EventEmitter<void>();

  isUpdateMode: boolean;
  isOpenMode: boolean = false;
  isValidForm: boolean | null;
  errorMessage: string | null = null;

  appointment!: AppointmentDTO;

  date: UntypedFormControl;
  hour: UntypedFormControl;
  price: UntypedFormControl;
  max_capacity: UntypedFormControl;
  booked_count: number = 0;
  is_booked: boolean = false;
  productId!: UntypedFormControl;

  appointmentForm: UntypedFormGroup;

  productsList: ProductDTO[] = [];

  constructor(
    private formBuilder: UntypedFormBuilder,
    private appointmentService: AppointmentsService,
    private productService: ProductService,
    private localStorageService: LocalStorageService
  ) {
    this.isValidForm = null;
    this.isUpdateMode = false;

    this.appointment = new AppointmentDTO('', '', 0, 0, 0, false, 0, '');

    this.date = new UntypedFormControl(this.appointment.date, [
      Validators.required
    ]);

    this.hour = new UntypedFormControl(this.appointment.hour, [
      Validators.required
    ]);

    this.price = new UntypedFormControl(this.appointment.hour, [
      Validators.required
    ]);

    this.max_capacity = new UntypedFormControl(this.appointment.max_capacity, [
      Validators.required
    ]);

    this.productId = new UntypedFormControl(null, [ Validators.required ]);

    this.loadProducts();

    this.appointmentForm = this.formBuilder.group({
      date: this.date,
      hour: this.hour,
      price: this.price,
      max_capacity: this.max_capacity,
      productId: this.productId
    })
  }

  loadProducts(): void {
    const userEmail = this.localStorageService.get('user_email');
    if (userEmail) {
      this.productService.getAllProductsByUser().subscribe({
        next: (products: ProductDTO[]) => {
          this.productsList = products;
        },
        error: (error: HttpErrorResponse) => {
          console.log(error);
        }
      })
    }
  }

  ngOnInit(): void {
    const userEmail = this.localStorageService.get('user_email');
    if (userEmail) {
      this.isOpenMode = true;

      if (this.appointmentId) {
        this.isUpdateMode = true;
  
        this.appointmentService.getAppointmentById(this.appointmentId).subscribe({
          next: (appointment: AppointmentDTO) => {
            this.appointment = appointment;
  
            this.appointmentForm.patchValue({
              date: appointment.date,
              hour: appointment.hour,
              price: appointment.price,
              max_capacity: appointment.max_capacity,
              productId: appointment.productId
            })
          }
        })     
      }
    }
  }

  private createAppointment(): void {
    let responseOK: boolean = false;
    this.errorMessage = null;

    const userEmail = this.localStorageService.get('user_email');
    if (userEmail) {
      this.appointment.userEmail = userEmail;
      this.appointment.booked_count = this.booked_count;
      this.appointment.is_booked = this.is_booked;
      this.appointment.productId = this.appointmentForm.value.productId;

      this.appointmentService.createAppointment(this.appointment).subscribe({
        next: (res) => {
          responseOK = true
          console.log(res)
        },
        error: (error) => {
          this.errorMessage = error.error.message
          console.log(error)
        },
        complete: () => {
          if (responseOK) {
            this.isOpenMode = false;
            this.sentComplete.emit(true);
          }
        }
      })
    }
  }

  private updateAppointment(): void {
    let responseOK: boolean = false;
    this.errorMessage = null;

    if (this.appointmentId) {
      const { productId, price, ...updatedAppointment } = this.appointmentForm.value;
      updatedAppointment.userEmail = this.localStorageService.get('user_email');
      updatedAppointment.productId = productId ?? this.appointment.productId;
      updatedAppointment.price = parseFloat(price);

      this.appointmentService.updateAppointment(this.appointmentId, updatedAppointment).subscribe({
        next: (res) => {
          responseOK = true
          console.log(res)
        },
        error: (error) => {
          this.errorMessage = error.error.message
          console.log(error)
        },
        complete: () => {
          if (responseOK) {
            this.isOpenMode = false;
            this.sentComplete.emit(true);
          }
        }
      })
      
    }
  }

  saveAppointment() {
    this.isValidForm = false;

    if (this.appointmentForm.invalid) {
      return
    }

    this.isValidForm = true;

    this.appointment = this.appointmentForm.value;

    console.log(this.appointment)

    if (this.isUpdateMode) {
      this.updateAppointment()
    } else {
      this.createAppointment()
    }
  }

  cancelForm(): void {
    this.formCancelled.emit();
  }
  
}
