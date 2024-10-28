// components/ProtectedRoute.tsx
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/router";
import { useEffect } from "react";

export function ProtectedRoute({
  children,
  roles = [],
}: {
  children: React.ReactNode;
  roles?: string[];
}) {
  const { isAuthenticated, loading, hasRole } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace("/auth/login");
    } else if (!loading && roles.length > 0 && !hasRole(roles)) {
      router.replace("/unauthorized");
    }
  }, [loading, isAuthenticated, roles, hasRole]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  if (roles.length > 0 && !hasRole(roles)) {
    return null;
  }

  return <>{children}</>;
}
