import { Component } from '@angular/core';
import { QuestionService } from '../services/question.service';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { SocketService } from '../services/socket.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-questions-random',
  standalone: true,
  imports: [
    NgxSpinnerModule,
    CommonModule
  ],
  templateUrl: './questions-random.component.html',
  styleUrl: './questions-random.component.css'
})
export class QuestionsRandomComponent {
  questions: any[] = []
  currentPage: number = 1
  pageSize: number = 10
  totalItems: number = 0


  categories: any[] = []
  filters: any[] = []

  constructor(
    private questionService: QuestionService,
    private ngxSpinner: NgxSpinnerService,
    private socketService: SocketService,
    private toastr: ToastrService
  ){
    this.socketService.getConnecSource$.subscribe(
      connect => {
          if(connect){
            this.loadCategories()
          }else{
            this.ngxSpinner.hide()
          }
      }
    )
  }
  
  ngOnInit(): void {
    if(this.socketService.getSocketIsConnect()) {
      this.loadCategories()
    }
  }

  loadCategories() {
    this.ngxSpinner.show('transactional')
/*     this.questionService.getCategories().subscribe(
      data => {
        this.categories = data.categories
        console.log(data.categories)
        this.ngxSpinner.hide('transactional')
      },
      error=> {
        console.log(error)
        this.ngxSpinner.hide('transactional')
        this.toastr.error(`Erro no carregamento de questões. Erro: ${error.status}`)
      },
      ()=> this.ngxSpinner.hide('transactional')) */
  }

  decodificarSequenciasUnicode(texto: string): string {
    return texto.replace(/\\u[\dA-Fa-f]{4}/g, (match) => {
        return String.fromCharCode(parseInt(match.replace(/\\u/g, ''), 16))
    })
  }

  getCategories(): any[]{
    return this.categories.filter((c:any)=>{
      return !this.filters.includes(c)
    })
  }
}
