import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  login(): void {
    window.location.href = 'https://redatudo.online/minha-conta?login_app=testIChat321'
  }
}
