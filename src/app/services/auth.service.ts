import { Injectable } from '@angular/core';

const account = {
  username: 'admin',
  password: 'admin',
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isLogedIn: boolean = false;

  constructor() {}

  login(username: string, password: string) {
    if (username === account.username && password === password) {
      this.isLogedIn = true;
    }

    return this.isLogedIn;
  }
}
