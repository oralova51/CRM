export const CLIENT_ROUTES = {
  MAIN_PAGE: "/",
  TASKS: "/tasks",
  AUTH: "/auth",
} as const;

export type ClientRouteKey = keyof typeof CLIENT_ROUTES;
