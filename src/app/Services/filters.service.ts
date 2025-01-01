import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Accesibility, ComplementaryTechnique, Service, TermalTechnique, Treatment, TypeProduct, TypeTermalCentre, TypeWater } from '../Models/product.dto';

@Injectable({
  providedIn: 'root'
})
export class FiltersService {
  private urlAuGaliciaApi: string;
  private controller: string;

  constructor( private http: HttpClient ) {
    this.controller = 'filters';
    this.urlAuGaliciaApi = `http://localhost:3000/api/${this.controller}`;
  }

  getAllTypeProducts(): Observable<TypeProduct[]> {
    return this.http.get<TypeProduct[]>(`${this.urlAuGaliciaApi}/type-product`);
  }

  getAllTypeTermalCentre(): Observable<TypeTermalCentre[]> {
    return this.http.get<TypeTermalCentre[]>(`${this.urlAuGaliciaApi}/type-termal-centre`);
  }

  getAllTermalTechniques(): Observable<TermalTechnique[]> {
    return this.http.get<TermalTechnique[]>(`${this.urlAuGaliciaApi}/termal-technique`);
  }
  
  getAllTypeWaters(): Observable<TypeWater[]> {
    return this.http.get<TypeWater[]>(`${this.urlAuGaliciaApi}/type-water`);
  }

  getAllTreatments(): Observable<Treatment[]> {
    return this.http.get<Treatment[]>(`${this.urlAuGaliciaApi}/treatment`);
  }

  getAllServices(): Observable<Service[]> {
    return this.http.get<Service[]>(`${this.urlAuGaliciaApi}/service`);
  }

  getAllAccesibility(): Observable<Accesibility[]> {
    return this.http.get<Accesibility[]>(`${this.urlAuGaliciaApi}/accesibility`);
  }

  getAllComplementaryTechniques(): Observable<ComplementaryTechnique[]> {
    return this.http.get<ComplementaryTechnique[]>(`${this.urlAuGaliciaApi}/complementary-technique`);
  }
}
