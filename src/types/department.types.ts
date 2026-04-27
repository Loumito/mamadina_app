export interface Department {
  id: string;
  name: string;
  description?: string;
  managerId: string;
  employeeIds: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateDepartmentDto {
  name: string;
  description?: string;
  managerId: string;
}

export interface UpdateDepartmentDto {
  name?: string;
  description?: string;
  managerId?: string;
  employeeIds?: string[];
}
