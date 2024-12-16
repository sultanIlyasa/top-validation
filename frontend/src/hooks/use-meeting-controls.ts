"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { WebRTCConnection } from "@/lib/webrtc";
import { api } from "@/lib/api";

interface UseMeetingControlsProps {
  roomId: string;
  userId: string;
  userRole: string;
  analystId: string;
  companyId: string;
}

export function useMeetingControls({
  roomId,
  userId,
  userRole,
  analystId,
  companyId,
}: UseMeetingControlsProps) {
  const router = useRouter();
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const webrtcRef = useRef<WebRTCConnection | null>(null);

  useEffect(() => {
    const initializeCall = async () => {
      try {
        // Initialize WebRTC connection
        webrtcRef.current = new WebRTCConnection(
          (stream) => {
            setRemoteStream(stream);
            if (remoteVideoRef.current) {
              remoteVideoRef.current.srcObject = stream;
            }
            setIsConnected(true);
          },
          async (candidate) => {
            await api.handleSignal(roomId, {
              type: "ice-candidate",
              signal: candidate,
            });
          }
        );

        // Get local media stream
        const stream = await webrtcRef.current.startLocalStream();
        setLocalStream(stream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        // Validate meeting
        const { success, isValid } = await api.validateMeeting(roomId);

        if (!success || !isValid) {
          throw new Error("Invalid meeting or not authorized");
        }

        // Different initialization based on user role
        if (userRole === "ANALYST") {
          const initResult = await api.initializeMeeting(userId);
          if (initResult.success) {
            const offer = await webrtcRef.current.createOffer();
            await api.handleSignal(roomId, {
              type: "offer",
              signal: offer,
            });
          }
        } else {
          const joinResult = await api.joinMeeting(userId, roomId);
          if (joinResult.status === "waiting") {
            // Handle waiting state if needed
            setError("Waiting for analyst to join");
          }
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to initialize call"
        );
      }
    };

    initializeCall();

    return () => {
      webrtcRef.current?.closeConnection();
      localStream?.getTracks().forEach((track) => track.stop());
    };
  }, [roomId, userId, userRole]);

  const toggleAudio = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsVideoOff(!isVideoOff);
    }
  };

  const endCall = async () => {
    try {
      await api.endMeeting(roomId);
    } catch (err) {
      console.error("Error ending meeting", err);
    } finally {
      webrtcRef.current?.closeConnection();
      localStream?.getTracks().forEach((track) => track.stop());
      router.push("/meeting");
    }
  };

  return {
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
  };
}
