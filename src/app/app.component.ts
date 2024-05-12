import { Component, OnInit } from '@angular/core'
import { RouterModule } from '@angular/router';
import { AuthService } from './services/auth.service'
import { SocketService } from './services/socket.service'
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner'
import { HTTP_INTERCEPTORS } from '@angular/common/http'
import { TokenInterceptor } from './services/token.interceptor'
import { LoginComponent } from './login/login.component';
import { QuestionService } from './services/question.service';

//declare var hljs: any

@Component({
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [
    LoginComponent,
    NgxSpinnerModule,
    RouterModule
  ],
  providers: [
    NgxSpinnerService,
    AuthService,
    SocketService,
    QuestionService,
    {
      provide: HTTP_INTERCEPTORS, 
      useClass: TokenInterceptor, 
      multi: true
    }
  ]
})
export class AppComponent implements OnInit {
  constructor(
    private authService: AuthService, 
    private socketService: SocketService,
    private ngxSpinnerService: NgxSpinnerService
  ){}
  ngOnInit(): void {
    this.fetchUser()
  }
  
  fetchUser(): void {
    this.ngxSpinnerService.show()
    this.authService.fetchUser()
      .then(success => {
        //this.pubService.insertPub()
        if(success) {
          this.socketService.setupSocketConnection()
          this.ngxSpinnerService.hide()
        }else{
          this.ngxSpinnerService.hide()
        }
      })
      .catch(error=>{
        this.ngxSpinnerService.hide()
        this.authService.login()
      })
      .finally(()=>{
        this.ngxSpinnerService.hide()
        //this.ngxSpinner.hide('autenticate')
      })
  }
}
