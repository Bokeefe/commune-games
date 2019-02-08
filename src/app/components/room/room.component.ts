import { RoomService } from './../../shared/room.service';
import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/shared/user.service';
import { SocketService } from 'src/app/shared/socket.service';
import * as io from 'socket.io-client';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit {

  roomName: string;

  roomSocket: any;

  user: string;

  constructor(private _roomService: RoomService,
              private _ioService: SocketService,
              private _userService: UserService) {
      this.setRoom(this._roomService.getCurrentRoom());
      this.setUser(this._userService.getUser());
   }

   private initRoom(): void {
    this._ioService.emit('joinRoom', this.roomName);
  }

  private setUser(user: string): void {
    this.user = user;
  }

  private setRoom(roomName: string): void {
    this.roomName = roomName;
  }

  ngOnInit() {
    this.initRoom();
  }

}
