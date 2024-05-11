// app.service.ts
import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import env from './env'

@Injectable({
  providedIn: 'root',
})
export class CreateQuestionsService {

  apiUrl: string = env.apiHost

  constructor(private http: HttpClient) {}

  createQuestions(formData: FormData, model:string, type:string): Observable<any> {
    return this.http.post(`${this.apiUrl}/upload?model=${model}&type=${type}`, formData)
  }

  saveQuestionsInDB(questions: any[]): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/questions`, questions)
  }
}
