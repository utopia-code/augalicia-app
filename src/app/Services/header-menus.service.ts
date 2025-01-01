import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HeaderMenusDTO } from '../Models/header-menus.dto';

@Injectable({
  providedIn: 'root'
})
export class HeaderMenusService {

  headerManagement: BehaviorSubject<HeaderMenusDTO> = 
    new BehaviorSubject<HeaderMenusDTO>({
      showStandardSection: true,
      showUserSection: false,
      showAdminSection: false
    })
    
  constructor() { }
}
