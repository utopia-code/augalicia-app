import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserDTO } from '../Models/user.dto';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private urlAuGaliciaApi: string;
  private controller: string;

  constructor( 
    private http: HttpClient,
    private localStorageService: LocalStorageService
  ) {
    this.controller = 'users';
    this.urlAuGaliciaApi = `http://localhost:3000/api/${this.controller}`;
  }

  getUserById(userId: string): Observable<UserDTO> {
    return this.http.get<UserDTO>(`${this.urlAuGaliciaApi}/${userId}`);
  }

  updateUser(userId: string, user: Partial<UserDTO>): Observable<UserDTO> {
    const { role, id, access_token, ...updatedUser } = user;
    return this.http.patch<UserDTO>(`${this.urlAuGaliciaApi}/${userId}`, updatedUser)
  }

  updatePassword(userId: string, currentPassword: string, newPassword: string): Observable<void> {
    return this.http.put<void>(`${this.urlAuGaliciaApi}/${userId}/password`, { currentPassword, newPassword });
  }

  deleteProfil(userId: string): Observable<void> {
    return this.http.delete<void>(`${this.urlAuGaliciaApi}/${userId}`)
  }
}
