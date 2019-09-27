import { Injectable } from '@angular/core';
import * as io from 'socket.io-client'
import {Observable} from 'rxjs'
import {Cookie} from 'ng2-cookies/ng2-cookies'
import {HttpClient, HttpHeaders, HttpErrorResponse, HttpParams} from '@angular/common/http'


@Injectable({
  providedIn: 'root'
})
export class SocketService {

  private url='http://localhost:3000';
  private socket;
  constructor(private http:HttpClient) { 
    this.socket = io(this.url); //connection is being created
  }

  //events to be listened

  public verifyUser = ()=>{
    return Observable.create((observer)=>{
      this.socket.on('verifyUser', (data)=>{ //since we are listening to this event we have to use observable
        observer.next(data);
      }) // end socket
    }) // end observable
  } // end verifyuser

  public onlineUserList = ()=>{
    console.log("socket service onlineuserlist 1")
    return Observable.create((observer)=>{
      this.socket.on('online-user-list', (userList)=>{
        observer.next(userList);
        console.log("socket service onlineuserlist 2")
      }) // end socket
    }) // end observable
  } // end onlineUserlist

  public disconnectedSocket = ()=> {
    return Observable.create((observer)=>{
      this.socket.on('disconnect', ()=>{
        console.log("user disconnected")
        observer.next()
      }) // end socket
    }) // end observable
  } // end disconnect socket

  //end events to be listened
  

  //events to be emited
  public setUser = (authToken)=> {
    this.socket.emit('set-user', authToken)
  } // end setUser

  public SendNotification = (notificationObj) => {

    console.log('inside service send notification')
    this.socket.emit('notify-msg', notificationObj );

  } 
  //end events to be emitted

  //my code
  public getNotificationService = (toUserId) => {
    console.log('inside getnotification userId is '+toUserId)

    return Observable.create((observer) => {
      
      this.socket.on(toUserId, (data) => {

        observer.next(data);
        console.log('socket.on '+data)
      }); // end Socket

    }); // end Observable

  } // end chatByUserId

  private handleError(err:HttpErrorResponse){

    let errorMessage = '';

    if(err.error instanceof Error){
      errorMessage = `an error occured: ${err.error.message}`
    }else {
      errorMessage = `Server returned code: ${err.status}, error message is ${err.message}`
    }

    console.error(errorMessage)

    return Observable.throw(errorMessage)
  }

}
