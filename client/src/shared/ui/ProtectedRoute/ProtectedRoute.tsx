// shared/ui/ProtectedRoute/ProtectedRoute.tsx
export default interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ('isAdmin' | 'isClient')[];
  requireAuth?: boolean;
}