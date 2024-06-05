import { Component } from '@angular/core';
import { EnvironmentService } from '../services/environment.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  constructor(private env: EnvironmentService){}
  login(): void {
    //testIChat321 or 1
    window.location.href = `${this.env.wpUrl}/conta?login_app=1`
  }
  getUrl(): string {
    return this.env.wpUrl
  }
}
