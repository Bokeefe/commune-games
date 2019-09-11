import { RoomService } from './../../shared/room.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from 'src/app/shared/user.service';
import { SocketService } from 'src/app/shared/socket.service';
import * as io from 'socket.io-client';
import { HttpClient } from 'selenium-webdriver/http';
import { HttpClientService } from 'src/app/shared/http-client.service';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit {

  roomName: string;
  room: any;
  players: any;
  nsp: any;
  user: string;
  socket: any;

  constructor(private _http: HttpClientService,
              private _roomService: RoomService,
              private _ioService: SocketService,
              private _userService: UserService) {
      this.setRoom(this._roomService.getCurrentRoom());
      this.setUser(this._userService.getUser());
      this.roomName = this._roomService.getCurrentRoom();
   }

  ngOnInit() {
    this._ioService.getSocket().subscribe((socket) => {
      this.socket = socket;
    });

    this.socket.on('message', (data) => {
      console.log(data);
    });

    console.log(this.roomName, this.user);
    this.socket.emit('joinRoom', {
      roomName: this.roomName,
      callSign: this.user
    }).subscribe((data) => {
      console.log(data);
    });
  }

  private setUser(user: string): void {
    this.user = user;
  }

  private setRoom(roomName: string): void {
    this.roomName = roomName;
  }
}
