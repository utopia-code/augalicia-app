import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { ReactiveFormsModule, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AuthDTO } from '../../Models/auth.dto';
import { HeaderMenusDTO } from '../../Models/header-menus.dto';
import { AuthService, AuthToken } from '../../Services/auth.service';
import { HeaderMenusService } from '../../Services/header-menus.service';
import { LocalStorageService } from '../../Services/local-storage.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginUser: AuthDTO;
  email: UntypedFormControl;
  password: UntypedFormControl;

  loginForm: UntypedFormGroup;
  isValidForm: boolean | null;
  errorMessage: string | null = null;

  showStandardSection: boolean = true;
  showUserSection: boolean = false;
  showAdminSection: boolean = false;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private authService: AuthService,
    private localStorageService: LocalStorageService,
    private headerMenusService: HeaderMenusService,
    private router: Router
  ) {
    this.isValidForm = null;
    this.loginUser = new AuthDTO('', '');

    this.email = new UntypedFormControl(this.loginUser.email, [
      Validators.required,
      Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$'),
    ]);

    this.password = new UntypedFormControl(this.loginUser.password, [
      Validators.required,
      Validators.minLength(6)
    ])

    this.loginForm = this.formBuilder.group({
      email: this.email,
      password: this.password
    })
  }

  login(): void {
    let responseOK: boolean = false;
    this.isValidForm = false;
    this.errorMessage = null;

    if (this.loginForm.invalid) {
      return;
    }

    this.isValidForm = true;

    this.loginUser.email = this.email.value;
    this.loginUser.password = this.password.value;

    this.authService.login(this.loginUser).subscribe({
      next: (authToken: AuthToken) => {
        responseOK = true;

        this.loginUser.access_token = authToken.token;
        this.loginUser.email = authToken.email;

        this.localStorageService.set('access_token', this.loginUser.access_token);
        this.localStorageService.set('user_email', this.loginUser.email);
        this.localStorageService.set('user_id', authToken.id.toString());
        this.localStorageService.set('user_role', authToken.role);

        const headerMenu: HeaderMenusDTO = {
          showStandardSection: false,
          showUserSection: authToken.role === 'user',
          showAdminSection: authToken.role === 'admin'
        }

        this.headerMenusService.headerManagement.next(headerMenu);
      },
      error: (error: HttpErrorResponse) => {
        if (error.error?.message[0] === 'email must be an email') {
          this.errorMessage = 'FORM.ERROR.EMAIL_INVALID';
        } else {
          this.errorMessage = error?.error?.message;
        }
      },
      complete: () => {
        if (responseOK) {
          this.loginForm.reset();
          this.router.navigateByUrl('home');
        }
      }
    })
  }
}
