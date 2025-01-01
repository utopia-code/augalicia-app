import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-booking-popup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './booking-popup.component.html',
  styleUrl: './booking-popup.component.scss'
})
export class BookingPopupComponent {

}
