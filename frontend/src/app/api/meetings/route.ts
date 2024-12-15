import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

// In-memory storage for meetings (replace with database in production)
const meetings: Record<string, any> = {};

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const roomId = searchParams.get("roomId");

    if (roomId) {
      const meeting = meetings[roomId];
      if (!meeting) {
        return NextResponse.json(
          {
            success: false,
            isValid: false,
            error: "Meeting not found",
          },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        isValid: true,
        isAnalyst: meeting.analystId === session.user.id,
        meetingDetails: meeting,
      });
    }

    return NextResponse.json(
      {
        success: false,
        error: "Missing roomId",
      },
      { status: 400 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to validate meeting",
      },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const { type, roomId } = await req.json();
    const userId = session.user.id;

    switch (type) {
      case "initialize":
        const newroomId = roomId;
        meetings[newroomId] = {
          id: newroomId,
          analystId: userId,
          createdAt: new Date(),
          participants: [userId],
          status: "initialized",
        };

        return NextResponse.json({
          success: true,
          roomId: newroomId,
          message: "Meeting initialized successfully",
        });

      case "join":
        if (!roomId) {
          return NextResponse.json(
            {
              success: false,
              error: "Meeting ID is required",
            },
            { status: 400 }
          );
        }

        const meeting = meetings[roomId];
        if (!meeting) {
          return NextResponse.json(
            {
              success: false,
              error: "Meeting not found",
            },
            { status: 404 }
          );
        }

        // Add user to meeting participants
        if (!meeting.participants.includes(userId)) {
          meeting.participants.push(userId);
        }

        meeting.status = meeting.participants.length > 1 ? "active" : "waiting";

        return NextResponse.json({
          success: true,
          status: meeting.status,
          message: "Joined meeting successfully",
        });

      case "signal":
        // Basic WebRTC signaling stub
        return NextResponse.json({
          success: true,
          message: "Signal processed",
        });

      case "end":
        if (meetings[roomId]) {
          delete meetings[roomId];
        }

        return NextResponse.json({
          success: true,
          message: "Meeting ended successfully",
        });

      default:
        return NextResponse.json(
          {
            success: false,
            error: "Invalid meeting operation",
          },
          { status: 400 }
        );
    }
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to process meeting request",
      },
      { status: 500 }
    );
  }
}
