export const CLIENT_ROUTES = {
  MAIN_PAGE: "/",
  AUTH: "/auth",
  BOOK: "/book",
  PROCEDURES: "/procedures",
  HISTORY: "/history",
  AI: "/ai",
  PROFILE_PAGE: "/profile",
  ORDER: "/order",
  AI_PAGE: "/ai",
  PROMO: "/promo",
} as const;

export type ClientRouteKey = keyof typeof CLIENT_ROUTES;
