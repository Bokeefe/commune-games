import { RoomComponent } from './room.component';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

const routes: Routes = [
  {
    path: 'room',
    component: RoomComponent
  }
];

@NgModule({
  declarations: [
    RoomComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class RoomModule { }
