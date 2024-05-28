import { Component, OnInit } from '@angular/core';
import { QuestionService } from '../services/question.service';
import { CommonModule } from '@angular/common';
import { QuillModule } from 'ngx-quill';
import { FormsModule } from '@angular/forms';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { QuestionComponent } from '../question/question.component';
import { PaginationComponent } from '../pagination/pagination.component';
import { SocketService } from '../services/socket.service';
import { ToastrService } from 'ngx-toastr';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-problems',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    QuillModule,
    NgxSpinnerModule,
    QuestionComponent,
    PaginationComponent,
    RouterModule
  ],
  templateUrl: './problems.component.html',
  styleUrl: './problems.component.css'
})
export class ProblemsComponent implements OnInit {
  problems: any[]=[]
  totalItems: number = 0
  currentPage: number = 1
  pageSize: number = 5
  questions: any = []
  editQuestion:any = null
  newAlternative: string = ''

  constructor(
    private questionService: QuestionService,
    private ngxSpinner: NgxSpinnerService,
    private socketService: SocketService,
    private toastr: ToastrService
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

  loadData() {
    this.ngxSpinner.show('transactional')
    this.questionService.getProblems(this.currentPage, this.pageSize).subscribe(
      data => {
        this.problems = data.items
        this.questions = data.questions
        this.totalItems = data.totalItems
        this.ngxSpinner.hide('transactional')
      },
      error=> {
        console.log(error)
        this.ngxSpinner.hide('transactional')
        //this.toastr.error(`Erro no carregamento de questões. Erro: ${error.status}`)
      },
      ()=> this.ngxSpinner.hide('transactional'))
  }

  onPageChange(page: number) {
    this.currentPage = page
    this.loadData()
  }

  updateQuestion(question: any): void {
    this.ngxSpinner.show('transactional')
    this.questionService.updateQuestionsInDB([question]).subscribe(
      success => {
        this.ngxSpinner.hide('transactional')
        this.editQuestion=null
        this.loadData()
        this.toastr.success(`Questão atualizada com sucesso.`)
        this.editQuestion = null
      },
      error => {
        this.toastr.error(`Erro na atualização da questão.`)
        this.ngxSpinner.hide('transactional')
      }
    )
  }

  removeQuestion(_id:any): void {
    this.ngxSpinner.show('transactional')
    this.questionService.deleteQuestionsInDB(_id).subscribe(
      success => {
        this.ngxSpinner.hide('transactional')
        this.editQuestion=null
        this.loadData()
        this.toastr.success(`Questão removida com sucesso.`)
        this.editQuestion = null
      },
      error => {
        this.toastr.error(`Erro na remoção da questão.`)
        this.ngxSpinner.hide('transactional')
      }
    )
  }

  removeProblem(_id:any): void {
    this.ngxSpinner.show('transactional')
    this.questionService.removeProblem(_id).subscribe(
      success => {
        this.ngxSpinner.hide('transactional')
        this.loadData()
        this.toastr.success(`Problema removido com sucesso.`)
        this.editQuestion = null
      },
      error => {
        this.toastr.error(`Erro na atualização da questão.`)
        this.ngxSpinner.hide('transactional')
      }
    )
  }

  getQuestionById(_id:string): any {
    return this.questions.filter((question:any)=>{
      return _id===question._id
    })[0]
  }

  trackByQuestionId(index: number, question: any): any {
    return index; // Suponha que cada pergunta tem uma propriedade 'id' única
  }
}
