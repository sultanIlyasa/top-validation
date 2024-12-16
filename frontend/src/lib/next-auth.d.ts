import { DefaultSession, DefaultUser } from "next-auth";
import { JWT } from "next-auth/jwt";

// Extend User type in next-auth
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      role: "ADMIN" | "COMPANY" | "ANALYST";
      firstName: string;
      lastName: string;
      analyst?: {
        id: string;
        userId: string;
        position: string;
        superior: string;
      };
      company?: {
        id: string;
        companyName: string;
        positions: string;
        address: {
          province: string;
          district: string;
          city: string;
          region: string;
          postcode: string;
          country: string;
        };
      };
      schedulesAsAnalyst?: [
        {
          id: string;
          companyId: string;
          analystId: string;
          date: Date;
          startTime: Date;
          endTime: Date;
          status: string;
        }
      ];
      videoCallsAsAnalyst?: [
        {
          id: string;
          schedlueId: string;
          companyId: string;
          analystId: string;
          roomId: string;
          status: string;
          status: string;
        }
      ];

      schedulesAsCompany?: [
        {
          id: string;
          companyId: string;
          analystId: string;
          date: Date;
          startTime: Date;
          endTime: Date;
          status: string;
        }
      ];
      videoCallsAsCompany?: [
        {
          id: string;
          schedlueId: string;
          companyId: string;
          analystId: string;
          roomId: string;
          status: string;
          status: string;
        }
      ];
    };
    backendTokens: {
      access_token: string;
      refresh_token: string;
      expiresIn: number;
    };
  }

  interface SessionCompany {
    user: {
      id: string;
      email: string;
      role: "COMPANY";
      firstName: string;
      lastName: string;
    };
    backendTokens: {
      access_token: string;
      refresh_token: string;
      expiresIn: number;
    };
  }
}

// Extend JWT type in next-auth/jwt
declare module "next-auth/jwt" {
  interface JWT {
    user: {
      id: string;
      email: string;
      role: "ADMIN" | "COMPANY" | "ANALYST";
      firstName: string;
      lastName: string;
    };
    backendTokens: {
      access_token: string;
      refresh_token: string;
      expiresIn: number;
    };
  }
}
