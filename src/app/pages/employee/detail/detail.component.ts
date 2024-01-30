import { DatePipe, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { ActivatedRoute } from '@angular/router';

import { Employee } from '../../../interfaces/employee';
import { EmployeeService } from '../../../services/employee.service';

@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [MatChipsModule, DatePipe, MatButtonModule],
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.scss',
})
export class DetailComponent implements OnInit {
  employee?: Employee;

  constructor(
    private route: ActivatedRoute,
    private employeeService: EmployeeService,
    private location: Location
  ) {}

  ngOnInit(): void {
    const username = this.route.snapshot.paramMap.get('username');
    if (username) {
      this.employee = this.employeeService.getEmployee(username);
    }
  }

  get salary() {
    if (!this.employee?.basicSalary) {
      return '0';
    }
    return new Intl.NumberFormat('id-ID').format(this.employee?.basicSalary);
  }

  back() {
    this.location.back();
  }
}
