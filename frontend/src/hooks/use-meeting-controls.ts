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
}: UseMeetingControlsProps) {
  const router = useRouter();
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const conection = useRef<RTCPeerConnection | null>(null);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const webrtcRef = useRef<WebRTCConnection | null>(null);

  useEffect(() => {
    const initializeCall = async () => {
      try {
        // Initialize WebRTC connection
        webrtcRef.current = new WebRTCConnection(
          // onTrack handler
          (stream) => {
            console.log("Remote track received");
            setRemoteStream(stream);
            if (remoteVideoRef.current) {
              remoteVideoRef.current.srcObject = stream;
            }
            setIsConnected(true);
          },
          // onIceCandidate handler
          (candidate) => {
            console.log("Local ICE candidate generated", candidate);
            api.handleSignal(roomId, {
              type: "ice-candidate",
              signal: candidate,
            });
          },
          // onConnectionStateChange handler
          (state) => {
            console.log("WebRTC Connection State:", state);
            setIsConnected(state === "connected");
          }
        );

        // Validate meeting
        const { success, isValid } = await api.validateMeeting(roomId);
        if (!success || !isValid) {
          throw new Error("Invalid meeting or not authorized");
        }

        // Get local media stream
        const stream = await webrtcRef.current.startLocalStream();
        setLocalStream(stream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        // Connect WebSocket
        api.connectWebSocket(roomId, userId);

        // Signal handlers
        const handleOffer = async (data: any) => {
          console.log("Offer received", data);
          if (webrtcRef.current) {
            try {
              const answer = await webrtcRef.current.createAnswer(data.signal);
              api.handleSignal(roomId, {
                type: "answer",
                signal: answer,
              });
            } catch (err) {
              console.error("Failed to create answer", err);
              setError("Failed to establish connection");
            }
          }
        };

        const handleAnswer = async (data: any) => {
          console.log("Answer received", data);
          if (webrtcRef.current) {
            try {
              await webrtcRef.current.setRemoteAnswer(data.signal);
            } catch (err) {
              console.error("Failed to set remote answer", err);
              setError("Failed to establish connection");
            }
          }
        };

        const handleIceCandidate = async (data: any) => {
          console.log("ICE candidate received", data);
          if (webrtcRef.current) {
            try {
              await webrtcRef.current.addIceCandidate(data.signal);
            } catch (err) {
              console.error("Failed to add ICE candidate", err);
            }
          }
        };

        // Subscribe to WebSocket events
        api.subscribeToSignals("signal", (data) => {
          console.log("Signal received:", data);
          switch (data.type) {
            case "offer":
              console.log("Offer received", data.signal);
              handleOffer(data);
              break;
            case "answer":
              console.log("Answer received", data.signal);
              handleAnswer(data);
              break;
            case "ice-candidate":
              console.log("ICE candidate received", data.signal);
              handleIceCandidate(data);
              break;
            default:
              console.log("Unknown signal type:", data.type);
          }
        });

        // Different initialization based on user role
        if (userRole === "ANALYST") {
          const initResult = await api.initializeMeeting(userId);
          if (initResult.success) {
            const offer = await webrtcRef.current.createOffer();
            api.handleSignal(roomId, {
              type: "offer",
              signal: offer,
            });
          }
        } else {
          const joinResult = await api.joinMeeting(userId, roomId);
          if (joinResult.status === "waiting") {
            setError("Waiting for analyst to join");
          }
        }
      } catch (err) {
        console.error("Initialization error", err);
        setError(
          err instanceof Error ? err.message : "Failed to initialize call"
        );
      }
    };

    initializeCall();

    return () => {
      // Cleanup
      webrtcRef.current?.closeConnection();
      localStream?.getTracks().forEach((track) => track.stop());
      api.disconnectWebSocket();
    };
  }, [roomId, userId, userRole]);

  // Rest of the implementation remains the same as previous version
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
      api.disconnectWebSocket();
      router.push("/meeting");
    }
  };

  return {
    localStream,
    remoteStream,
    setRemoteStream,
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
