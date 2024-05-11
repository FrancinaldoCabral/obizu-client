import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import env from './env'
import { LanguageService } from './language.service'
import { ModelService } from './llm.service'

@Injectable({
  providedIn: 'root'
})
export class ChatService {
    constructor(private http: HttpClient, private languageService: LanguageService, 
      private modelService: ModelService){}
    sendMessage(messages: any[]): Observable<any>{
        return this.http.post(`${env.apiHost}/chat?systemLlmModel=${this.modelService.getActualModel()}&language=${this.languageService.getCurrentLanguage()}&time=${new Date()}`, messages)
    }

    welcomeMessage(): Observable<any>{
      return this.http.get(`${env.apiHost}/welcome?language=${this.languageService.getCurrentLanguage()}&time=${new Date()}`)
    }
}