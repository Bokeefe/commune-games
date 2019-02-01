import { RoomModule } from './../../components/room/room.module';
import { RoomComponent } from './../../components/room/room.component';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

const routes: Routes = [
  {
    path: 'room',
    component: RoomComponent
  }
];
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RoomModule,
    RouterModule.forChild(routes)
  ]
})
export class LandingModule { }
