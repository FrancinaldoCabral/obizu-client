import { Component, Input } from '@angular/core';
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
export class QuestionDetailsComponent {
  @Input('question') question!:any


}
