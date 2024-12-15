import { Backend_URL } from "./Constants";

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
      // Optional: Check if the user is an analyst
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
    const response = await fetch(`${Backend_URL}/meetings/${roomId}/signal`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(signalData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to send signal");
    }

    return response.json();
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
};
