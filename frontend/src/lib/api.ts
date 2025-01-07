import { Backend_URL } from "./Constants";
import io, { Socket } from 'socket.io-client';

class WebSocketManager {
  private socket: Socket | null = null;
  private listeners: Map<string, Set<(data: any) => void>> = new Map();

  connect(roomId: string, userId: string) {
    // Disconnect existing socket if any
    this.disconnect();

    // Create new socket connection
    this.socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:8000', {
      query: { roomId, userId }
    });

    // Setup default event listeners
    this.socket.on('connect', () => {
      console.log('WebSocket connected');
      this.socket?.emit('join-room', { roomId, userId });
    });

    this.socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
    });

    this.socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
    });

    // Setup signal listeners
    this.setupSignalListeners();

    return this;
  }

  private setupSignalListeners() {
    const signalEvents = ['signal', 'peer-joined', 'peer-left', 'peer-disconnected'];
  
    signalEvents.forEach(event => {
      this.socket?.on(event, (data) => {
        const eventListeners = this.listeners.get(event);
        eventListeners?.forEach(listener => listener(data));
      });
    });
  }

  subscribeToSignals(event: string, callback: (data: any) => void) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)?.add(callback);
  }

  unsubscribeFromSignals(event: string, callback?: (data: any) => void) {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      if (callback) {
        eventListeners.delete(callback);
      } else {
        eventListeners.clear();
      }
    }
  }

  sendSignal(roomId: string, signalData: {
    type: string;
    signal?: any;
    targetId?: string;
  }) {
    this.socket?.emit('signal', {
      roomId,
      ...signalData
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.listeners.clear();
    }
  }
}

export const webSocketManager = new WebSocketManager();

export const api = {
  /**
   * Validate a meeting's existence and user's role
   * @param roomId The room ID of the meeting
   * @returns Validation result with meeting details
   */
  validateMeeting: async (roomId: string) => {
    const response = await fetch(`${Backend_URL}/meetings/${roomId}/validate`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Meeting validation failed");
    }

    const data = await response.json();
    return {
      success: data.success,
      isValid: data.isValid,
      isAnalyst: data.isAnalyst || false,
    };
  },

  /**
   * Initialize a meeting for an analyst
   * @param analystId The ID of the analyst
   * @returns Meeting initialization response
   */
  initializeMeeting: async (analystId: string) => {
    const response = await fetch(`${Backend_URL}/meetings/initialize`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ analystId }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to initialize meeting");
    }

    return response.json();
  },

  /**
   * Join a meeting as a company
   * @param roomId The room ID of the meeting
   * @param companyId The ID of the company
   * @returns Meeting join response
   */
  joinMeeting: async (companyId: string, roomId: string) => {
    const response = await fetch(`${Backend_URL}/meetings/join`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        companyId,
        roomId,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to join meeting");
    }

    return response.json();
  },

  /**
   * Send a WebRTC signaling message
   * @param roomId The room ID of the meeting
   * @param signalData Signal information for WebRTC connection
   * @returns Signal processing result
   */
  handleSignal: async (
    roomId: string,
    signalData: {
      type: string;
      signal?: any;
    }
  ) => {
    // Use WebSocket for signaling instead of HTTP
    webSocketManager.sendSignal(roomId, signalData);
    return { success: true };
  },

  /**
   * End an ongoing meeting
   * @param roomId The room ID of the meeting to end
   * @returns Meeting end result
   */
  endMeeting: async (roomId: string) => {
    const response = await fetch(`${Backend_URL}/meetings/${roomId}/end`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to end meeting");
    }

    return response.json();
  },

  // WebSocket Management
  connectWebSocket: (roomId: string, userId: string) => {
    return webSocketManager.connect(roomId, userId);
  },

  subscribeToSignals: (event: string, callback: (data: any) => void) => {
    webSocketManager.subscribeToSignals(event, callback);
  },

  unsubscribeFromSignals: (event: string, callback?: (data: any) => void) => {
    webSocketManager.unsubscribeFromSignals(event, callback);
  },

  disconnectWebSocket: () => {
    webSocketManager.disconnect();
  }
};