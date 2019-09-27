import { Injectable } from '@angular/core';
import{HttpClient, HttpClientModule,HttpErrorResponse, HttpParams} from '@angular/common/http'
import {Observable, BehaviorSubject} from 'rxjs'
import {Cookie} from 'ng2-cookies/ng2-cookies'
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public baseUrl = 'http://localhost:3000/api/v1/users'

  public authToken = Cookie.get('authToken')
  private loginStatus = new BehaviorSubject<boolean>(this.checkLoginStatus())

  constructor(private http:HttpClient, private router:Router) { }

  

  public loginFunction(data):Observable<any>{
    this.loginStatus.next(true)
    const params= new HttpParams()
      .set('email', data.email)
      .set('password', data.password)

      return this.http.post(`${this.baseUrl}/login`, params) 

  }//end login

  public logout(): Observable<any> {

    console.log('loginstatus from logout')
    this.loginStatus.next(false)
    const params = new HttpParams()
      .set('authToken', Cookie.get('authToken'))

    return this.http.post(`${this.baseUrl}/logout`, params);
    

  } // end logout function

  checkLoginStatus():boolean{
    return false
  }

  get isLoggedIn(){
    return this.loginStatus.asObservable()
  }
}
