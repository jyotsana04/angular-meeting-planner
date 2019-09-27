import { Component, OnInit,ChangeDetectionStrategy, ViewChild, TemplateRef } from '@angular/core';
import {startOfDay, endOfDay, subDays, addDays, endOfMonth, isSameDay, isSameMonth, addHours} from 'date-fns'
import {Subject} from 'rxjs'
import {CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent, CalendarView} from 'angular-calendar'
import {NgbModal} from '@ng-bootstrap/ng-bootstrap'
import {ToastrService} from 'ngx-toastr'
import { EventService } from '../event.service';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import {ActivatedRoute, Router } from '@angular/router';
import {someEvent} from './../myInterface'
import {SocketService} from '../socket.service'

@Component({
  selector: 'app-event2',
  changeDetection: ChangeDetectionStrategy.Default,
  templateUrl: './event2.component.html',
  styleUrls: ['./event2.component.css']
})
export class Event2Component implements OnInit {

  @ViewChild('modaldetails', { static: true }) modaldetails: TemplateRef<any>;
  @ViewChild('vieweditmodal', { static: true }) vieweditmodal: TemplateRef<any>;

  view: CalendarView = CalendarView.Month;

  CalendarView = CalendarView;

  viewDate: Date = new Date();

  modalData: {
    action: string;
    event: CalendarEvent;
  };

  actions: CalendarEventAction[] = [
    
    {
      label: '<i class="fa fa-fw fa-pencil"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      }
    },
    {
      label: '<i class="fa fa-fw fa-times"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter(iEvent => iEvent !== event);
        this.handleEvent('Deleted', event);
      }
    }
  ];

  refresh: Subject<any> = new Subject();

  //events:CalendarEvent[]=[]

  events:someEvent[]=[]
  activeDayIsOpen: boolean = true;

  tempObj=[]
  //items: Array<CalendarEvent<{ time: any }>> = [];
  items: someEvent[] = [];

  // code for add event
  public title:any;
  public location:any;
  public start:any;
  public end: any;
  public description:any;

  date: Date = new Date();
  settings = {
    bigBanner:true,
    timePicker:true,
    format:'dd-MM-yyyy hh:mm a',
    defaultOpen:false,
    closeOnSelect: true
  }
// end code for add form

public notifyTxt:any

  constructor(private toastr: ToastrService, private eventService:EventService, 
    private modal: NgbModal, private router:Router, private _route:ActivatedRoute, private SocketService:SocketService) { }


    public myuserId = this._route.snapshot.paramMap.get('userId');
    public authToken = Cookie.get('authToken')
  ngOnInit() {
    //code for fetching events from DB
    
    console.log('calling event calendar for userId '+ this.myuserId)

    this.eventService.getEvents(this.myuserId, this.authToken).subscribe(data=>{
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
      //console.log(this.events)
    }
    })// end code for fetching
  }

// event add function
  public eventFunction: any =()=>{

    if(!this.title){
      this.toastr.warning('enter title');
    }else if (!this.location){
      this.toastr.warning('enter location');
    }else if (!this.start){
      this.toastr.warning('enter start date');
    }else if (!this.end){
      this.toastr.warning('enter end date');
    }else if (!this.description){
      this.toastr.warning('enterdescription');
    }
    else{
      let data = {
        title: this.title,
        location: this.location,
        start: this.start,
        end: this.end,
        description:this.description,
        
      }
      //console.log("calling event function for user id "+ this.myuserId)
     // console.log(data)

      this.eventService.addEvent(this.myuserId,data).subscribe(
        (apiResponse)=>{
          console.log(apiResponse);
          console.log("eventservice.addevent "+ this.myuserId)
          if(apiResponse['status'] == 200){
            this.toastr.success('Event added successfully')
            this.notifyTxt = "A new meeting is assigned to you"
            this.sendNotification()
            setTimeout(()=>{
              this.router.navigate(['/event2/'+this.myuserId])
            },1000)
            
          }else{
            this.toastr.error(apiResponse['message'])
          }
        }, (err)=>{
          this.toastr.error('some error occured')
        }
      ) 
      
    } //end else condition
  }// end addeventfunction

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  //my event handler
  eventDetails:any
  handleEvent(action: string, event: CalendarEvent): void {
    
  let currentMeetId = event["meetingId"]
   console.log('current meeting id is '+currentMeetId)
   this.eventService.getSingleEvent(currentMeetId, this.authToken).subscribe(
     data=>{
      // console.log(data)
       
      this.eventDetails=data["data"]
    this.modal.open(this.vieweditmodal, { size: 'lg', backdrop: 'static' });
    
     }
   )
  }

  // for editing event
  public eventEditFunction(){
    this.eventService.editEvent(this.eventDetails.meetingId, this.eventDetails).subscribe(

      data=>{
       // console.log("event edited successfullly");
        this.toastr.success('event edited successfully')
        this.notifyTxt = "A meeting assigned to you is updated"
        this.sendNotification()
        this.refresh.next()

        
        /*
        setTimeout(()=>{
          this.router.navigate(['/event2'])
        }, 1000)
        */
      }, 
      error=>{
       // console.log("some error occcured in editing")
        console.log(error.errorMessage);
        this.toastr.error(error.errorMessage)
      }
    )
  }

  //for deleting event
  public deleteEventFunction(){
    this.eventService.deleteEvent(this.eventDetails.meetingId).subscribe(
      data=>{
      //  console.log(data);
        console.log("event deleted successfully");
        this.toastr.warning('event deleted successfully')
        this.notifyTxt = "A meeting assigned to you is deleted"
        this.sendNotification()
        this.refresh.next()
      /*
        setTimeout(()=>{
          this.router.navigate(['/event2'])
        },1000)
        */
      },
      error=>{
      //  console.log("could not delete");
        console.log(error.errorMessage);
        this.toastr.error(error.errorMessage)
        

      }

    )
  }


  setView(view: CalendarView) {
    this.view = view;
  }
  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

  //public notificationObj:any
  

  public sendNotification: any = () => {
 
    let notificationObj={
      toUserId: this.myuserId,
      notifyTxt: this.notifyTxt
    }
      this.SocketService.SendNotification(notificationObj)

  } // end sendMessage

}
