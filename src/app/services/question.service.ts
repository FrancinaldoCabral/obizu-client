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

  cancelCreation(id:string): Observable<any> {
    return this.http.delete(`${this.env.apiUrl}/job/cancel/${id}`, {
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

  getOneQuestionInDB(_id: string): Observable<any>{
    return this.http.get(`${this.env.apiUrl}/api/questions/${_id}`, {
      headers: new HttpHeaders({
        'authorization': `Bearer ${this.auth.getToken()}`
      })
    })
  }

  getQuestionsInFailed(): Observable<any>{
    return this.http.get<any[]>(`${this.env.apiUrl}/api/get-json`, {
      headers: new HttpHeaders({
        'authorization': `Bearer ${this.auth.getToken()}`
      })
    })
  }

  getCousts(): Observable<any>{
    return this.http.get<any>(`${this.env.apiUrl}/api/cousts`, {
      headers: new HttpHeaders({
        'authorization': `Bearer ${this.auth.getToken()}`
      })
    })
  }

  getCategories(filters: string[]): Observable<any>{
    return this.http.post<any>(`${this.env.apiUrl}/api/categories`, { filters }, {
      headers: new HttpHeaders({
        'authorization': `Bearer ${this.auth.getToken()}`
      })
    })
  }

  getModules(currentPage:number, pageSize:number): Observable<any>{
    return this.http.get<any[]>(`${this.env.apiUrl}/api/modules`, {
      params: {
        page: currentPage.toString(),
        pageSize: pageSize.toString()
      },
      headers: new HttpHeaders({
        'authorization': `Bearer ${this.auth.getToken()}`
      })
    })
  }

  getOneModule(_id:any): Observable<any> {
    return this.http.get(`${this.env.apiUrl}/api/modules/${_id}`,{
      headers: new HttpHeaders({
        'authorization': `Bearer ${this.auth.getToken()}`
      })
    })
  }

  saveModule(newModule:any): Observable<any> {
    return this.http.post(`${this.env.apiUrl}/api/modules`, { newModule }, {
      headers: new HttpHeaders({
        'authorization': `Bearer ${this.auth.getToken()}`
      })
    })
  }

  deleteOneModule(_id:any): Observable<any> {
    return this.http.delete(`${this.env.apiUrl}/api/modules/${_id}`,{
      headers: new HttpHeaders({
        'authorization': `Bearer ${this.auth.getToken()}`
      })
    })
  }

  updateOneModule(module:any): Observable<any> {
    return this.http.put(`${this.env.apiUrl}/api/modules`, module, {
      headers: new HttpHeaders({
        'authorization': `Bearer ${this.auth.getToken()}`
      })
    })
  }

  randomQuestions(filters:string[]): Observable<any> {
    return this.http.post(`${this.env.apiUrl}/api/random`, { filters }, {
      headers: new HttpHeaders({
        'authorization': `Bearer ${this.auth.getToken()}`
      })
    })
  }

  respond(questionId:string, response:number): Observable<any> {
    const createdAt = new Date()
    return this.http.post(`${this.env.apiUrl}/api/respond`, { questionId, response, createdAt }, {
      headers: new HttpHeaders({
        'authorization': `Bearer ${this.auth.getToken()}`
      })
    })
  }

  usersResponses(filters:string[]): Observable<any> {
    return this.http.post(`${this.env.apiUrl}/api/responses`, { filters }, {
      headers: new HttpHeaders({
        'authorization': `Bearer ${this.auth.getToken()}`
      })
    })
  }

  sinalizeProblem(comment:string, questionId:string): Observable<any> {
    const form = { comment, questionId, createdAt: new Date() }
    return this.http.post(`${this.env.apiUrl}/api/sinalize`, form, {
      headers: new HttpHeaders({
        'authorization': `Bearer ${this.auth.getToken()}`
      })
    })
  }

  getProblems(currentPage:number, pageSize:number): Observable<any> {
    return this.http.get<any[]>(`${this.env.apiUrl}/api/sinalize`, {
      params: {
        page: currentPage.toString(),
        pageSize: pageSize.toString()
      },
      headers: new HttpHeaders({
        'authorization': `Bearer ${this.auth.getToken()}`
      })
    })
  }

  removeProblem(_id:any): Observable<any> {
    return this.http.delete(`${this.env.apiUrl}/api/sinalize/${_id}`,{
      headers: new HttpHeaders({
        'authorization': `Bearer ${this.auth.getToken()}`
      })
    })
  }

  addComment(comment:string, questionId:string): Observable<any> {
    const form = { comment, questionId, createdAt: new Date() }
    return this.http.post(`${this.env.apiUrl}/api/discussion`, form, {
      headers: new HttpHeaders({
        'authorization': `Bearer ${this.auth.getToken()}`
      })
    })
  }

  getComments(currentPage:number, pageSize:number, questionId:string): Observable<any> {
    return this.http.get<any[]>(`${this.env.apiUrl}/api/discussion`, {
      params: {
        page: currentPage.toString(),
        pageSize: pageSize.toString(),
        questionId
      },
      headers: new HttpHeaders({
        'authorization': `Bearer ${this.auth.getToken()}`
      })
    })
  }

  removeComment(_id:any): Observable<any> {
    return this.http.delete(`${this.env.apiUrl}/api/discussion/${_id}`,{
      headers: new HttpHeaders({
        'authorization': `Bearer ${this.auth.getToken()}`
      })
    })
  }
}
