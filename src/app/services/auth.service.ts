import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { EnvironmentService } from './environment.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private authenticate = new BehaviorSubject<boolean>(false)
  user: any = null
  lembrarMe: boolean = false

  constructor(
    private http: HttpClient,
    private env: EnvironmentService
  ) { }

  changeLembrarMe(): void {
    this.lembrarMe = !this.lembrarMe
  }

  setLembrarMe(lembreMe: boolean): void {
    this.lembrarMe = lembreMe
  }

  getLembrarMe(): boolean {
    return this.lembrarMe
  }

  lembreMeAqui(): void {
    if(this.lembrarMe){
      window.localStorage.setItem('user', JSON.stringify(this.user))
    }
  }

  setUser(user: any): void {
    this.user = user
    this.lembreMeAqui()
  }

  getUser(): any {
    return this.user
  }

  getAuthenticate(): boolean {
    return this.authenticate.getValue()
  }

  getAuthenticateAsObservable(): Observable<boolean>{
    return this.authenticate.asObservable()
  }

  setAuthenticate(authenticate: boolean): void {
    this.authenticate.next(authenticate)
  }

  getToken(): string {
    return this.user?.token
  }

  async fetchUser(): Promise<boolean> {
    return new Promise((resolve, rejects)=>{
      const storageUser = window.localStorage.getItem('user') || ''
      let user: any = null
      if(storageUser) user = JSON.parse(storageUser)
      if(user){
        console.log('user: ', user)
        this.isValidate(user?.token).subscribe(
          success => {
            console.log('is validate result: ', success)
            if(success.code === 'jwt_auth_valid_token'){
              this.me(user?.token).subscribe(
                userUpdate => {
                  //console.log(userUpdate)
                  userUpdate.token = user?.token
                  this.setUser(userUpdate)
                  this.setAuthenticate(true)
                  resolve(true)
                },
                error => {
                  console.log(error)
                  rejects(false)
                }
              )
            }else{
              rejects(false)
            }
          },
          error => {
            console.log('is validate error: ', error)
            rejects(false)
          }
        )
      }else{
        console.log('storage: ', storageUser)
        rejects(false)
      }
    })
  }

  login(): void {
    document.getElementById('login_button')?.click()
  }

  logout(): void {
    this.user = null
    this.authenticate.next(false)
    window.localStorage.clear()
    //this.router.navigate(['login'])
    window.location.href = `${this.env.wpUrl}/wp-json/api/v1/logout`
    this.login()
  }

  isValidate(token: string): Observable<any> {
    return this.http.post(`${this.env.wpUrl}/wp-json/jwt-auth/v1/token/validate`, {}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  }

  me(token: string): Observable<any> {
    return this.http.get(`${this.env.wpUrl}/wp-json/api/v1/me`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  }

  getSubscription(token: string): Observable<any>{
    return this.http.get(`${this.env.wpUrl}/wp-json/api/v1/subscription`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  }
}


/* {"token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL3JlZGF0dWRvLm9ubGluZSIsImlhdCI6MTY4NjA4Mjc2MSwibmJmIjoxNjg2MDgyNzYxLCJleHAiOjE2ODY2ODc1NjEsImRhdGEiOnsidXNlciI6eyJpZCI6IjEifSwiaWQiOiIxIiwidXNlcl9kaXNwbGF5X25hbWUiOm51bGwsInVzZXJfcmVnaXN0ZXJlZCI6IjIwMjEtMTAtMDEgMjE6NDU6MjciLCJlbWFpbCI6Im5hbGRvX3JuQGhvdG1haWwuY29tIiwicm9sZSI6ImFkbWluaXN0cmF0b3IiLCJzdWJzY3JpcHRpb24iOnsiaWQiOm51bGwsInN0YXR1cyI6bnVsbH19fQ.zy-6aQWjNBXQoP_ZuYB0kHdJPhPijupJnQC-0bMlLio"} */