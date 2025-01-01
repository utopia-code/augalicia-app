import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { UserDTO } from '../../Models/user.dto';
import { LocalStorageService } from '../../Services/local-storage.service';
import { UserService } from '../../Services/user.service';
import { EditProfileComponent } from '../../shared/edit-profile/edit-profile.component';
import { LayoutComponent } from '../layout/layout.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, EditProfileComponent, LayoutComponent, TranslateModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  user!: UserDTO;
  showEditMode: boolean = false;

  constructor(
    private userService: UserService,
    private localStorageService: LocalStorageService
  ) {}

  ngOnInit(): void {
    this.getProfil();
  }

  private getProfil(): void {
    const user_id = this.localStorageService.get('user_id');

    if (user_id) {
      this.userService.getUserById(user_id).subscribe({
        next: (user: UserDTO) => {
          this.user = user;
          console.log(this.user);
        },
        error: (error: HttpErrorResponse) => {
          console.log(error)
        }
      })
    }
  }

  onEditComplete(): void {
    this.getProfil();           
  }

}
