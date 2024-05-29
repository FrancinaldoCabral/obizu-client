import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormProblemsComponent } from '../form-problems/form-problems.component';
import { DiscussionComponent } from '../discussion/discussion.component';
import { QuestionService } from '../services/question.service';

@Component({
  selector: 'app-question-details',
  standalone: true,
  imports: [
    FormProblemsComponent,
    DiscussionComponent
  ],
  templateUrl: './question-details.component.html',
  styleUrl: './question-details.component.css'
})
export class QuestionDetailsComponent implements OnChanges {

  @Input('question') question!:any
  totalComments:number = 0

  constructor(private questionService: QuestionService){

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['question']) {
      this.question = changes['question'].currentValue
      this.loadData()
    }
  }

  loadData(): void {
    const questionId = this.question._id
    this.questionService.getComments(1, 1, questionId).subscribe(
      data => {
        this.totalComments = data.totalItems
      },
      error=> {
        console.log(error)
        //this.toastr.error(`Erro no carregamento de questões. Erro: ${error.status}`)
    })
  }
}
