import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class QuestionService {

  apiUrl: string = 'http://localhost/api'

  constructor(private http: HttpClient) {
    
  }

  createQuestions(formData: FormData, model:string, type:string): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/create?model=${model}&type=${type}`, formData)
  }

  saveQuestionsInDB(questions: any[]): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/questions`, questions)
  }

}
