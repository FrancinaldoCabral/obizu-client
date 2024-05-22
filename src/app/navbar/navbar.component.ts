import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { NgIf } from '@angular/common';
import { SocketService } from '../services/socket.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    RouterModule,
    NgIf
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  constructor(private auth: AuthService){}

  logout(): void {
    this.auth.logout()
  }

  login(): void {
    window.location.href = 'https://obizu.online/my-account?login_app='
  }

  isConnected(): boolean {
    return this.auth.getAuthenticate()
  }

}
