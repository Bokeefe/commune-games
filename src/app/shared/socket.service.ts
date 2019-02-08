
// angular
import { EventEmitter, Injectable, Output } from '@angular/core';

// library
import { Observable, of } from 'rxjs';
import * as io from 'socket.io-client';

// services
import { HttpClientService } from './http-client.service';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  @Output() onCurrentRoomsChange$: EventEmitter<any>;

  currentRooms: any;

  private url = 'http://localhost:3000';

  private room;

  private socket;

  private socketId: string;

  constructor(private _http: HttpClientService) {
    this.onCurrentRoomsChange$ = new EventEmitter();
    this.initSocket();
    this.setSocketId();
    this.setCurrentRooms([{name: 'dummy', gameId: 2}]);
  }

  emit(path: string, data?: any): void {
    this.socket.emit(path, data);
  }

  getCurrentRooms(): Observable<any> {
    return of(this.currentRooms);
  }

  initSocket(): void {
    this.socket = io.connect(this.url);

    this.socket.emit('getCurrentRooms');

    this.socket.on('currentRooms', (rooms) => {
      this.onCurrentRoomsChange$.emit(rooms);
      this.setCurrentRooms(rooms);
    });
  }

  initRoom(room: any): void {
    console.log('FE room:', room);
    this.room = io(room);
    this.room.join(room);
  }

  private setCurrentRooms(currentRooms: Array<any>): void {
    this.currentRooms = currentRooms;
  }

  private setSocketId(): void {
    setTimeout(() => {
      this.socketId = this.socket.id;
    });
  }
}
