import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductDTO } from '../Models/product.dto';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private urlAuGaliciaApi: string;
  private controller: string;

  constructor( private http: HttpClient ) {
    this.controller = 'products';
    this.urlAuGaliciaApi = `http://localhost:3000/api/${this.controller}`;
  }

  getProducts(): Observable<ProductDTO[]> {
    return this.http.get<ProductDTO[]>(this.urlAuGaliciaApi);
  }

  getProductById(id: string): Observable<ProductDTO> {
    return this.http.get<ProductDTO>(`${this.urlAuGaliciaApi}/${id}`);
  }

  getProductByIdAndUser(productId: string): Observable<ProductDTO> {
    return this.http.get<ProductDTO>(`${this.urlAuGaliciaApi}/${productId}/product-by-user`)
  }

  getAllProductsByUser(): Observable<ProductDTO[]> {
    return this.http.get<ProductDTO[]>(`${this.urlAuGaliciaApi}/products-by-user`);
  }

  createProduct(product: ProductDTO): Observable<ProductDTO> {
    return this.http.post<ProductDTO>(this.urlAuGaliciaApi, product);
  }

  updateProduct(productId: string, product: Partial<ProductDTO>): Observable<ProductDTO> {
    return this.http.patch<ProductDTO>(`${this.urlAuGaliciaApi}/${productId}`, product);
  }

  deleteProduct(productId: string): Observable<void> {
    return this.http.delete<void>(`${this.urlAuGaliciaApi}/${productId}`);
  }

  getAllProductsByTypeProduct(id: number): Observable<any> {
    return this.http.get(`${this.urlAuGaliciaApi}/type-product/${id}`);
  }

  getAllProductsByTypeTermalCentre(id: number): Observable<any> {
    return this.http.get(`${this.urlAuGaliciaApi}/type-termal-centre/${id}`);
  }

  getAllProductsByTermalTechnique(id: number): Observable<any> {
    return this.http.get(`${this.urlAuGaliciaApi}/termal-technique/${id}`);
  }

  getAllProductsByTypeWater(id: number): Observable<any> {
    return this.http.get(`${this.urlAuGaliciaApi}/type-water/${id}`);
  }

  getAllProductsByTreatment(id: number): Observable<any> {
    return this.http.get(`${this.urlAuGaliciaApi}/treatment/${id}`);
  }

  getAllProductsByService(id: number): Observable<any> {
    return this.http.get(`${this.urlAuGaliciaApi}/service/${id}`);
  }

  getAllProductsByAccesibility(id: number): Observable<any> {
    return this.http.get(`${this.urlAuGaliciaApi}/accesibility/${id}`);
  }

  getAllProductsByComplementaryTechnique(id: number): Observable<any> {
    return this.http.get(`${this.urlAuGaliciaApi}/complementary-technique/${id}`);
  }

  getTermalTechniquesOfProductById(id: string): Observable<any> {
    return this.http.get(`${this.urlAuGaliciaApi}/termal-technique/${id}/product`);
  }

  getTreatmentsOfProductById(id: string): Observable<any> {
    return this.http.get(`${this.urlAuGaliciaApi}/treatment/${id}/product`);
  }

  getServicesOfProductById(id: string): Observable<any> {
    return this.http.get(`${this.urlAuGaliciaApi}/service/${id}/product`);
  }

  getAccesibilityOfProductById(id: string): Observable<any> {
    return this.http.get(`${this.urlAuGaliciaApi}/accesibility/${id}/product`);
  }

  getComplementaryTechniquesOfProductById(id: string): Observable<any> {
    return this.http.get(`${this.urlAuGaliciaApi}/complementary-technique/${id}/product`);
  }
}
