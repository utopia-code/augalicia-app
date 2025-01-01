import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Image, Notification, OpeningSeason } from '../Models/product.dto';

@Injectable({
  providedIn: 'root'
})
export class FeaturesService {

  private urlAuGaliciaApi: string;
  private controller: string;

  constructor( private http: HttpClient ) {
    this.controller = 'features';
    this.urlAuGaliciaApi = `http://localhost:3000/api/${this.controller}`;
  }

  getAllOpeningSeason(): Observable<OpeningSeason[]> {
    return this.http.get<OpeningSeason[]>(`${this.urlAuGaliciaApi}/opening-season`);
  }

  uploadImage(data: FormData): Observable<any> {
    return this.http.post<any>(`${this.urlAuGaliciaApi}/upload-image`, data);
  }

  deletePreview(fileName: string) {
    return this.http.delete(`${this.urlAuGaliciaApi}/delete-preview/${fileName}`);
  }

  deleteImage(fileName: string, productId: string) {
    return this.http.delete(`${this.urlAuGaliciaApi}/delete-image/${productId}/${fileName}`);
  }

  getAllImagesByProduct(productId: string): Observable<Image[]> {
    return this.http.get<Image[]>(`${this.urlAuGaliciaApi}/images/${productId}/product`)
  }

  deleteNotification(id: string, productId: string): Observable<void> {
    return this.http.delete<void>(`${this.urlAuGaliciaApi}/delete-notification/${productId}/${id}`)
  }

  getAllNotificationsByProduct(productId: string): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.urlAuGaliciaApi}/notifications/${productId}/product`)
  }

  
}
