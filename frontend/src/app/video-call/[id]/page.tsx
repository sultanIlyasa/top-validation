"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { PhoneOff, Mic, MicOff, Video, VideoOff } from "lucide-react";
import { useMeetingControls } from "@/hooks/use-meeting-controls";
import { useSession } from "next-auth/react";

export default function MeetingRoom() {
  const params = useParams();
  const { toast } = useToast();
  const roomId = params.id as string;
  // TODO: Replace with actual user authentication context
  const { data: session } = useSession();
  const user = session?.user;
  const userId = user?.id;
  console.log("User ID: ", userId);

  const {
    localStream,
    remoteStream,
    isConnected,
    isMuted,
    isVideoOff,
    toggleAudio,
    toggleVideo,
    endCall,
    localVideoRef,
    remoteVideoRef,
    error,
  } = useMeetingControls({
    roomId: roomId,
    userId: userId || "",
    userRole: user?.role || "",
    analystId: user?.analyst?.id || "",
    companyId: user?.company?.id || "",
  });

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      });
    }
  }, [error, toast]);

  // Loading state while authenticating or initializing
  if (!user?.id && !localStream) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-6 text-center">
          <p>Initializing meeting...</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl flex flex-col md:flex-row gap-4">
        {/* Remote Stream Video */}
        <div className="flex-1 relative bg-gray-100 rounded-lg overflow-hidden">
          {remoteStream ? (
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500">
              Waiting for other participant...
            </div>
          )}
        </div>

        {/* Local Stream Video */}
        <div className="w-1/4 md:w-1/5 bg-gray-100 rounded-lg overflow-hidden">
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Meeting Controls */}
      <div className="mt-6 flex space-x-4">
        <Button
          variant="outline"
          size="icon"
          onClick={toggleAudio}
          className={`${isMuted ? "bg-red-500 text-white" : ""}`}
        >
          {isMuted ? <MicOff /> : <Mic />}
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={toggleVideo}
          className={`${isVideoOff ? "bg-red-500 text-white" : ""}`}
        >
          {isVideoOff ? <VideoOff /> : <Video />}
        </Button>

        <Button variant="destructive" size="icon" onClick={endCall}>
          <PhoneOff />
        </Button>
      </div>

      {/* Connection Status */}
      <div className="mt-4 text-center">
        <p className={`${isConnected ? "text-green-500" : "text-yellow-500"}`}>
          {isConnected ? "Connected" : "Connecting..."}
        </p>
        <p className="text-xs text-gray-500">Meeting ID: {roomId}</p>
      </div>
    </div>
  );
}
