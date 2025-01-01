import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
  })
  export class NearbyProductService {
    private urlAuGaliciaApi: string;
    private controller: string;
  
    constructor( private http: HttpClient ) {
      this.controller = 'nearby-products';
      this.urlAuGaliciaApi = `http://localhost:3000/api/${this.controller}`;
    }



  getNearbyProducts(lat: number, lng: number, distanceKm: number): Observable<any> {
    const params = new HttpParams()
      .set('lat', lat.toString())
      .set('lng', lng.toString()) 
      .set('distanceKm', distanceKm.toString());

    return this.http.get(`${this.urlAuGaliciaApi}`, { params });
  }
}
