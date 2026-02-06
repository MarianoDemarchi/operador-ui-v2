// src/auth/hasPermission.ts

import type { Permission } from "./permissions";

export const hasPermission = (user: any, permission: Permission): boolean => {
  return user?.permissions?.includes(permission);
};
