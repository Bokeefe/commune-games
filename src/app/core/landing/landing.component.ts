// angular
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators} from '@angular/forms';

// services
import { SocketService } from './../../shared/socket.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnDestroy, OnInit {
  currentTeams: any;

  landingForm: FormGroup;

  constructor(private _ioService: SocketService,
              private router: Router) {
    this.initSubs();
    this.initForm();
  }

  onKeydown(event: any): void {
    if (event.keyCode === 13) {
      this.onSubmit();
    }
  }

  onSubmit(): void {
    if (this.landingForm.valid) {
      if (this.landingForm.value['teamName']) {
        this.router.navigate(['room']);
      }
    }
  }

  private initForm(): void {
    this.landingForm = new FormGroup({
      currentTeams: new FormControl(''),
      teamName: new FormControl(''),
      callSign: new FormControl('', Validators.required)
    });
  }

  private initSubs(): void {
    this._ioService.onCurrentTeamsChange$.subscribe(
      data => this.setCurrentTeams(data)
    );
  }

  private setCurrentTeams(currentTeams: any): void {
    this.currentTeams = {};
    for (let key in currentTeams) {
      if (currentTeams.hasOwnProperty(key) && !this.currentTeams.hasOwnProperty(key)) {
        this.currentTeams[key] = currentTeams[key];
      }
    }
  }

  ngOnInit() {
    this.initSubs();
    setTimeout(() => {
      this._ioService.room('test');
    }, 3000);
  }

  ngOnDestroy() {
    this._ioService.onCurrentTeamsChange$.unsubscribe();
  }

}
