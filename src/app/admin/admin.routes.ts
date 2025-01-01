import { Routes } from "@angular/router";

export const adminRoutes: Routes = [
   {
        path: 'profile',
        loadComponent: () =>
            import('./profile/profile.component').then((m) => m.ProfileComponent)
    },
    {
        path: 'products',
        loadComponent: () => 
            import('./products/products.component').then((m) => m.ProductsComponent)
    },
    {
        path: 'appointments',
        loadComponent: () =>
            import('./appointments/appointments.component').then((m) => m.AppointmentsComponent)
    },
    {
        path: 'booked-appointments',
        loadComponent: () =>
            import('./booked-appointments/booked-appointments.component').then((m) => m.BookedAppointmentsComponent)
    }
]