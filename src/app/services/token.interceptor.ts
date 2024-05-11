import { HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest, HttpErrorResponse} from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, tap } from 'rxjs'
import { AuthService } from './auth.service'

 
@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    constructor(private auth: AuthService){}
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
       // All HTTP requests are going to go through this method
        if(this.auth.getUser() 
            && this.auth.getToken() 
            && req.url.indexOf('redatudo.online') > 0){
            const authReq = req.clone({
                headers: new HttpHeaders({
                'authorization': `Bearer ${this.auth.getToken()}`
                })
            })
            return next.handle(authReq)
        }else if(this.auth.getUser() && this.auth.getToken() && req.url.indexOf('hidden-crag-82241.herokuapp.com') > 0){
            const authReq = req.clone({
                headers: new HttpHeaders({
                'authorization': `Bearer ${this.auth.getToken()}`
                })
            })
            return next.handle(authReq)
        }else if(this.auth.getUser() && this.auth.getToken() && req.url.indexOf('csss4w0.209.145.57.84.sslip.io') > 0){
            const authReq = req.clone({
                headers: new HttpHeaders({
                'authorization': `Bearer ${this.auth.getToken()}`
                })
            })
            return next.handle(authReq)
        }else if(this.auth.getUser() && this.auth.getToken() && req.url.indexOf('localhost:5000') > 0){
            const authReq = req.clone({
                headers: new HttpHeaders({
                'authorization': `Bearer ${this.auth.getToken()}`
                })
            })
            return next.handle(authReq)
        }

        return next.handle(req).pipe( tap(() => {}, (err: any) => {
        if (err instanceof HttpErrorResponse) {
          if (err.status !== 401) {
           return
          }
          this.auth.login()
        }
      }))
    }
}