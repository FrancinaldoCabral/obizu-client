import { Component, Input, OnInit } from '@angular/core'
import { ActivatedRoute, RouterModule } from '@angular/router'
import { QuestionService } from '../services/question.service'
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner'
import { ToastrService } from 'ngx-toastr'
import { CommonModule } from '@angular/common'
import { SocketService } from '../services/socket.service'

@Component({
  selector: 'app-module',
  standalone: true,
  imports: [
    CommonModule,
    NgxSpinnerModule,
    RouterModule
  ],
  templateUrl: './module.component.html',
  styleUrl: './module.component.css'
})
export class ModuleComponent implements OnInit {
  @Input() id!: string
  module: any
  
  constructor(
    private questionService: QuestionService,
    private ngxSpinner: NgxSpinnerService,
    private toastrService: ToastrService,
    private socketService: SocketService
  ){
    this.socketService.getConnecSource$.subscribe(
      (connect:any) => {
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
    this.questionService.getOneModule(this.id).subscribe(
      data => {
        this.module = data
        this.ngxSpinner.hide('transactional')
      },
      error=> {
        console.log(error)
        this.ngxSpinner.hide('transactional')
        this.toastrService.error(`Erro no carregamento de questões. Erro: ${error.status}`)
      },
      ()=> this.ngxSpinner.hide('transactional'))
  }

}
