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
  currentRooms: any;
  nsp: any;

  private url = 'http://localhost:3000';
  socket;

  constructor(private _http: HttpClientService) {
    this.initSocket();
    this.setCurrentRooms([{name: 'dummy', gameId: 2}]);
  }

  getSocket(): any {
    return of(this.socket);
  }

  emit(path: string, data?: any): void {
    this.socket.emit(path, data);
  }

  joinRoom(): any {
    return of(this.socket);
  }


  getCurrentRooms(): Observable<any> {
    return of(this.currentRooms);
  }


  initSocket(): void {
    this.socket = io.connect(this.url);
  }

  initRoom(data: any): void {
    this.socket.emit('inRoom', data);
  }

  private setCurrentRooms(currentRooms: Array<any>): void {
    this.currentRooms = currentRooms;
  }
}
