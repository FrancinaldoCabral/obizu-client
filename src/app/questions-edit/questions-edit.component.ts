import { CommonModule } from '@angular/common'
import { HttpClientModule } from '@angular/common/http'
import { Component, OnInit } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { QuillModule } from 'ngx-quill'
import { SocketService } from '../services/socket.service'
import { QuestionService } from '../services/question.service'
import { NgxSpinnerService } from 'ngx-spinner'
import { ToastrService } from 'ngx-toastr'
import { QuestionComponent } from '../question/question.component'

@Component({
  selector: 'app-questions-edit',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    QuillModule,
    QuestionComponent
  ],
  providers: [
//    SocketService,
    QuestionService
  ],
  templateUrl: './questions-edit.component.html',
  styleUrl: './questions-edit.component.css'
})
export class QuestionsEditComponent implements OnInit {
  questions: any[] = []
  currentPage: number = 1
  pageSize: number = 10
  totalItems: number = 0

  editQuestion: any = null

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
            this.ngxSpinner.hide('question-ia-generator')
          }
      }
    )
  }
  
  ngOnInit(): void {
    if(this.socketService.getSocketIsConnect()) this.loadData()
  }

  trackByQuestionId(index: number, question: any): any {
    return index; // Suponha que cada pergunta tem uma propriedade 'id' única
  }

  decodificarSequenciasUnicode(texto: string): string {
    return texto.replace(/\\u[\dA-Fa-f]{4}/g, (match) => {
        return String.fromCharCode(parseInt(match.replace(/\\u/g, ''), 16))
    })
  }

  removeQuestion(_id:any): void {
    this.ngxSpinner.show()
    this.questionService.deleteQuestionsInDB(_id).subscribe(
      success => {
        console.log(success)
        this.ngxSpinner.hide()
        this.loadData()
        this.toastr.success(`Questão atualizada com sucesso.`)
        this.editQuestion = null
      },
      error => {
        this.toastr.error(`Erro na atualização da questão.`)
        this.ngxSpinner.hide()
      }
    )
  }

  updateQuestion(question: any): void {
    this.ngxSpinner.show()
    this.questionService.updateQuestionsInDB([question]).subscribe(
      success => {
        console.log(success)
        this.ngxSpinner.hide()
        this.loadData()
        this.toastr.success(`Questão atualizada com sucesso.`)
        this.editQuestion = null
      },
      error => {
        this.toastr.error(`Erro na atualização da questão.`)
        this.ngxSpinner.hide()
      }
    )
  }

  loadData() {
    this.ngxSpinner.show()
    this.questionService.getQuestionsInDB(this.currentPage, this.pageSize).subscribe(
      data => {
        console.log(data)
        this.questions = data.items
        this.totalItems = data.totalItems
        this.ngxSpinner.hide()
      },
      error=> {
        console.log(error)
        this.ngxSpinner.hide()
        this.toastr.error(`Erro no carregamento de questões. Erro: ${error.status}`)
      },
      ()=> this.ngxSpinner.hide())
  }

  onPageChange(page: number) {
    this.currentPage = page
    this.loadData()
  }

  getPages(): number[] {
    const totalPages = Math.ceil(this.totalItems / this.pageSize)
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }

  totalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize)
  }
  
}
