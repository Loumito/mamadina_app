import {UserRole} from '../types';
import {hasPermission as checkPermission, ROLE_PERMISSIONS} from '../constants/roles';

export const hasPermission = (
  userRole: UserRole,
  permission: string,
): boolean => {
  return checkPermission(userRole, permission);
};

export const canCreateTask = (userRole: UserRole): boolean => {
  return hasPermission(userRole, 'tasks:create');
};

export const canUpdateTask = (
  userRole: UserRole,
  isAssigned: boolean,
): boolean => {
  if (hasPermission(userRole, 'tasks:update')) {
    return true;
  }
  if (isAssigned && hasPermission(userRole, 'tasks:update_own')) {
    return true;
  }
  return false;
};

export const canDeleteTask = (userRole: UserRole): boolean => {
  return hasPermission(userRole, 'tasks:delete');
};

export const canManageUsers = (userRole: UserRole): boolean => {
  return hasPermission(userRole, 'users:create');
};

export const canManageFleet = (userRole: UserRole): boolean => {
  return hasPermission(userRole, 'fleet:create');
};

export const canViewReports = (userRole: UserRole): boolean => {
  return hasPermission(userRole, 'reports:read');
};

export const canManageSettings = (userRole: UserRole): boolean => {
  return hasPermission(userRole, 'settings:manage');
};

export const getAllPermissions = (userRole: UserRole): string[] => {
  return ROLE_PERMISSIONS[userRole] || [];
};
