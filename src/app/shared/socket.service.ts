
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
  @Output() onCurrentTeamsChange$: EventEmitter<any>;

  currentTeams: any;

  private url = 'http://localhost:3000';

  private socket;

  private socketId: string;

  constructor(private _http: HttpClientService) {
    this.onCurrentTeamsChange$ = new EventEmitter();
    this.initSocket();
    this.setSocketId();
    this.setCurrentTeams([{name: 'dummy', gameId: 2}]);
  }

  getCurrentTeams(): Observable<any> {
    return of(this.currentTeams);
  }

  initSocket(): void {
    this.socket = io.connect(this.url);

    this.socket.emit('getCurrentTeams');

    this.socket.on('currentTeams', (teams) => {
      this.onCurrentTeamsChange$.emit(teams);
      this.setCurrentTeams(teams);
    });
  }

  room(room: string): void {

    console.log(room);
    this.socket.join(room);
  }

  private setCurrentTeams(currentTeams: Array<any>): void {
    this.currentTeams = currentTeams;
  }

  private setSocketId(): void {
    setTimeout(() => {
      this.socketId = this.socket.id;
    });
  }
}
