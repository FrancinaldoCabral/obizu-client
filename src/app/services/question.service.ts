import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs'
import { AuthService } from './auth.service'
import { EnvironmentService } from './environment.service'

@Injectable({
  providedIn: 'root'
})
export class QuestionService {

  config: any

  constructor(
    private http: HttpClient, 
    private auth: AuthService,
    private env: EnvironmentService) {
    this.config = {
      headers: new HttpHeaders({
        'authorization': `Bearer ${this.auth.getToken()}`
      })
    }
  }

  createQuestions(formData: any, model:string, type:string): Observable<any> {
    return this.http.post(`${this.env.apiUrl}/api/create?model=${model}&type=${type}`, formData, {
      headers: new HttpHeaders({
        'authorization': `Bearer ${this.auth.getToken()}`
      })
    })
  }

  replicQuestions(formData: any, model:string, type:string): Observable<any> {
    return this.http.post(`${this.env.apiUrl}/api/create?model=${model}&type=${type}`, formData, {
      headers: new HttpHeaders({
        'authorization': `Bearer ${this.auth.getToken()}`
      })
    })
  }

  saveQuestionsInDB(questions: any[]): Observable<any> {
    return this.http.post(`${this.env.apiUrl}/api/questions`, questions, {
      headers: new HttpHeaders({
        'authorization': `Bearer ${this.auth.getToken()}`
      })
    })
  }

  updateQuestionsInDB(questions: any[]): Observable<any> {
    return this.http.put(`${this.env.apiUrl}/api/questions`, questions, {
      headers: new HttpHeaders({
        'authorization': `Bearer ${this.auth.getToken()}`
      })
    })
  }

  deleteQuestionsInDB(_id:any): Observable<any> {
    return this.http.delete(`${this.env.apiUrl}/api/questions/${_id}`,{
      headers: new HttpHeaders({
        'authorization': `Bearer ${this.auth.getToken()}`
      })
    })
  }

  getQuestionsInDB(currentPage:number, pageSize:number): Observable<any>{
    return this.http.get<any[]>(`${this.env.apiUrl}/api/questions`, {
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
