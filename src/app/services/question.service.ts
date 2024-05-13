import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs'
import { AuthService } from './auth.service'

@Injectable({
  providedIn: 'root'
})
export class QuestionService {

  apiUrl: string = 'http://localhost:5000'
  config: any

  constructor(private http: HttpClient, private auth: AuthService) {
    this.config = {
      headers: new HttpHeaders({
        'authorization': `Bearer ${this.auth.getToken()}`
      })
    }
  }

  createQuestions(formData: FormData, model:string, type:string): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/create?model=${model}&type=${type}`, formData, {
      headers: new HttpHeaders({
        'authorization': `Bearer ${this.auth.getToken()}`
      })
    })
  }

  saveQuestionsInDB(questions: any[]): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/questions`, questions, {
      headers: new HttpHeaders({
        'authorization': `Bearer ${this.auth.getToken()}`
      })
    })
  }

  getQuestionsInDB(currentPage:number, pageSize:number): Observable<any>{
    return this.http.get<any[]>(`${this.apiUrl}/api/questions`, {
      params: {
        page: currentPage.toString(),
        pageSize: pageSize.toString()
      },
      headers: new HttpHeaders({
        'authorization': `Bearer ${this.auth.getToken()}`
      })
    })
  }

}
