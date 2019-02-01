// angular
import { Component } from '@angular/core';

// services
import { SocketService } from './shared/socket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'commune-games';

  constructor(private _ioService: SocketService) {
    this._ioService.initSocket();
  }
}
