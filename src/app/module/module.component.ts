import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, RouterModule } from '@angular/router'
import { QuestionService } from '../services/question.service'
import { NgxSpinnerService } from 'ngx-spinner'
import { ToastrService } from 'ngx-toastr'
import { CommonModule } from '@angular/common'
import { SocketService } from '../services/socket.service'

@Component({
  selector: 'app-module',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './module.component.html',
  styleUrl: './module.component.css'
})
export class ModuleComponent implements OnInit {
  
  moduleId:string = ''
  module: any
  
  constructor(
    private activatedRoute: ActivatedRoute,
    private questionService: QuestionService,
    private ngxSpinner: NgxSpinnerService,
    private toastrService: ToastrService,
    private socketService: SocketService
  ){
    this.moduleId = this.activatedRoute.snapshot.params['id']
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
    this.moduleId = this.activatedRoute.snapshot.params['id']
    if(this.socketService.getSocketIsConnect()) {
      this.loadData()
    }
  }

  loadData() {
    this.ngxSpinner.show('transactional')
    this.questionService.getOneModule(this.moduleId).subscribe(
      data => {
        this.module = data
        console.log(this.module)
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
