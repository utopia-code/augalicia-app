import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { ReactiveFormsModule, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { UserDTO } from '../../Models/user.dto';
import { AuthService } from '../../Services/auth.service';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  registerUser: UserDTO;

  name: UntypedFormControl;
  surname: UntypedFormControl;
  email: UntypedFormControl;
  password: UntypedFormControl;
  role: UntypedFormControl;

  registerForm: UntypedFormGroup;
  isValidForm: boolean | null;
  errorMessage: string | null = null;

  roles: { value: string; label: string }[];

  constructor(
    private formBuilder: UntypedFormBuilder,
    private authService: AuthService,
    private router: Router

  ) {
    this.isValidForm = null;
    this.registerUser = new UserDTO('', '', '', '', '');

    this.name = new UntypedFormControl(this.registerUser.name, [
      Validators.required,
      Validators.minLength(3)
    ]);

    this.surname = new UntypedFormControl(this.registerUser.surname, [
      Validators.required
    ])

    this.email = new UntypedFormControl(this.registerUser.email, [
      Validators.required,
      Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$'),
    ])

    this.password = new UntypedFormControl(this.registerUser.password, [
      Validators.required,
      Validators.minLength(6)
    ])

    this.role = new UntypedFormControl(this.registerUser.role, [
      Validators.required
    ])

    this.registerForm = this.formBuilder.group({
      name: this.name,
      surname: this.surname,
      email: this.email,
      password: this.password, 
      role: this.role
    })

    this.roles = [
      { value: 'admin', label: 'FORM.ADMIN' },
      { value: 'user', label: 'FORM.USER' },
    ];
  }

  register(): void {
    let responseOK: boolean = false;
    this.isValidForm = false;
    this.errorMessage = null;

    if (this.registerForm.invalid) {
      return;
    }

    this.isValidForm = true;
    this.registerUser = this.registerForm.value;
    
    this.authService.register(this.registerUser).subscribe({
      next: () => {
        responseOK = true;
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
          this.registerForm.reset();
          this.router.navigateByUrl('login');
        }
      }
    })
  }
  
}
