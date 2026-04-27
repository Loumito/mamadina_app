export type UserRole = 'admin' | 'manager' | 'employee' | 'driver';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  phone: string;
  departmentId?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  permissions: string[];
  avatar?: string;
}

export interface UserProfile extends Omit<User, 'id'> {
  uid: string;
}

export interface CreateUserDto {
  email: string;
  password: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  phone: string;
  departmentId?: string;
}

export interface UpdateUserDto {
  firstName?: string;
  lastName?: string;
  phone?: string;
  departmentId?: string;
  isActive?: boolean;
  permissions?: string[];
}
