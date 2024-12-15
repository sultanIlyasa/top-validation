import {
  WebSocketGateway as NestWebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';

@Injectable()
@NestWebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  },
})
export class CustomWebSocketGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private rooms: Map<string, Set<string>> = new Map();

  async handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  async handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    this.removeClientFromRooms(client);
  }

  private removeClientFromRooms(client: Socket) {
    for (const [roomId, clients] of this.rooms.entries()) {
      if (clients.has(client.id)) {
        clients.delete(client.id);
        if (clients.size === 0) {
          this.rooms.delete(roomId);
        }
        // Notify other participants about disconnection
        client.to(roomId).emit('peer-disconnected', { peerId: client.id });
      }
    }
  }

  @SubscribeMessage('join-room')
  async handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string; userId: string },
  ) {
    try {
      const { roomId, userId } = data;

      // Join the room
      await client.join(roomId);

      if (!this.rooms.has(roomId)) {
        this.rooms.set(roomId, new Set());
      }
      this.rooms.get(roomId).add(client.id);

      // Notify other participants
      client.to(roomId).emit('peer-joined', {
        peerId: client.id,
        userId: userId,
      });

      return { success: true, roomId: roomId };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @SubscribeMessage('leave-room')
  async handleLeaveRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string },
  ) {
    const { roomId } = data;
    await client.leave(roomId);

    const room = this.rooms.get(roomId);
    if (room) {
      room.delete(client.id);
      if (room.size === 0) {
        this.rooms.delete(roomId);
      }
      // Notify other participants
      client.to(roomId).emit('peer-left', { peerId: client.id });
    }

    return { success: true };
  }

  @SubscribeMessage('signal')
  async handleSignal(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string; signal: any; targetId?: string },
  ) {
    const { roomId, signal, targetId } = data;

    if (targetId) {
      // Send to specific peer
      this.server.to(targetId).emit('signal', {
        signal,
        from: client.id,
      });
    } else {
      // Broadcast to all peers in the room except sender
      client.to(roomId).emit('signal', {
        signal,
        from: client.id,
      });
    }
  }
}
