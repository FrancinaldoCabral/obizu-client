import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { NgIf } from '@angular/common';
import { SocketService } from '../services/socket.service';
import { QuestionService } from '../services/question.service';

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
  constructor(private auth: AuthService, private questionsService: QuestionService){}

  logout(): void {
    this.auth.logout()
  }

  login(): void {
    window.location.href = 'https://obizu.online/my-account?login_app='
  }

  isConnected(): boolean {
    return this.auth.getAuthenticate()
  }

  isAdmin(): boolean {
    return this.auth.getUser()?.role.includes('administrator') === true
  }

  getUserRole(): string {
    return this.auth.getUser()?.role 
  }

  backupQuestions(): void {
    this.questionsService.backup().subscribe(
      questions => {
        if(questions.length==0) {
          alert('Não há questões.')
          return
        }
    
        const jsonStr = JSON.stringify(questions, null, 2) 
        const blob = new Blob([jsonStr], { type: 'application/json' })
        const url = window.URL.createObjectURL(blob)
    
        const a = document.createElement('a')
        a.href = url
        a.download = 'bck-admin-questions.json'
        a.click()
    
        window.URL.revokeObjectURL(url)
      }
    )
  }

}
