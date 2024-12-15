interface ExtendedRTCConfiguration extends RTCConfiguration {
  sdpSemantics?: "unified-plan" | "plan-b";
  bundlePolicy?: "balanced" | "max-compat" | "max-bundle";
}

export class WebRTCConnection {
  private peerConnection: RTCPeerConnection;
  private localStream: MediaStream | null = null;
  private remoteStream: MediaStream | null = null;
  private iceConnectionState: RTCIceConnectionState = "new";

  constructor(
    private onTrack: (stream: MediaStream) => void,
    private onIceCandidate: (candidate: RTCIceCandidate) => void,
    private onConnectionStateChange?: (state: RTCIceConnectionState) => void
  ) {
    this.peerConnection = this.createPeerConnection();
  }

  private createPeerConnection(): RTCPeerConnection {
    const configuration: ExtendedRTCConfiguration = {
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" },
      ],
      sdpSemantics: "unified-plan",
      bundlePolicy: "max-bundle",
    };

    const pc = new RTCPeerConnection(configuration);

    pc.ontrack = ({ streams: [stream] }) => {
      this.remoteStream = stream;
      this.onTrack(stream);
    };

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        this.onIceCandidate(event.candidate);
      }
    };

    // Add more comprehensive connection state tracking
    pc.oniceconnectionstatechange = () => {
      this.iceConnectionState = pc.iceConnectionState;
      this.handleIceConnectionStateChange();
    };

    pc.onconnectionstatechange = () => {
      this.handleConnectionStateChange();
    };

    return pc;
  }

  private handleIceConnectionStateChange() {
    console.log("ICE Connection State:", this.iceConnectionState);

    if (this.onConnectionStateChange) {
      this.onConnectionStateChange(this.iceConnectionState);
    }

    // Handle potential connection failures
    switch (this.iceConnectionState) {
      case "failed":
        console.warn("ICE Connection failed. Attempting to restart.");
        this.restartConnection();
        break;
      case "disconnected":
        console.warn("ICE Connection disconnected.");
        break;
    }
  }

  private handleConnectionStateChange() {
    console.log("Peer Connection State:", this.peerConnection.connectionState);

    switch (this.peerConnection.connectionState) {
      case "failed":
        console.error("Peer connection failed");
        this.restartConnection();
        break;
      case "closed":
        console.warn("Peer connection closed");
        break;
    }
  }

  // In your WebRTC connection class
  async startLocalStream(deviceId?: string) {
    // Ensure peer connection is open before starting stream
    if (this.peerConnection.signalingState === "closed") {
      console.warn("Peer connection was closed. Recreating connection.");
      this.peerConnection = this.createPeerConnection();
    }

    try {
      // Enumerate devices for debugging
      const devices = await navigator.mediaDevices.enumerateDevices();
      console.log("Available devices:", devices);

      // Prepare constraints
      const constraints: MediaStreamConstraints = {
        video: deviceId
          ? { deviceId: { exact: deviceId } }
          : {
              width: { ideal: 1280, max: 1920 },
              height: { ideal: 720, max: 1080 },
              frameRate: { ideal: 30, max: 60 },
            },
        audio: true,
      };

      // Attempt to get user media
      this.localStream = await navigator.mediaDevices.getUserMedia(constraints);

      // Clear existing tracks from peer connection
      this.peerConnection.getSenders().forEach((sender) => {
        this.peerConnection.removeTrack(sender);
      });

      // Add tracks to peer connection
      this.remoteStream?.getTracks().forEach((track) => {
        this.peerConnection.addTrack(track, this.remoteStream!);
      });

      return this.localStream;
    } catch (error) {
      console.error("Detailed media device error:", error);

      // Detailed error handling
      if (error instanceof DOMException) {
        switch (error.name) {
          case "NotAllowedError":
            console.error("Camera permission denied");
            break;
          case "NotFoundError":
            console.error("No camera or microphone found");
            break;
          case "OverconstrainedError":
            console.error("Media constraints cannot be satisfied");
            break;
          case "AbortError":
            console.error("Media device in use by another application");
            break;
        }
      }

      throw error;
    }
  }

  // Helper method to list and select devices
  async listAndSelectDevices() {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();

      // Log all devices for debugging
      console.log("Available Devices:");
      devices.forEach((device, index) => {
        console.log(
          `${index + 1}. ${device.kind}: ${device.label} (${device.deviceId})`
        );
      });

      // Find specific devices
      const laptopWebcam = devices.find(
        (device) =>
          device.label.toLowerCase().includes("integrated") ||
          device.label.toLowerCase().includes("built-in")
      );

      const phoneCamera = devices.find(
        (device) =>
          device.label.toLowerCase().includes("droidcam") ||
          device.label.toLowerCase().includes("ip webcam")
      );

      return {
        laptopWebcam: laptopWebcam?.deviceId,
        phoneCamera: phoneCamera?.deviceId,
      };
    } catch (error) {
      console.error("Error listing devices:", error);
      return {};
    }
  }

  private getDetailedMediaError(error: any): string {
    if (error instanceof DOMException) {
      switch (error.name) {
        case "NotAllowedError":
          return "User denied camera/microphone access";
        case "NotFoundError":
          return "No camera or microphone found";
        case "OverconstrainedError":
          return "Media constraints cannot be satisfied";
      }
    }
    return error.toString();
  }

  async createOffer(options?: RTCOfferOptions) {
    try {
      const offer = await this.peerConnection.createOffer(options);
      await this.peerConnection.setLocalDescription(offer);
      return offer;
    } catch (error) {
      console.error("Error creating offer:", error);
      throw error;
    }
  }

  async createAnswer(
    offer: RTCSessionDescriptionInit,
    options?: RTCAnswerOptions
  ) {
    try {
      await this.peerConnection.setRemoteDescription(offer);
      const answer = await this.peerConnection.createAnswer(options);
      await this.peerConnection.setLocalDescription(answer);
      return answer;
    } catch (error) {
      console.error("Error creating answer:", error);
      throw error;
    }
  }

  async setRemoteAnswer(answer: RTCSessionDescriptionInit) {
    try {
      await this.peerConnection.setRemoteDescription(answer);
    } catch (error) {
      console.error("Error setting remote description:", error);
      throw error;
    }
  }

  async addIceCandidate(candidate: RTCIceCandidateInit) {
    try {
      await this.peerConnection.addIceCandidate(candidate);
    } catch (error) {
      console.error("Error adding ICE candidate:", error);
      throw error;
    }
  }

  private restartConnection() {
    // Recreate peer connection and attempt to reestablish
    this.closeConnection();
    this.peerConnection = this.createPeerConnection();

    // Optionally, re-add local stream if available
    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => {
        this.peerConnection.addTrack(track, this.localStream!);
      });
    }
  }

  closeConnection() {
    // Stop all local tracks
    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => track.stop());
      this.localStream = null;
    }

    // Stop all remote tracks
    if (this.remoteStream) {
      this.remoteStream.getTracks().forEach((track) => track.stop());
      this.remoteStream = null;
    }

    // Close peer connection
    this.peerConnection.close();
  }

  // Getter methods for stream and connection state
  getLocalStream(): MediaStream | null {
    return this.localStream;
  }

  getRemoteStream(): MediaStream | null {
    return this.remoteStream;
  }

  getConnectionState(): RTCIceConnectionState {
    return this.iceConnectionState;
  }
}
