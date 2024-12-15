"use client";
{
  /*How This Hook Works
Initialization:
1. When the component using useChatConnection mounts, the WebSocket connection is initiated.
2. Once the connection is established, the client emits the join_room event to join the specified chat room.

Dynamic Room Handling:
If the roomName changes (e.g., navigating to a different chat room), the effect re-runs to update the connection.

Cleanup:
Listeners are cleaned up when the component unmounts or when dependencies (roomName or handleConnection) change.
 */
}

import { useParams } from "react-router-dom";
import { useCallback, useEffect } from "react";
import { socket } from "./Socket";
import { useOfferSending } from "./useOfferSending";
import { useOffersListening } from "./useSendingAnswer";
import { useAnswerProcessing } from "./useAnswerProcessing";

export function useChatConnection(peerConnection: RTCPeerConnection) {
  const { roomName } = useParams();
  const { sendOffer } = useOfferSending(peerConnection);
  const { handleConnectionOffer } = useOffersListening(peerConnection);
  const { handleOfferAnswer } = useAnswerProcessing(peerConnection);

  const handleConnection = useCallback(() => {
    socket.emit("join_room", roomName);
  }, [roomName]);

  const handleReceiveCandidate = useCallback(
    ({ candidate }: { candidate: RTCIceCandidate }) => {
      peerConnection.addIceCandidate(candidate);
    },
    [peerConnection]
  );

  useEffect(() => {
    socket.connect();
    socket.on("answer", handleOfferAnswer);
    socket.on("send_connection_offer", handleConnectionOffer);
    socket.on("another_person_ready", sendOffer);
    socket.on("connect", handleConnection);
    socket.on("send_candidate", handleReceiveCandidate);

    return () => {
      socket.off("answer", handleOfferAnswer);
      socket.off("send_connection_offer", handleConnectionOffer);
      socket.off("another_person_ready", sendOffer);
      socket.off("connect", handleConnection);
      socket.off("send_candidate", handleReceiveCandidate);
    };
  }, [
    roomName,
    handleConnection,
    roomName,
    handleConnectionOffer,
    handleOfferAnswer,
    sendOffer,
    handleReceiveCandidate,
  ]);
}
