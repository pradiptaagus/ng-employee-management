import { CommonModule, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute } from '@angular/router';

import mockGroup from '../../../../assets/group.json';
import { Employee } from '../../../interfaces/employee';
import { EmployeeService } from '../../../services/employee.service';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatButtonModule,
    CommonModule,
    MatDatepickerModule,
    MatRadioModule,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss',
})
export class EditComponent implements OnInit {
  employee?: Employee;

  groupList = mockGroup;

  form = new FormGroup({
    username: new FormControl({ value: '', disabled: true }),
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required),
    birthDate: new FormControl(new Date(), Validators.required),
    basicSalary: new FormControl('', Validators.required),
    status: new FormControl('', Validators.required),
    group: new FormControl('', Validators.required),
  });

  constructor(
    private employeeService: EmployeeService,
    private location: Location,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const username = this.route.snapshot.paramMap.get('username');
    if (username) {
      const employee = this.employeeService.getEmployee(username);

      this.form.setValue({
        username: employee?.username || null,
        firstName: employee?.firstName || null,
        lastName: employee?.lastName || null,
        email: employee?.email || null,
        birthDate: employee?.birthDate || null,
        basicSalary: employee?.basicSalary.toString() || null,
        status: employee?.status || null,
        group: employee?.group || null,
      });
    }
  }

  get username() {
    return this.form.get('username');
  }

  get firstName() {
    return this.form.get('firstName');
  }

  get lastName() {
    return this.form.get('lastName');
  }

  get email() {
    return this.form.get('email');
  }

  get birthDate() {
    return this.form.get('birthDate');
  }

  get basicSalary() {
    return this.form.get('basicSalary');
  }

  get status() {
    return this.form.get('status');
  }

  get group() {
    return this.form.get('group');
  }

  get today() {
    return new Date();
  }

  onSubmit() {
    if (
      !this.username?.value ||
      !this.firstName?.value ||
      !this.lastName?.value ||
      !this.email?.value ||
      !this.birthDate?.value ||
      !this.basicSalary?.value ||
      !this.status?.value ||
      !this.group?.value
    ) {
      return;
    }

    const employee: Employee = {
      username: this.username.value,
      firstName: this.firstName.value,
      lastName: this.lastName.value,
      email: this.email.value,
      birthDate: new Date(this.birthDate.value),
      basicSalary: Number(this.basicSalary.value),
      status: this.status.value,
      group: this.group.value,
      description: new Date(),
    };

    this.employeeService.updateEmployee(employee);

    this.back();
  }

  back() {
    this.location.back();
  }
}
