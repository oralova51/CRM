export const CLIENT_ROUTES = {
  MAIN_PAGE: "/",
  // TASKS: "/tasks",
  AUTH: "/auth",
  PROFILE_PAGE: "/profile",
  ADMIN_PAGE: "/admin",
  ORDER: "/order",
} as const;

export type ClientRouteKey = keyof typeof CLIENT_ROUTES;
