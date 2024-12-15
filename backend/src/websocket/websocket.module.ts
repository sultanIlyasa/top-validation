import { Module } from '@nestjs/common';
import { CustomWebSocketGateway } from './websocket.gateway';

@Module({
  providers: [CustomWebSocketGateway],
  exports: [CustomWebSocketGateway],
})
export class WebSocketModule {}