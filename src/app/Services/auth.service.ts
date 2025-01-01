import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthDTO } from '../Models/auth.dto';
import { UserDTO } from '../Models/user.dto';
import { LocalStorageService } from './local-storage.service';

export interface AuthToken {
  token: string;
  email: string;
  id: number;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private urlAuGaliciaApi: string;
  private controller: string;

  constructor( 
    private http: HttpClient,
    private localStorageService: LocalStorageService 
  ) {
    this.controller = 'auth';
    this.urlAuGaliciaApi = `http://localhost:3000/api/${this.controller}`;
  }

  register(user: UserDTO): Observable<UserDTO> {
    return this.http.post<UserDTO>(`${this.urlAuGaliciaApi}/register`, user);
  }

  login(login: AuthDTO): Observable<AuthToken> {
    return this.http.post<AuthToken>(`${this.urlAuGaliciaApi}/login`, login);
  }

  isAuthenticated(): boolean {
    const userEmail = this.localStorageService.get('user_email');
    return !!userEmail;
  }

  getRole(): string | null {
    return this.localStorageService.get('user_role');
  } 

  isUser(): boolean {
    return this.isAuthenticated() && this.getRole() === 'user';
  }
}
