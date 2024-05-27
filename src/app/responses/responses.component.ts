import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { QuestionService } from '../services/question.service';
import { ToastrService } from 'ngx-toastr';
import { SocketService } from '../services/socket.service';

@Component({
  selector: 'app-responses',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NgxSpinnerModule
  ],
  templateUrl: './responses.component.html',
  styleUrl: './responses.component.css'
})
export class ResponsesComponent {
  responses: any[] = []
  filters: string[] = []
  
  constructor(
    private ngxSpinner: NgxSpinnerService,
    private questionService: QuestionService,
    private toastrService: ToastrService,
    private socketService: SocketService
  ){
    this.socketService.getConnecSource$.subscribe(
      connect => {
          if(connect){
            this.loadData()
          }else{
            this.ngxSpinner.hide()
          }
      }
    )
  }

  ngOnInit(): void {
    if(this.socketService.getSocketIsConnect()) {
      this.loadData()
    }
  }

  loadData(): void {
    this.ngxSpinner.show('transactional')
    this.questionService.usersResponses(this.filters).subscribe(
      data => {
        this.responses = data.userResponses
        console.log(this.responses)
        this.ngxSpinner.hide('transactional')
      },
      error=> {
        console.log(error)
        this.ngxSpinner.hide('transactional')
        this.toastrService.error(`Erro no carregamento de questões. Erro: ${error.status}`)
      })
  }
}
