// shared/config/routeAccess.ts
export const ROUTE_ACCESS = {
    '/admin': { requireAuth: true, allowedRoles: ['isAdmin'] },
    '/profile': { requireAuth: true },
    '/book': { requireAuth: true },
    // ...
  } as const;