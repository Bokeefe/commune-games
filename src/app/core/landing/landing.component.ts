import { RoomService } from './../../shared/room.service';
// angular
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators, ValidatorFn} from '@angular/forms';

// services
import { SocketService } from './../../shared/socket.service';
import { Router } from '@angular/router';
import { UserService } from 'src/app/shared/user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {
  currentRooms: any;
  currentRoomsSub: Subscription;
  errorMessages: any;
  landingForm: FormGroup;
  socket: any;

  constructor(private _ioService: SocketService,
              private _roomService: RoomService,
              private router: Router,
              private _userService: UserService) {
    this.initForm();
    this.errorMessages = {
      currentRooms: '',
      newRoom: '',
      callSign: '',
    };
  }

  ngOnInit() {
    this._ioService.getSocket().subscribe((socket) => {this.socket = socket; });
    this.socket.emit('getCurrentRooms');
    this.currentRoomsSub = this.socket.on('currentRooms', (currentRooms) => {
      console.log(currentRooms);
      this.currentRooms = currentRooms;
    });

  }

  onKeydown(event: any): void {
    if (event.keyCode === 13) {
      this.onSubmit('submit');
    }
  }

  onRoomSelect(event: any): void {
    this._roomService.setCurrentRoom(event.target.value);
  }

  onSubmit(event: any): void {
    if (this.landingForm.valid && !this.landingForm.value['newRoom']) {
      console.log('existing room');

      const roomObj = {
        roomName: this.landingForm.value['currentRooms'],
        callSign: this.landingForm.value['callSign']
      };

      console.log(roomObj);
      this._ioService.emit('joinRoom', roomObj);
      this._roomService.setCurrentRoom(roomObj.roomName);
      this.router.navigate(['room']);
    } else if (this.landingForm.valid && this.landingForm.value['newRoom']) {
      console.log('new room');

      const roomObj = {
        roomName: this.landingForm.value['newRoom'],
        callSign: this.landingForm.value['callSign']
      };

      this._ioService.emit('joinRoom', roomObj );
      this._roomService.setCurrentRoom(roomObj.roomName);
      this._userService.setUser(roomObj.callSign);
      this.router.navigate(['room']);
    } else {
      for (const key in this.landingForm['controls']) {
        if (this.landingForm['controls'].hasOwnProperty(key)) {
          if (!!this.landingForm.controls[key].errors) {
            this.setErrorMessage(key, 'You missed a required field');
          }
        }
      }
    }
  }

  private customValidation(): ValidatorFn {
    let isValid;

    if (!!this.landingForm.value['currenRooms'].value && !!this.landingForm.value['newRoom'].value) {
      this.setErrorMessage('currentRoom', 'please either create a new room OR an existing one');
      isValid = false;
    } else if (!!this.landingForm.value['currenRooms'].value && this.landingForm.value['newRoom'].value) {
      isValid = true;
    } else if (this.landingForm.value['currenRooms'].value && !!this.landingForm.value['newRoom'].value) {
      isValid = true;
    }

    return isValid;
  }

  private initForm(): void {
    this.landingForm = new FormGroup({
      currentRooms: new FormControl('', ),
      newRoom: new FormControl('', ),
      callSign: new FormControl('', Validators.required)
    });
  }

  private setCurrentRooms(currentRooms: any): void {
    this.currentRooms = {};
    for (const key in currentRooms) {
      if (currentRooms.hasOwnProperty(key) && !this.currentRooms.hasOwnProperty(key)) {
        this.currentRooms[key] = currentRooms[key];
      }
    }
  }

  private setErrorMessage(key: string, errorMessage: string): void {
    this.errorMessages[key] = errorMessage;
  }
}
