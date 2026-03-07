export const CLIENT_ROUTES = {
  MAIN_PAGE: "/",
  // TASKS: "/tasks",
  AUTH: "/auth",
  PROFILE_PAGE: "/profile",
} as const;

export type ClientRouteKey = keyof typeof CLIENT_ROUTES;
