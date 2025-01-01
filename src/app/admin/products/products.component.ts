import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPenToSquare, faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { ProductDTO } from '../../Models/product.dto';
import { LocalStorageService } from '../../Services/local-storage.service';
import { ProductService } from '../../Services/product.service';
import { LayoutComponent } from '../layout/layout.component';
import { ProductFormComponent } from '../product-form/product-form.component';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule,  
    LayoutComponent, 
    TranslateModule, 
    ProductFormComponent, 
    FontAwesomeModule
  ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent implements OnInit {
  products: ProductDTO[] = [];
  emptyList: string = "";
  isFormVisible: boolean = false;

  currentProductId: string | null = null;
  currentDeleteProduct!: ProductDTO;

  faPenToSquare = faPenToSquare;
  faTrashCan = faTrashCan;

  constructor(
    private productService: ProductService,
    private localStorageService: LocalStorageService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    const userEmail = this.localStorageService.get('user_email');

    if(userEmail) {
      this.productService.getAllProductsByUser().subscribe({
        next: (products: ProductDTO[]) => {
          this.products = products;

        this.emptyList = this.products.length === 0
          ? 'ALERT.EMPTY_LIST'
          : ''

          console.log(this.products)
        },
        error: (error: HttpErrorResponse) => {
          console.log(error.error.message);
        }
      })
    }
  }

  setCurrentDeleteProduct(product: ProductDTO): void {
    this.currentDeleteProduct = product;
  }

  deleteProduct(product: ProductDTO): void {
    if (product && product.id) {
      const userEmail = this.localStorageService.get('user_email');
      const productId = String(product.id);

      const hasActiveBookings = product.appointments?.some(appointment => appointment.booked_count > 0);

      if (hasActiveBookings) {
        alert(`No se puede eliminar el producto porque tiene reservas activas.`);
        return
      }

      if (userEmail) {
        this.productService.deleteProduct(productId).subscribe({
          next: () => {
            this.loadProducts();
          },
          error: (error) => {
            console.log('Error cancelling booking:', error.error.message)
          }
        })
      }
    }
  }

  createProduct(): void {
    this.isFormVisible = true;
  }

  updateProduct(product: ProductDTO): void {
    if (product && product.id) {
      this.currentProductId = String(product.id);
      this.isFormVisible = true;
    }
  }

  onFormComplete(): void {
    this.isFormVisible = false;
    this.loadProducts();           
  }

  onFormCancelled(): void {
    this.isFormVisible = false;
    this.currentProductId = null;
  }
}
