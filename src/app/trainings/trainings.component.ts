import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-trainings',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './trainings.component.html',
  styleUrl: './trainings.component.css'
})
export class TrainingsComponent {

  constructor(private auth: AuthService){}

  getUserRole(): string {
    return this.auth.getUser()?.role
  }

}
