import { Injectable } from '@angular/core';

import mockData from '../../assets/data.json';
import { Employee } from '../interfaces/employee';

export enum SortBy {
  USER_NAME = 'username',
  FIRST_NAME = 'firstName',
  LAST_NAME = 'lastName',
  EMAIL = 'email',
  SALARY = 'salary',
  STATUS = 'status',
}

export enum OrderBy {
  ASC = 'asc',
  DESC = 'desc',
}

export interface GetEmployeeParams {
  page?: number;
  size?: number;
  sortBy?: SortBy;
  orderBy?: OrderBy;
  username?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
}

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  data: Employee[] = [];

  constructor() {
    this.data = mockData.map((item) => ({
      username: item.username,
      firstName: item.firstName,
      lastName: item.lastName,
      email: item.email,
      birthDate: new Date(item.birthDate),
      basicSalary: item.basicSalary,
      status: item.status,
      group: item.group,
      description: new Date(item.description),
    }));
  }

  sort(list: Employee[], sortBy?: SortBy, orderBy?: OrderBy) {
    return [...list].sort((a, b) => {
      if (sortBy) {
        switch (sortBy) {
          case SortBy.EMAIL:
            switch (orderBy) {
              case 'desc':
                if (a.email > b.email) {
                  return -1;
                } else if (a.email < b.email) {
                  return 1;
                }
                return 0;
              case 'asc':
                if (a.email < b.email) {
                  return -1;
                } else if (a.email > b.email) {
                  return 1;
                }
                return 0;
              default:
                return 0;
            }
          case SortBy.FIRST_NAME:
            switch (orderBy) {
              case 'desc':
                if (a.firstName > b.firstName) {
                  return -1;
                } else if (a.firstName < b.firstName) {
                  return 1;
                }
                return 0;
              case 'asc':
                if (a.firstName < b.firstName) {
                  return -1;
                } else if (a.firstName > b.firstName) {
                  return 1;
                }
                return 0;
              default:
                return 0;
            }
          case SortBy.LAST_NAME:
            switch (orderBy) {
              case 'desc':
                if (a.lastName > b.lastName) {
                  return -1;
                } else if (a.lastName < b.lastName) {
                  return 1;
                }
                return 0;
              case 'asc':
                if (a.lastName < b.lastName) {
                  return -1;
                } else if (a.lastName > b.lastName) {
                  return 1;
                }
                return 0;
              default:
                return 0;
            }
          case SortBy.SALARY:
            switch (orderBy) {
              case 'desc':
                if (a.basicSalary > b.basicSalary) {
                  return -1;
                } else if (a.basicSalary < b.basicSalary) {
                  return 1;
                }
                return 0;
              case 'asc':
                if (a.basicSalary < b.basicSalary) {
                  return -1;
                } else if (a.basicSalary > b.basicSalary) {
                  return 1;
                }
                return 0;
              default:
                return 0;
            }
          case SortBy.USER_NAME:
            switch (orderBy) {
              case 'desc':
                if (a.username > b.username) {
                  return -1;
                } else if (a.username < b.username) {
                  return 1;
                }
                return 0;
              case 'asc':
                if (a.username < b.username) {
                  return -1;
                } else if (a.username > b.username) {
                  return 1;
                }
                return 0;
              default:
                return 0;
            }
          case SortBy.STATUS:
            switch (orderBy) {
              case 'desc':
                if (a.status > b.status) {
                  return -1;
                } else if (a.status < b.status) {
                  return 1;
                }
                return 0;
              case 'asc':
                if (a.status < b.status) {
                  return -1;
                } else if (a.status > b.status) {
                  return 1;
                }
                return 0;
              default:
                return 0;
            }
        }
      }
      return 1;
    });
  }

  search(list: Employee[], firstName: string, lastName: string) {
    return [...list].filter((employee) => {
      if (!employee.firstName || !employee.lastName) {
        return true;
      }
      if (
        employee.firstName.toLowerCase() === firstName &&
        employee.lastName.toLowerCase() === lastName
      ) {
        return true;
      }
      return false;
    });
  }

  paginate(list: Employee[], page?: number, size?: number) {
    const currentPage = page ?? 0;
    const currentSize = size ?? 0;

    return list.slice(
      currentPage * currentSize,
      (currentPage + 1) * currentSize
    );
  }

  getEmployees(params?: GetEmployeeParams): {
    data: Employee[];
    total: number;
    page: number;
    size: number;
  } {
    let list = [...this.data];

    list = this.sort([...list], params?.sortBy, params?.orderBy);

    if (params?.firstName && params.lastName) {
      list = this.search([...list], params.firstName, params.lastName);
    }

    const page = params?.page ?? 1;
    const size = params?.size ?? 10;

    list = this.paginate([...list], page, size);

    return {
      data: list,
      total: list.length,
      page: page,
      size: size,
    };
  }

  addEmployee(employee: Employee): void {
    this.data.push(employee);
  }

  getEmployee(username: string): Employee | undefined {
    return this.data.find((item) => item.username === username);
  }

  updateEmployee(employee: Employee): Employee | undefined {
    this.data = [...this.data].map((item) => {
      if (item.username === employee.username) {
        return employee;
      }
      return item;
    });

    return employee;
  }

  deleteEmployee(username: string): void {
    const list = [...this.data].filter((item) => {
      if (item.username !== username) {
        return true;
      }
      return false;
    });

    this.data = list;
  }
}
