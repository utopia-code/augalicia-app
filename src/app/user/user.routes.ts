import { Routes } from "@angular/router";

export const userRoutes: Routes = [
    {
        path: 'profile',
        loadComponent: () =>
            import('./profile/profile.component').then((m) => m.ProfileComponent)
    },
    {
        path: 'favourites',
        loadComponent: () => 
            import('./favourites/favourites.component').then((m) => m.FavouritesComponent)
    },
    {
        path: 'bookings',
        loadComponent: () => 
            import('./bookings/bookings.component').then((m) => m.BookingsComponent)
    }
]