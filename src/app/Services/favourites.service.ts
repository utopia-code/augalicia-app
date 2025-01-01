import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FavouriteDTO } from '../Models/favourite.dto';

@Injectable({
  providedIn: 'root'
})
export class FavouritesService {
  private urlAuGaliciaApi: string;
  private controller: string;

  constructor( private http: HttpClient ) {
    this.controller = 'favourites';
    this.urlAuGaliciaApi = `http://localhost:3000/api/${this.controller}`;
  }

  getAllFavourites(): Observable<FavouriteDTO[]> {
    return this.http.get<FavouriteDTO[]>(this.urlAuGaliciaApi)
  }

  addToFavourites(favourite: FavouriteDTO): Observable<FavouriteDTO> {
    return this.http.post<FavouriteDTO>(this.urlAuGaliciaApi, favourite);
  }

  deleteFromFavourites(productId: number): Observable<void> {
    return this.http.delete<void>(`${this.urlAuGaliciaApi}/${productId}`);
  }
}
