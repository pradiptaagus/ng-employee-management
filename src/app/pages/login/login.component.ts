import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
    CommonModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  form = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  get username() {
    return this.form.get('username');
  }

  get password() {
    return this.form.get('password');
  }

  authenticate() {
    if (!this.username?.value || !this.password?.value) {
      return;
    }

    console.log('masuk');

    const status = this.authService.login(
      this.username?.value,
      this.password?.value
    );

    if (!status) {
      const snackBarRef = this.snackBar.open(
        'Invalid username or password.',
        'OK',
        {
          duration: 3000,
        }
      );

      snackBarRef.onAction().subscribe(() => {
        snackBarRef.dismiss();
      });
    }

    this.router.navigate(['']);
  }
}
