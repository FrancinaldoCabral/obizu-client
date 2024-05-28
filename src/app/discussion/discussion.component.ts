import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-discussion',
  standalone: true,
  imports: [],
  templateUrl: './discussion.component.html',
  styleUrl: './discussion.component.css'
})
export class DiscussionComponent {
  @Input('questionId') questionId!:string
  
}
