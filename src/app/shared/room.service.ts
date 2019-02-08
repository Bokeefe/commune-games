import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  currentRoom: string;

  constructor() { }

  getCurrentRoom(): string {
    return this.currentRoom;
  }

  setCurrentRoom(room: string): void {
    this.currentRoom = room;
  }
}
