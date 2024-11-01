import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define Role type to match your Prisma Role enum
type Role = "ADMIN" | "ANALYST" | "COMPANY";

// Define the user data structure based on the login response
interface UserData {
  id: string;
  email: string;
  role: Role;
  firstName: string;
  lastName: string;
  company?: {
    id: string;
    companyName: string;
  };
  analyst?: {
    id: string;
    nikEmployeeId: string;
    // Add other analyst fields as needed
  };
  admin?: {
    id: string;
    // Add other admin fields as needed
  };
}

// Extend NextRequest to include our user property
declare module "next/server" {
  interface NextRequest {
    user?: UserData;
  }
}

// Define protected routes and their required roles
export const protectedRoutes = {
  "/": ["ANALYST", "COMPANY"] as Role[],
  "/profile": ["ANALYST", "COMPANY"] as Role[],
  "/profile/form": ["ANALYST", "COMPANY"] as Role[],
  "/scheduler": ["ANALYST", "COMPANY"] as Role[],
  "/video-call": ["ANALYST", "COMPANY"] as Role[],
  "/admin": ["ADMIN"] as Role[],
} as const;

// Define public routes that don't need authentication
export const publicRoutes = [
  "/auth/login",
  "/auth/register",
  "/auth/new-password",
] as const;

export function withAuth(handler: Function) {
  return async function (req: NextRequest) {
    try {
      const pathname = req.nextUrl.pathname;

      // Check if route is public
      if (publicRoutes.includes(pathname as any)) {
        return handler(req);
      }

      // Get access token from request header
      const authorization = req.headers.get("authorization");
      if (!authorization || !authorization.startsWith("Bearer ")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const accessToken = authorization.split(" ")[1];

      // Verify token using the correct endpoint that matches your JWT_ACCESS_SECRET
      const verifyResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!verifyResponse.ok) {
        // If access token is expired, you might want to handle refresh token logic here
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
      }

      const userData = (await verifyResponse.json()) as UserData;

      // Check role-based access for protected routes
      const requiredRoles =
        protectedRoutes[pathname as keyof typeof protectedRoutes];
      if (requiredRoles && !requiredRoles.includes(userData.role)) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }

      // Add user data to request
      req.user = userData;

      return handler(req);
    } catch (error) {
      console.error("Auth middleware error:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  };
}

// Helper function to refresh the access token (if needed)
async function refreshAccessToken(refreshToken: string) {
  try {
    const refreshResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
      }
    );

    if (!refreshResponse.ok) {
      throw new Error("Failed to refresh token");
    }

    const data = await refreshResponse.json();
    return data.access_token;
  } catch (error) {
    throw new Error("Failed to refresh access token");
  }
}
