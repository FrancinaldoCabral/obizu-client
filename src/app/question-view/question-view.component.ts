import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { QuestionService } from '../services/question.service';
import { ToastrService } from 'ngx-toastr';
import { SocketService } from '../services/socket.service';
import { QuestionDetailsComponent } from '../question-details/question-details.component';
import { DiscussionComponent } from '../discussion/discussion.component';

@Component({
  selector: 'app-question-view',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NgxSpinnerModule,
    QuestionDetailsComponent
    
  ],
  templateUrl: './question-view.component.html',
  styleUrl: './question-view.component.css'
})
export class QuestionViewComponent implements OnChanges, OnInit {
  @Input() id!:string
  question: any = {}
  constructor(
    private ngxSpinner: NgxSpinnerService,
    private questionService: QuestionService,
    private toastrService: ToastrService,
    private socketService: SocketService,
    private router: Router
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
    if(this.socketService.getSocketIsConnect()) this.loadData()
  }
  ngOnChanges(changes: SimpleChanges): void {
    if(changes['id']) this.loadData()
  }

  loadData(): void {
    this.ngxSpinner.show()
    this.questionService.getOneQuestionInDB(this.id).subscribe(
      data => {
        this.question = data
        this.ngxSpinner.hide()
      },
      error => {
        console.log(error)
        this.ngxSpinner.hide()
        //this.toastrService.error('Erro no carregamento da questão.')
      },
      () => {
        this.ngxSpinner.hide()
      }
    )
  }

  getQuestion(): any {
    return this.question
  }
}
