import { Component, Input, OnInit } from '@angular/core';
import { FormProblemsComponent } from '../form-problems/form-problems.component';
import { DiscussionComponent } from '../discussion/discussion.component';

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
export class QuestionDetailsComponent implements OnInit {

  @Input('question') question!:any
  totalComments!:number

  ngOnInit(): void {
    console.log('question in question details', this.question)
  }

  receiveTotalComments(event: any) {
    console.log('receive total comments', event)
    this.totalComments = event;
  }
}
