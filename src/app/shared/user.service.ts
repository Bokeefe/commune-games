import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  user: string;

  constructor() { }

  getUser(): string {
    return this.user;
  }

  setUser(user: string): void {
    this.user = user;
  }
}
