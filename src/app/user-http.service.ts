import { Injectable } from '@angular/core';
import{HttpClient, HttpClientModule,HttpErrorResponse, HttpParams} from '@angular/common/http'
import {Observable, BehaviorSubject} from 'rxjs'
import {Cookie} from 'ng2-cookies/ng2-cookies'

@Injectable({
  providedIn: 'root'
})
export class UserHttpService {

  public currentUser
  public allUsers
  public baseUrl = 'http://localhost:3000/api/v1/users'
  //public authToken = Cookie.get('authToken')

  constructor(private http:HttpClient) {
    console.log('service constructor')
   }

  public getAllUsers(myauthToken): Observable<any> {

    console.log("authtoken inside getallusers in user service is "+ myauthToken)
    let myresponse =  this.http.get(`${this.baseUrl}/allUsers?authToken=${myauthToken}`);
    return myresponse

  }
  


  public getUserInfoFromLocalStorage=()=>{
    return JSON.parse(localStorage.getItem('userInfo'))
  }

  public setUserInfoInLocalStorage=(data)=>{
    localStorage.setItem('userInfo', JSON.stringify(data))
  }

  public signupFunction(data): Observable<any>{

    const  params= new HttpParams()
      .set('firstName', data.firstName)
      .set('lastName', data.lastName)
      .set('mobileNumber', data.mobileNumber)
      .set('email', data.email)
      .set('password', data.password)
      .set('confirmPassword', data.confirmPassword)
      

      return this.http.post(`${this.baseUrl}/signup`, params)
  } // end of signup func


/* moved to authservice
  public loginFunction(data):Observable<any>{

    const params= new HttpParams()
      .set('email', data.email)
      .set('password', data.password)

      return this.http.post(`${this.baseUrl}/login`, params)
      this.loggedIn.next(true);

  }//end login

  public logout(): Observable<any> {

    const params = new HttpParams()
      .set('authToken', Cookie.get('authtoken'))

    return this.http.post(`${this.baseUrl}/logout`, params);
    this.loggedIn.next(false);

  } // end logout function
*/


  public forgotPassword(email): Observable<any>{
    console.log('sending request for password tokrn for email' + email)
    const params = new HttpParams()
      .set('email', email)

      return this.http.post(`${this.baseUrl}/recoverPassword`, params)
  }

  public getUserDetailByToken(currentToken){
     
    console.log('current token  is '+currentToken)
    let myresponse = this.http.get(`${this.baseUrl}/findForReset/${currentToken}`)
    console.log('service response getuserbytoken' + myresponse)
    return myresponse
        
  } 

  public setNewPassword(data){
    console.log('user id whose password reseting is '+data.userId)
    const params = new HttpParams()
      .set('userId', data.userId)
      .set('newPassword', data.newPassword)
      .set('verifyPassword', data.verifyPassword)
    
    return this.http.post(`${this.baseUrl}/setNewPassword`, params)
  }
}
