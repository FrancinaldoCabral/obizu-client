import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { QuestionService } from '../services/question.service';
import { ToastrService } from 'ngx-toastr';
import { SocketService } from '../services/socket.service';
import { PaginationComponent } from '../pagination/pagination.component';

@Component({
  selector: 'app-responses',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NgxSpinnerModule,
    PaginationComponent
  ],
  templateUrl: './responses.component.html',
  styleUrl: './responses.component.css'
})
export class ResponsesComponent {
  
  responses: any[] = []
  filters: string[] = []
  currentPage:number = 1
  itemsPerPage:number = 3
  
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

  onPageChange(page: number) {
    this.currentPage = page
  }

  loadData(): void {
    this.ngxSpinner.show()
    this.questionService.usersResponses(this.filters).subscribe(
      data => {
        this.responses = data.userResponses
        console.log(this.responses)
        this.ngxSpinner.hide()
      },
      error=> {
        console.log(error)
        this.ngxSpinner.hide()
        this.toastrService.error(`Erro no carregamento de questões. Erro: ${error.status}`)
      })
  }

  acertos(): any {
    const countResponses = this.responses.length
    const acertos = this.responses.filter((resp:any)=>{ return resp.isCorrect }).length
    const perCentAcertos = (acertos * 100) / countResponses
    return { acertos, perCentAcertos }
  }

  acertosPerFilters(): any[] {
    const results:any[] = []
    const generateKey = (categories: string[]): string => {
      return categories.join('|')
    }
    const countCategories = (objetos: { _id: number, categories: string[], isCorrect:boolean }[]) => {
      const counts: { [key: string]: { total: number, correct: number } } = {};

      objetos.forEach(objeto => {
        const key = generateKey(objeto.categories);
        if (counts[key]) {
          counts[key].total++;
          if (objeto.isCorrect) {
            counts[key].correct++;
          }
        } else {
          counts[key] = { total: 1, correct: objeto.isCorrect ? 1 : 0 };
        }
      })
    
      return counts;
    }
    const getUniqueCategoriesWithCounts = (objetos: { _id: number, categories: string[], isCorrect:boolean }[]) => {
      const counts = countCategories(objetos);
    
      return Object.keys(counts).map(key => {
        return {
          categories: key.split('|'),
          total: counts[key].total,
          correct: counts[key].correct
        };
      });
    }
    
    const uniqueCategoriesWithCounts = getUniqueCategoriesWithCounts(this.responses)

    uniqueCategoriesWithCounts.sort((a, b) => {
      const categoriesA = a.categories.join()
      const categoriesB = b.categories.join()
      return categoriesA.localeCompare(categoriesB)
    })

    return uniqueCategoriesWithCounts
  }  

  responsesPagination(): any[]{
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = this.currentPage * this.itemsPerPage;
    return this.responses.slice(start, end)
  }
}
