import { AppointmentDTO } from "./appointment.dto";

export class BookingDTO {
    id?: number;
    people: number;
    appointmentId: number;
    userEmail: string;
    appointment?: AppointmentDTO;

    constructor(
        people: number,
        appointmentId: number,
        userEmail: string,
        appointment?: AppointmentDTO
    ) {
        this.people = people;
        this.appointmentId = appointmentId;
        this.userEmail = userEmail;
        this.appointment = appointment;
    }
    
}