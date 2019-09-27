import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import{HttpClient, HttpClientModule,HttpErrorResponse, HttpParams} from '@angular/common/http'
import {Cookie} from 'ng2-cookies/ng2-cookies'

@Injectable({
  providedIn: 'root'
})
export class EventService {

  public baseUrl = 'http://localhost:3000/api/v1/meeting'
  public authToken = Cookie.get('authToken')


  constructor(private http:HttpClient) { }

  public getEvents(myuserId, myauthToken){

    let myresponse = this.http.get(`${this.baseUrl}/viewAllByUserId/${myuserId}?authToken=${myauthToken}`)
    return myresponse
  }

  public getSingleEvent(meetingId,myauthToken){
    console.log('meeting id is '+ meetingId)
    let myresponse = this.http.get(`${this.baseUrl}/viewSingleMeeting/${meetingId}?authToken=${myauthToken}`)
    return myresponse
  }

  public addEvent(myuserId,data){
    console.log('receiver id is '+ myuserId)
    console.log("from addevent in event service")
    const  params= new HttpParams()
      .set('title', data.title)
      .set('location', data.location)
      .set('start', data.start)
      .set('end', data.end)
      .set('description', data.description)

    let myresponse = this.http.post(`${this.baseUrl}/create/${myuserId}?authToken=${this.authToken}`, params)
    return myresponse
  }

  public editEvent(currentMeetingId, meetingData){
    console.log('editing event with id '+ currentMeetingId)

    return this.http.put(`${this.baseUrl}/edit/${currentMeetingId}?authToken=${this.authToken}`,meetingData )
  }

  public deleteEvent(currentMeetingId){
    
    let data ={}

    return this.http.post(`${this.baseUrl}/delete/${currentMeetingId}?authToken=${this.authToken}`, data)
  }
}
