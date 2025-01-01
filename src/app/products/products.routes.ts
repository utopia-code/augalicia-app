import { Routes } from "@angular/router";

export const productsRoutes: Routes = [
    {
        path: '',
        loadComponent: () => 
            import('./products-list/products-list.component').then((m) => m.ProductsListComponent)
    },
    {
        path: ':id',
        loadComponent: () => 
            import('./product-detail/product-detail.component').then((m) => m.ProductDetailComponent)
    }
]