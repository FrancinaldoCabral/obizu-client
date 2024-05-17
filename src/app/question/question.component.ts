import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';

@Component({
  selector: 'app-question',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    QuillModule
  ],
  templateUrl: './question.component.html',
  styleUrl: './question.component.css'
})
export class QuestionComponent {
  @Input('question') question: any = {
    categories: [],
    statement:'',
    alternatives: [],
    answer: 0,
    comment: ''
  }
  @Input('isEditable') isEditable:boolean = false

  tempQuestion: any = undefined

  newAlternative: string = ''

  decodificarSequenciasUnicode(texto: string): string {
    return texto.replace(/\\u[\dA-Fa-f]{4}/g, (match) => {
        return String.fromCharCode(parseInt(match.replace(/\\u/g, ''), 16))
    })
  }

  trackByQuestionId(index: number, question: any): any {
    return index; // Suponha que cada pergunta tem uma propriedade 'id' única
  }

  editQuestion(question: any): void {
    
    setTimeout(() => {
      this.tempQuestion = question
      document.getElementById('btnEditQuestionModal')?.click()
    }, 100);
  }

  modalEditClose(): void {
    document.getElementById('btnEditQuestionModal')?.click()
    this.tempQuestion = null
  }
}
