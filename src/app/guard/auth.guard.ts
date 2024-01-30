import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const isLogedIn = inject(AuthService).isLogedIn;
  const router = inject(Router);

  if (isLogedIn) {
    return true;
  }

  router.navigate(['login']);
  return false;
};
