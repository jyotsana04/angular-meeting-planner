import { Component, OnInit, ChangeDetectionStrategy, ViewChild, TemplateRef } from '@angular/core';
import { startOfDay, endOfDay, subDays, addDays, endOfMonth, isSameDay, isSameMonth, addHours } from 'date-fns'
import { Subject } from 'rxjs'
import { CalendarEvent, CalendarEventAction, CalendarView } from 'angular-calendar'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { ToastrService } from 'ngx-toastr'
import { EventService } from '../event.service';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { ActivatedRoute, Router } from '@angular/router';
import { someEvent } from './../myInterface'
import { SocketService } from '../socket.service'
import { UserHttpService } from '../user-http.service';

@Component({
  selector: 'app-event2',
  templateUrl: './event2.component.html',
  styleUrls: ['./event2.component.css']
})
export class Event2Component implements OnInit {

  @ViewChild('addmodal', { static: true }) addmodal: TemplateRef<any>;
  @ViewChild('vieweditmodal', { static: true }) vieweditmodal: TemplateRef<any>;

  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  viewDate: Date = new Date();
  activeDayIsOpen: boolean = true;
  modalData: {
    action: string;
    event: CalendarEvent;
  };

  refresh: Subject<any> = new Subject();

  events: someEvent[] = []
  items: someEvent[] = [];
  tempObj = []



  public title: any;
  public location: any;
  public start: any;
  public end: any;
  public description: any;

  public authToken
  public notifyTxt: any
  public userList: any;
  public userInfo: any;
  public disconnectedSocket: boolean;

  public myuserId = this._route.snapshot.paramMap.get('userId');

  date: Date = new Date();
  settings = {
    bigBanner: true,
    timePicker: true,
    format: 'dd-MM-yyyy hh:mm a',
    defaultOpen: false,
    closeOnSelect: true
  }

  constructor(private toastr: ToastrService, private eventService: EventService, private modal: NgbModal, private router: Router, private userHttpService: UserHttpService, private _route: ActivatedRoute, private SocketService: SocketService) { }

  ngOnInit() {
    //code for fetching events from DB
    this.authToken = Cookie.get('authToken')

    this.eventService.getEvents(this.myuserId, this.authToken).subscribe(data => {
      for (let i = 0; i < data["data"].length; i++) {
        this.items.push(
          {
            title: data["data"][i].title,
            start: new Date(data["data"][i].start),
            end: new Date(data["data"][i].end),
            color: { primary: '#e3bc08', secondary: '#FDF1BA' },
            meetingId: data["data"][i].meetingId,
            description: data["data"][i].description
          });

        this.events = this.items;
        this.refresh.next()
      }
    })// end code for fetching

    this.userInfo = this.userHttpService.getUserInfoFromLocalStorage();
    this.verifyUserConfirmation();
    this.getOnlineUserList()
  }

  // event add function
  public eventFunction: any = () => {

    if (!this.title) {
      this.toastr.warning('enter title');
    } else if (!this.location) {
      this.toastr.warning('enter location');
    } else if (!this.start) {
      this.toastr.warning('enter start date');
    } else if (!this.end) {
      this.toastr.warning('enter end date');
    } else if (!this.description) {
      this.toastr.warning('enterdescription');
    }
    else {
      let data = {
        title: this.title,
        location: this.location,
        start: this.start,
        end: this.end,
        description: this.description,

      }

      this.eventService.addEvent(this.myuserId, data).subscribe(
        (apiResponse) => {
          if (apiResponse['status'] == 200) {
            this.toastr.success('Event added successfully')
            this.modal.dismissAll()
            this.notifyTxt = "A new meeting is assigned to you"
            this.sendNotification()
            this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
              this.router.navigate([`/event2/${this.myuserId}`]));
          } else {
            this.toastr.error(apiResponse['message'])
          }
        }, (err) => {
          this.toastr.error('some error occured')
        }
      )

    } //end else condition
  }// end addeventfunction

  openaddmodal() {
    this.modal.open(this.addmodal, { size: 'lg', backdrop: 'static' });
  }

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
  setView(view: CalendarView) {
    this.view = view;
  }
  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

  eventDetails: any
  handleEvent(action: string, event: CalendarEvent): void {

    let currentMeetId = event["meetingId"]
    console.log('current meeting id is ' + currentMeetId)
    this.eventService.getSingleEvent(currentMeetId, this.authToken).subscribe(
      data => {
        this.eventDetails = data["data"]
        this.modal.open(this.vieweditmodal, { size: 'lg', backdrop: 'static' });

      }
    )
  }

  // for editing event
  public eventEditFunction() {
    this.eventService.editEvent(this.eventDetails.meetingId, this.eventDetails).subscribe(

      data => {
        this.toastr.success('event edited successfully')
        this.modal.dismissAll()
        this.notifyTxt = "A meeting assigned to you is updated"
        this.sendNotification()
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
          this.router.navigate([`/event2/${this.myuserId}`]));
      },
      error => {
        console.log(error.errorMessage);
        this.toastr.error(error.errorMessage)
      }
    )
  }

  //for deleting event
  public deleteEventFunction() {
    this.eventService.deleteEvent(this.eventDetails.meetingId).subscribe(
      data => {
        console.log("event deleted successfully");
        this.toastr.warning('event deleted successfully')
        this.modal.dismissAll()
        this.notifyTxt = "A meeting assigned to you is deleted"
        this.sendNotification()
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
          this.router.navigate([`/event2/${this.myuserId}`]));
      },
      error => {
        console.log(error.errorMessage);
        this.toastr.error(error.errorMessage)
      }

    )
  }

  public verifyUserConfirmation: any = () => {

    this.SocketService.verifyUser().subscribe((data) => {
      this.disconnectedSocket = false;
      this.SocketService.setUser(this.authToken);
      this.getOnlineUserList()
    })
  }

  public getOnlineUserList: any = () => {
    console.log('calling userlist1')
    this.SocketService.onlineUserList().subscribe((userList) => {
      this.userList = [];
      for (let x in userList) {
        let temp = { 'userId': x, 'name': userList[x] }
        this.userList.push(temp);
      }
      console.log('calling userlist2')
      console.log(this.userList)
    })
  }

  public sendNotification: any = () => {
    let notificationObj = {
      toUserId: this.myuserId,
      notifyTxt: this.notifyTxt
    }
    this.SocketService.SendNotification(notificationObj)

  } // end sendMessage

}
