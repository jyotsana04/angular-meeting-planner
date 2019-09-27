import { Component, OnInit, ChangeDetectionStrategy, ViewChild, TemplateRef } from '@angular/core';
import {startOfDay, endOfDay, subDays, addDays, subHours ,endOfMonth, isSameDay, isSameMonth, addHours} from 'date-fns'
import {Subject} from 'rxjs'
import {someEvent} from './../myInterface'
import {NgbModal} from '@ng-bootstrap/ng-bootstrap'
import {CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent, CalendarView} from 'angular-calendar'
import { EventService } from '../event.service';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { UserHttpService } from '../user-http.service';
import { SocketService } from '../socket.service';
import * as moment from 'moment';


@Component({
  selector: 'app-view-calender',
  //changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './view-calender.component.html',
  styleUrls: ['./view-calender.component.css']
})
export class ViewCalenderComponent implements OnInit {

  

  @ViewChild('modaldetails', { static: true }) modaldetails: TemplateRef<any>;

  view: CalendarView = CalendarView.Month;

  CalendarView = CalendarView;

  viewDate: Date = new Date();
  
  
  modalData: {
    action: string;
    event: CalendarEvent;
  };

  refresh: Subject<any> = new Subject();

  events:someEvent[]=[]

  activeDayIsOpen: boolean = true;

  tempObj=[]
  items: someEvent[]=[]
  constructor(private modal: NgbModal, private SocketService:SocketService, private eventService:EventService, private userHttpService:UserHttpService , public toastr:ToastrService, public router:Router) { }

  public myuserId = Cookie.get('receiverId')
  public myauthToken = Cookie.get('authToken')
 
  public userInfo:any;
 
  public receiverName:any;
  public userList:any;
  public disconnectedSocket: boolean;

  ngOnInit() {
    //code for fetching events from DB
    

    console.log('inside view calendar component user id is '+ this.myuserId)
    console.log('inside view calendar component authtoken is '+ this.myauthToken)

    if(this.myuserId===''|| this.myuserId==='undefined'|| this.myuserId==='null'){
      this.toastr.error("user Id not found, Kindly log in")
      setTimeout(()=>{
        this.router.navigate(['/login']);
      },1000)
    }else if(this.myauthToken===''|| this.myauthToken==='undefined'|| this.myauthToken==='null'){
      console.log("else if called for mytoken")
      this.toastr.error("Auth token invalid, Kindly log in")
      setTimeout(()=>{
        this.router.navigate(['/login']);
      },1000)
    }
    else{
        this.eventService.getEvents(this.myuserId, this.myauthToken).subscribe(data=>{
          for(let i=0; i<data["data"].length; i++) {
            this.items.push(
              {
              title: data["data"][i].title,
              start: new Date(data["data"][i].start),
              end: new Date(data["data"][i].end),
              color: {primary: '#e3bc08', secondary: '#FDF1BA'},
              meetingId: data["data"][i].meetingId,
              description: data["data"][i].description
              });
      
              this.events = this.items;
              this.refresh.next()
              
              
              
          }
          this.toastr.success("events fetched successfully")
        })// end code for fetching  
    }//end of else

    //for getting online user list
    
    this.userInfo = this.userHttpService.getUserInfoFromLocalStorage();
    this.checkStatus();
    this.verifyUserConfirmation();
    this.getOnlineUserList()
  } //end of nginit

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      console.log('date1'+ date)
      console.log('date2'+ this.viewDate)
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
      console.log('date3'+ this.viewDate)
    }
  }

  

//my event handler
eventDetails:any
handleEvent(action: string, event: CalendarEvent): void {
  
  let currentMeetId = event["meetingId"]
 console.log('current meeting id is '+currentMeetId)
 this.eventService.getSingleEvent(currentMeetId,this.myauthToken ).subscribe(
   data=>{
     console.log(data)
     
    this.eventDetails=data["data"]
  this.modal.open(this.modaldetails, { size: 'lg' });
  
   }
 )
}


  setView(view: CalendarView) {
    this.view = view;
  }
  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

  public checkStatus: any =()=>{
    if(Cookie.get('authToken')===undefined ||Cookie.get('authToken')===''|| Cookie.get('authToken')=== null){
      this.router.navigate(['/']);
      return false;
    }else{
      return true
    }
  }

  public verifyUserConfirmation: any = ()=> {

    this.SocketService.verifyUser().subscribe((data)=> {

      this.disconnectedSocket = false;
      this.SocketService.setUser(this.myauthToken);
      this.getOnlineUserList()
    })
  }

  public getOnlineUserList:any = ()=>{
    console.log('calling userlist1')
    this.SocketService.onlineUserList().subscribe((userList)=>{

      this.userList = [];
     
      for (let x in userList){

        let temp = {'userId': x, 'name':userList[x]} 

        this.userList.push(temp);
      }
      console.log('calling userlist2')
      console.log(this.userList)
    })
  }

  //my listening code for notification
  public getNotification:any =()=>{
    console.log('getnotification called')
    this.SocketService.getNotificationService(this.myuserId).subscribe((data)=>{
      this.toastr.success('notification received')
      this.toastr.success(data.notifyTxt)
      console.log('received notification '+ data.notifyTxt)
    })
  }
  /*
  socket.on(userId, (data)=>{
    //console.log('you received a msg from' + data.senderName)
    console.log(data.notifyTxt)
  })

  public getMessageFromAUser :any =()=>{

      this.SocketService.chatByUserId(this.userInfo.userId)
      .subscribe((data)=>{
       

        (this.receiverId==data.senderId)?this.messageList.push(data):'';

        this.toastr.success(`${data.senderName} says : ${data.message}`)

        this.scrollToChatTop=false;

      });//end subscribe

  }// end get message from a user 

  */
}



