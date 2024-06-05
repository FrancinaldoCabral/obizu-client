import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { PaginationComponent } from '../pagination/pagination.component';
import { QuestionService } from '../services/question.service';
import { AuthService } from '../services/auth.service';
import { SocketService } from '../services/socket.service';
import { ToastrService } from 'ngx-toastr';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-discussion-admin',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgxSpinnerModule,
    PaginationComponent,
    RouterModule
  ],
  templateUrl: './discussion-admin.component.html',
  styleUrl: './discussion-admin.component.css'
})
export class DiscussionAdminComponent implements OnInit {
  comments: any[]=[]
  totalItems: number = 0
  currentPage: number = 1
  pageSize: number = 5

  constructor(
    private questionService: QuestionService,
    private ngxSpinner: NgxSpinnerService,
    private auth: AuthService,
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
    this.ngxSpinner.show()
    this.questionService.getCommentsAdmin(this.currentPage, this.pageSize).subscribe(
      data => {
        this.comments = data.items
        this.totalItems = data.totalItems
        this.ngxSpinner.hide()
      },
      error=> {
        console.log(error)
        this.ngxSpinner.hide()
        //this.toastr.error(`Erro no carregamento de questões. Erro: ${error.status}`)
      },
      ()=> this.ngxSpinner.hide())
  }

  removeComment(_id:any):void {
    this.ngxSpinner.show()
    this.questionService.removeComment(_id).subscribe(
      data => {
        this.ngxSpinner.hide()
        this.loadData()
      },
      error=> {
        console.log(error)
        this.ngxSpinner.hide()
        //this.toastr.error(`Erro no carregamento de questões. Erro: ${error.status}`)
      },
      ()=> this.ngxSpinner.hide())
  }

  onPageChange(page: number) {
    this.currentPage = page
    this.loadData()
  }

}
