import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PaginationComponent } from '../pagination/pagination.component';
import { QuestionComponent } from '../question/question.component';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { QuillModule } from 'ngx-quill';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { QuestionService } from '../services/question.service';
import { SocketService } from '../services/socket.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-discussion',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgxSpinnerModule,
    PaginationComponent,
  ],
  templateUrl: './discussion.component.html',
  styleUrl: './discussion.component.css'
})
export class DiscussionComponent implements OnInit, OnChanges  {
  @Input('question') question!:any
  @Output('totalComments') totalCommentsEmitter: EventEmitter<number> = new EventEmitter<number>()
  comment: string = ''

  comments: any[]=[]
  totalItems: number = 0
  currentPage: number = 1
  pageSize: number = 5

  constructor(
    private questionService: QuestionService,
    private ngxSpinner: NgxSpinnerService,
    private auth: AuthService
  ){

  }

  ngOnInit(): void {

  }

  getUser(): any {
    return this.auth.getUser()
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['question']) {
      this.question = changes['question'].currentValue
      this.loadData()
    }

    if(changes['totalItems']){
      this.totalCommentsEmitter.emit(changes['totalItems'].currentValue)
    }
  }

  loadData(): void {
    this.ngxSpinner.show()
    const questionId = this.question._id
    this.questionService.getComments(this.currentPage, this.pageSize, questionId).subscribe(
      data => {
        this.comments = data.items
        console.log(this.comments)
        this.totalItems = data.totalItems
        console.log(this.totalItems)
        this.totalCommentsEmitter.emit(this.totalItems)
        this.ngxSpinner.hide()
      },
      error=> {
        console.log(error)
        this.ngxSpinner.hide()
        //this.toastr.error(`Erro no carregamento de questões. Erro: ${error.status}`)
    })
  }

  addComment(): void {
    this.ngxSpinner.show()
    this.questionService.addComment(this.comment, this.question._id).subscribe(
      data => {
        this.ngxSpinner.hide()
        this.loadData()
      },
      error=> {
        console.log(error)
        this.ngxSpinner.hide()
        //this.toastr.error(`Erro no carregamento de questões. Erro: ${error.status}`)
    })
  }

  onPageChange(page: number) {
    this.currentPage = page
    this.loadData()
  }
  
}
