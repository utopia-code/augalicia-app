import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { Image, ProductDTO } from '../../Models/product.dto';
import { ShortUrlPipe } from '../../pipes/short-url.pipe';

@Component({
  selector: 'app-related-products-list',
  standalone: true,
  imports: [CommonModule, TranslateModule, ShortUrlPipe],
  templateUrl: './related-products-list.component.html',
  styleUrl: './related-products-list.component.scss'
})
export class RelatedProductsListComponent {
  @Input() products: ProductDTO[] = [];

  selectedNearbyProduct: any | null = null;

  selectNearbyProduct(product: ProductDTO): void {
    this.selectedNearbyProduct = product;
  }

  getMainImage(images: Image[] | undefined): Image | undefined {
    return images?.find(image => image.url.endsWith('01.webp'));
  }
}
