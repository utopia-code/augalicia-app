import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPenToSquare, faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { AppointmentDTO } from '../../Models/appointment.dto';
import { AppointmentsService } from '../../Services/appointments.service';
import { LocalStorageService } from '../../Services/local-storage.service';
import { AppointmentFormComponent } from '../appointment-form/appointment-form.component';
import { LayoutComponent } from '../layout/layout.component';

@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [
    CommonModule, 
    LayoutComponent, 
    TranslateModule, 
    AppointmentFormComponent, 
    FontAwesomeModule
  ],
  templateUrl: './appointments.component.html',
  styleUrl: './appointments.component.scss'
})
export class AppointmentsComponent implements OnInit {
  appointments: AppointmentDTO[] = [];
  emptyList: string = "";
  isFormVisible: boolean = false;

  currentAppointmentId: string | null = null;
  currentDeleteAppointment!: AppointmentDTO;

  faPenToSquare = faPenToSquare;
  faTrashCan = faTrashCan;
  
  constructor(
    private appointmentService: AppointmentsService,
    private localStorageService: LocalStorageService
  ) {}

  ngOnInit(): void {
    this.loadAppointments();
  }

  loadAppointments(): void {
    const userEmail = this.localStorageService.get('user_email');

    if (userEmail) {
      this.appointmentService.getAllAppointments().subscribe({
        next: (appointments: AppointmentDTO[]) => {
          this.appointments = appointments;

          this.emptyList = this.appointments.length === 0
          ? 'ALERT.EMPTY_LIST'
          : '' 

          console.log(this.appointments)
        },
        error: (error) => {
          console.log(error.error.message);
        }
      })
    }
  }

  setCurrentDeleteAppointment(appointment: AppointmentDTO): void {
    this.currentDeleteAppointment = appointment;
  }

  deleteAppointment(appointment: AppointmentDTO | undefined): void {
    if (appointment && appointment.id) {
      const userEmail = this.localStorageService.get('user_email');
      const appointmentId = String(appointment.id);

      console.log(appointment)

      const hasActiveBookings = appointment.booked_count > 0;

      if (hasActiveBookings) {
        alert(`No se puede eliminar la cita porque tiene reservas activas`);
        return
      }

      if (userEmail) {
        this.appointmentService.deleteAppointment(appointmentId).subscribe(() => {
          this.loadAppointments();
        })
      }
    }
  }

  createAppointment(): void {
    this.isFormVisible = true;
  }

  updateAppointment(appointment: AppointmentDTO): void {
    if (appointment && appointment.id) {
      this.currentAppointmentId = String(appointment.id);
      this.isFormVisible = true;
    }
  }

  onFormComplete(): void {
    this.isFormVisible = false;
    this.loadAppointments();          
  }

  onFormCancelled(): void {
    this.isFormVisible = false;
    this.currentAppointmentId = null;
  }
}
