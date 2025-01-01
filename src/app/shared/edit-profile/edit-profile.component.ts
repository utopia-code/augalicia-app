import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ReactiveFormsModule, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { HeaderMenusDTO } from '../../Models/header-menus.dto';
import { UserDTO } from '../../Models/user.dto';
import { HeaderMenusService } from '../../Services/header-menus.service';
import { LocalStorageService } from '../../Services/local-storage.service';
import { UserService } from '../../Services/user.service';



@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule, RouterModule],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.scss'
})
export class EditProfileComponent implements OnInit {
  @Output() editComplete = new EventEmitter<boolean>();

  profileUser: UserDTO;

  name: UntypedFormControl;
  surname: UntypedFormControl;
  email: UntypedFormControl;

  currentPassword: UntypedFormControl;
  newPassword: UntypedFormControl;
  confirmPassword: UntypedFormControl;

  passwordForm: UntypedFormGroup;
  profileForm: UntypedFormGroup;
  isValidForm: boolean | null;
  errorMessage: string | null = null;

  isAdmin: boolean;

  isEditProfil: boolean = false;
  isEditPassword: boolean = false;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private userService: UserService,
    private localStorageService: LocalStorageService,
    private router: Router,
    private headerMenusService: HeaderMenusService
  ) {
    this.isValidForm = null;
    this.profileUser = new UserDTO('', '', '', '', 'user');
    this.isAdmin = false;

    this.name = new UntypedFormControl(this.profileUser.name, [
      Validators.minLength(3)
    ]);

    this.surname = new UntypedFormControl(this.profileUser.surname, [ ]);

    this.email = new UntypedFormControl(this.profileUser.email, [
      Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$'),
    ]);

    this.currentPassword = new UntypedFormControl('', []);
    this.newPassword = new UntypedFormControl('', [Validators.minLength(6)]);
    this.confirmPassword = new UntypedFormControl('', []);

    this.passwordForm = this.formBuilder.group(
      {
        currentPassword: this.currentPassword,
        newPassword: this.newPassword,
        confirmPassword: this.confirmPassword
      },
      { validators: this.passwordMatchValidator }
    );

    this.profileForm = this.formBuilder.group({
      name: this.name,
      surname: this.surname,
      email: this.email
    });

  }

  passwordMatchValidator(group: UntypedFormGroup) {
    const newPassword = group.get('newPassword')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return newPassword === confirmPassword ? null : { mismatch: true };
  }

  ngOnInit(): void {
    const user_id = this.localStorageService.get('user_id');

    if (user_id) {
      this.userService.getUserById(user_id).subscribe({
        next: (userData: UserDTO) => {
          this.profileUser = userData;
          this.isAdmin = userData.role === 'admin';

          this.profileForm.patchValue({
            name: userData.name,
            surname: userData.surname,
            email: userData.email
          })
        }
      })
    }
  }

  updateUser(): void {
    let responseOK: boolean = false;
    this.isValidForm = false;
    this.errorMessage = null;

    if (this.profileForm.invalid) {
      return;
    }

    this.isValidForm = true;

    this.name.setValue(this.profileForm.value?.name);
    this.surname.setValue(this.profileForm.value?.surname);
    this.email.setValue(this.profileForm.value?.email);

    const updateUser = { ...this.profileUser, ...this.profileForm.value };

    console.log('Update User: ', updateUser);

    const user_id = this.localStorageService.get('user_id');
    if (user_id) {
      this.userService.updateUser(user_id, updateUser).subscribe({
        next: () => {
          responseOK = true;
        },
        error: (error: HttpErrorResponse) => {
          this.errorMessage = error?.error?.message;
        },
        complete: () => {
          if (responseOK) {
            this.isEditProfil = false;
            this.editComplete.emit(true);
          }
        }
      })
    }
  }

  updatePassword() {
    let responseOK: boolean = false;
    this.isValidForm = false;
    this.errorMessage = null;

    if (this.passwordForm.invalid) {
      return;
    }

    this.isValidForm = true;
    
    const { currentPassword, newPassword } = this.passwordForm.value;

    console.log('Update User: ', this.passwordForm.value);

    const userId = this.localStorageService.get('user_id');
    if (userId) {
      this.userService.updatePassword(userId, currentPassword, newPassword).subscribe({
        next: () => {
          responseOK = true;
        },
        error: (error) => {
          this.errorMessage = error?.error?.message;
        },
        complete: () => {
          if (responseOK) {
            this.isEditPassword = false;
            this.editComplete.emit(true);
          }
        }
      });
    }    
  }

  deleteProfil(): void {
    let responseOK: boolean = false;
    const userId = this.localStorageService.get('user_id');

    if (userId) {
      this.userService.deleteProfil(userId).subscribe({
        next: (res) => {
          responseOK = true;
          console.log(res)
        }, 
        error: (error) => {
          this.errorMessage = error?.error?.message;
        },
        complete: () => {
          if (responseOK) {
            this.localStorageService.remove('access_token');
            this.localStorageService.remove('user_email');
            this.localStorageService.remove('user_id');
            this.localStorageService.remove('user_role');

            const headerMenu: HeaderMenusDTO = {
              showStandardSection: true,
              showUserSection: false,
              showAdminSection: false
            }

            this.headerMenusService.headerManagement.next(headerMenu);
            this.router.navigateByUrl('home');
          }
        }
      })
    }
  }

  showEditProfile(): boolean {
    this.isEditProfil = true;
    this.isEditPassword = false;
    return true
  } 

  showEditPassword(): boolean {
    this.isEditPassword = true;
    this.isEditProfil = false;
    return true
  }
}
