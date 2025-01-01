import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookedAppointmentsComponent } from './booked-appointments.component';

describe('BookedAppointmentsComponent', () => {
  let component: BookedAppointmentsComponent;
  let fixture: ComponentFixture<BookedAppointmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookedAppointmentsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookedAppointmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
