import { DatePipe, Location } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { Employee } from '../../../interfaces/employee';
import {
  EmployeeService,
  GetEmployeeParams,
  OrderBy,
  SortBy,
} from '../../../services/employee.service';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [
    MatButton,
    MatTableModule,
    MatPaginatorModule,
    DatePipe,
    MatButtonModule,
    MatChipsModule,
    MatSortModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatIconModule,
    RouterModule,
  ],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
})
export class ListComponent implements OnInit, AfterViewInit {
  data = new MatTableDataSource<Employee>();

  params: GetEmployeeParams = {
    size: 10,
    page: 0,
  };

  total = 0;

  pageSizeOptions: number[] = [5, 10, 25, 50, 100];

  displayedColumns: string[] = [
    'position',
    'username',
    'firstName',
    'lastName',
    'email',
    'status',
    'action',
  ];

  form = new FormGroup({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
  });

  get firstName() {
    return this.form.get('firstName');
  }

  get lastName() {
    return this.form.get('lastName');
  }

  get size() {
    return this.params.size || 0;
  }

  get page() {
    return this.params.page || 0;
  }

  @ViewChild(MatSort)
  sort!: MatSort;

  constructor(
    private employeeService: EmployeeService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.resetForm(params?.['firstName'], params?.['lastName']);

      const newParams: GetEmployeeParams = { ...params };

      if (Object.keys(params).includes('page')) {
        newParams.page = Number(params['page']);
      } else {
        newParams.page = this.params.page;
      }

      if (Object.keys(params).includes('size')) {
        newParams.size = Number(params['size']);
      } else {
        newParams.size = this.params.size;
      }

      this.getEmployees({ ...newParams });
    });
  }

  ngAfterViewInit(): void {
    this.sort.sortChange.subscribe((value) => {
      const params: GetEmployeeParams = { ...this.params, page: 0 };

      if (value.direction) {
        switch (value.active) {
          case 'username':
            params.sortBy = SortBy.USER_NAME;
            break;
          case 'firstName':
            params.sortBy = SortBy.FIRST_NAME;
            break;
          case 'lastName':
            params.sortBy = SortBy.LAST_NAME;
            break;
          case 'email':
            params.sortBy = SortBy.EMAIL;
            break;
          case 'status':
            params.sortBy = SortBy.STATUS;
            break;
          default:
            params.sortBy = undefined;
        }

        switch (value.direction) {
          case 'asc':
            params.orderBy = OrderBy.ASC;
            break;
          case 'desc':
            params.orderBy = OrderBy.DESC;
            break;
          default:
            params.orderBy = undefined;
        }
      }

      this.getEmployees(params);
    });

    this.form;
  }

  resetForm(firstName?: string, lastName?: string) {
    if (!firstName || !lastName) {
      this.form.reset();
      this.form.controls.firstName.setErrors(null);
      this.form.controls.lastName.setErrors(null);
    } else {
      this.form.setValue({
        firstName: firstName,
        lastName: lastName,
      });
    }
  }

  getEmployees(params?: GetEmployeeParams) {
    const res = this.employeeService.getEmployees(params);

    this.data = new MatTableDataSource(res.data);
    this.total = res.total;
    this.params = { ...params };

    this.router.navigate(['/'], {
      relativeTo: this.route,
      queryParams: params,
    });
  }

  handlePageEvent(e: PageEvent) {
    const page = e.pageSize !== this.params.size ? 0 : e.pageIndex;
    this.getEmployees({ page, size: e.pageSize });
  }

  onSubmit() {
    const params: GetEmployeeParams = { ...this.params, page: 0 };

    if (this.firstName?.value) {
      params.firstName = this.firstName.value.trim().toLowerCase();
    }

    if (this.lastName?.value) {
      params.lastName = this.lastName.value.trim().toLowerCase();
    }

    this.getEmployees(params);
  }

  onReset() {
    const params: GetEmployeeParams = { page: 0, size: this.params.size };
    this.sort.sort({
      id: '',
      start: '',
      disableClear: false,
    });

    this.getEmployees(params);
  }

  onDelete(username: string) {
    const snackBarRef = this.snackBar.open('Employee deleted.', 'Undo', {
      duration: 3000,
    });

    snackBarRef.onAction().subscribe(() => {
      snackBarRef.dismiss();
    });

    snackBarRef.afterDismissed().subscribe(() => {
      this.employeeService.deleteEmployee(username);
      this.getEmployees({ ...this.params });
    });
  }
}
