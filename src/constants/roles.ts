import {UserRole} from '../types';

export const ROLES = {
  ADMIN: 'admin' as UserRole,
  MANAGER: 'manager' as UserRole,
  EMPLOYEE: 'employee' as UserRole,
  DRIVER: 'driver' as UserRole,
};

export const ROLE_PERMISSIONS = {
  admin: [
    'users:create',
    'users:read',
    'users:update',
    'users:delete',
    'departments:create',
    'departments:read',
    'departments:update',
    'departments:delete',
    'tasks:create',
    'tasks:read',
    'tasks:update',
    'tasks:delete',
    'tasks:assign',
    'messages:read',
    'messages:send',
    'fleet:create',
    'fleet:read',
    'fleet:update',
    'fleet:delete',
    'reports:create',
    'reports:read',
    'settings:manage',
  ],
  manager: [
    'users:read',
    'departments:read',
    'tasks:create',
    'tasks:read',
    'tasks:update',
    'tasks:assign',
    'messages:read',
    'messages:send',
    'reports:create',
    'reports:read',
  ],
  employee: [
    'tasks:read',
    'tasks:update_own',
    'messages:read',
    'messages:send',
    'attendance:checkin',
    'attendance:checkout',
  ],
  driver: [
    'trips:read',
    'trips:update_own',
    'messages:read',
    'messages:send',
    'location:share',
  ],
};

export const hasPermission = (
  userRole: UserRole,
  permission: string,
): boolean => {
  return ROLE_PERMISSIONS[userRole]?.includes(permission) || false;
};

export const canAccessRoute = (userRole: UserRole, route: string): boolean => {
  const routePermissions: {[key: string]: UserRole[]} = {
    '/admin': ['admin'],
    '/users': ['admin'],
    '/departments': ['admin', 'manager'],
    '/tasks': ['admin', 'manager', 'employee'],
    '/fleet': ['admin', 'driver'],
    '/trips': ['admin', 'manager', 'driver'],
    '/messages': ['admin', 'manager', 'employee', 'driver'],
    '/reports': ['admin', 'manager'],
    '/settings': ['admin'],
  };

  return routePermissions[route]?.includes(userRole) || false;
};
