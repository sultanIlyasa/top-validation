// app/api/dashboard/route.ts
import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/middleware/withAuth";
import api from "@/services/api";

async function handler(req: NextRequest) {
  try {
    // Forward the request to your NestJS backend with the token
    const response = await api.get("/dashboard/data", {
      headers: {
        Authorization: req.headers.get("authorization"),
      },
    });

    return NextResponse.json(response.data);
    
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: error.response?.status || 500 }
    );
  }
}

export const GET = withAuth(handler);
