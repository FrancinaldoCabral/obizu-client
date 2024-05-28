import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { QuestionService } from '../services/question.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-form-problems',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgxSpinnerModule
  ],
  templateUrl: './form-problems.component.html',
  styleUrl: './form-problems.component.css'
})
export class FormProblemsComponent {
  @Input('questionId') questionId!: string
  comment: string = ''
  
  constructor(
    private questionService: QuestionService,
    private toastrService: ToastrService,
    private ngxSpinner: NgxSpinnerService
  ){}
  
  addProblem():void{
    this.ngxSpinner.show('transactional')
    const comment = this.comment
    const questionId = this.questionId
    this.questionService.sinalizeProblem(comment, questionId).subscribe(
      data => {
        this.toastrService.success('Obrigado pelo feedback!')
        this.ngxSpinner.hide('transactional')
      },
      error => {
        this.ngxSpinner.hide('transactional')
        this.toastrService.error('Desculpe, houve um problema. Envie um email para suporte@obizu.online')
      }
    )
  }
}
