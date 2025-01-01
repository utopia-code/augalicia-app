import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FavouriteDTO } from '../../Models/favourite.dto';
import { Image, ProductDTO } from '../../Models/product.dto';
import { FavouritesService } from '../../Services/favourites.service';
import { LocalStorageService } from '../../Services/local-storage.service';
import { LayoutComponent } from '../layout/layout.component';

@Component({
  selector: 'app-favourites',
  standalone: true,
  imports: [CommonModule, LayoutComponent, TranslateModule, RouterModule],
  templateUrl: './favourites.component.html',
  styleUrl: './favourites.component.scss'
})
export class FavouritesComponent {
  favourites!: FavouriteDTO[];
  products!: ProductDTO[];
  emptyList: string = "";

  constructor(
    private favouritesService: FavouritesService,
    private localStorageService: LocalStorageService,
    private router: Router
  ) {
    this.getAllFavourites()
  }

  getMainImage(images: Image[] | undefined): Image | undefined {
    return images?.find(image => image.url.endsWith('01.webp'));
  }

  private getAllFavourites(): void {
    const userEmail = this.localStorageService.get('user_email');

    if (userEmail) {
      this.favouritesService.getAllFavourites().subscribe({
        next: (favourites: FavouriteDTO[]) => {
          this.favourites = favourites;
          console.log(favourites)

          this.products = favourites
            .map(favourite => favourite.product)
            .filter((product): product is ProductDTO => product !== undefined);

          this.products.forEach(product => {
            if (product.images &&  product.images.length > 0) {
              product.images.forEach(image => {
                if (!image.url.startsWith('http://localhost:3000')) {
                  image.url = `http://localhost:3000${image.url.replace('/public', '')}`;
                }
              });
            }
          });

          console.log('this.products: ', this.products)

          this.favourites.length === 0
            ? this.emptyList = 'ALERT.EMPTY_LIST'
            : ""
        },
        error: (error: HttpErrorResponse) => {
          console.log(error.error.message)
        }
      })
    }
  }

  getProductById(id: number | undefined): void {
    this.router.navigateByUrl(`products/${id}`);
  }
  
}
