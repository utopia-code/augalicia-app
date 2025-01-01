import { BookingDTO } from "./booking.dto";
import { ProductDTO } from "./product.dto";

export class AppointmentDTO {
    id?: number;
    date: string;
    hour: string;
    price: number;
    max_capacity: number;
    booked_count: number;
    is_booked: boolean;
    productId: number;
    userEmail: string;
    product?: ProductDTO;
    bookings?: BookingDTO[];

    constructor(
        date: string,
        hour: string,
        price: number,
        max_capacity: number,
        booked_count: number,
        is_booked: boolean,
        productId: number,
        userEmail: string,
        product?: ProductDTO
    ) {
        this.date = date;
        this.hour = hour;
        this.price = price;
        this.max_capacity = max_capacity;
        this.booked_count = booked_count;
        this.is_booked = is_booked;
        this.productId = productId;
        this.userEmail = userEmail;
        this.product = product
    }
}