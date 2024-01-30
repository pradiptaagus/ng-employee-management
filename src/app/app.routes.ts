import { Routes } from '@angular/router';

import { authGuard } from './guard/auth.guard';
import { DetailComponent } from './pages/employee/detail/detail.component';
import { EditComponent } from './pages/employee/edit/edit.component';
import { ListComponent } from './pages/employee/list/list.component';
import { NewComponent } from './pages/employee/new/new.component';
import { LoginComponent } from './pages/login/login.component';

export const routes: Routes = [
  {
    path: '',
    component: ListComponent,
    title: 'Employee Management',
    canActivate: [authGuard],
  },
  { path: 'login', component: LoginComponent },
  {
    path: 'new',
    component: NewComponent,
    title: 'New Employee',
    canActivate: [authGuard],
  },
  {
    path: ':username/edit',
    component: EditComponent,
    title: 'Edit Employee',
    canActivate: [authGuard],
  },
  {
    path: ':username',
    component: DetailComponent,
    title: 'Employee Detail',
    canActivate: [authGuard],
  },
];
