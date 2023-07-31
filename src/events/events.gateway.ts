import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { from, interval, Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('events')
  findAll(@MessageBody() data: any): Observable<WsResponse<number>> {
    return interval(10000).pipe(
      mergeMap(() => from([1, 2, 3])),
      map((item) => ({ event: 'events', data: item })),
    );
  }

  @SubscribeMessage('identity')
  async identity(@MessageBody() data: number): Promise<number> {
    return data;
  }

  @SubscribeMessage('logMessage')
  logMessage(@MessageBody() data: any): void {
    console.log('Mensagem recebida do cliente:', data);
  }

  handleConnection(client: any, ...args: any[]): void {
    console.log('Um usuário foi conectado');
  }

  handleDisconnect(client: any): void {
    console.log('Um usuário foi desconectado');
  }
}
