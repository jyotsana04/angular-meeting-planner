import { Component, OnInit } from '@angular/core';
import { UserHttpService } from '../user-http.service';
import {SocketService} from '../socket.service'
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr'
import { Cookie } from 'ng2-cookies/ng2-cookies';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {

  public allUsers; //to hold list of all registered users

  //for socket service
  public authToken:any;
  public userInfo:any;
  public receiverId:any;
  public receiverName:any;
  public userList:any;
  public disconnectedSocket: boolean;

  constructor(private userHttpService:UserHttpService, private SocketService:SocketService,
    public router:Router, public toastr:ToastrService ) { 
      
    }

  ngOnInit() {

    this.authToken = Cookie.get('authToken')
      this.receiverId = Cookie.get('receiverId');
      this.receiverName = Cookie.get('receiverName');
    //console.log("authtoken admindash "+ this.authToken)
    // to get all users list 
    this.allUsers = this.userHttpService.getAllUsers(this.authToken).subscribe(

      (apiResponse)=>{
        if(apiResponse.status==200){
        //  console.log('loging data')
       // console.log(apiResponse)
        this.allUsers = apiResponse['data']
        }else{
          this.toastr.error(apiResponse.message)
        }
        
      },
      (error) =>{
        console.log('some error occured')
        console.log(error.errorMessage)
        this.toastr.warning(error.errorMessage)
      }
    ) //end all users list

    //for getting online user list
    //this.authToken = Cookie.get('authToken');
    this.userInfo = this.userHttpService.getUserInfoFromLocalStorage();
    //this.checkStatus();
    this.verifyUserConfirmation();
    this.getOnlineUserList()
  }
/*
  public checkStatus: any =()=>{
    if(Cookie.get('authToken')===undefined ||Cookie.get('authToken')===''|| Cookie.get('authToken')=== null){
      this.router.navigate(['/']);
      return false;
    }else{
      return true
    }
  }
*/
  public verifyUserConfirmation: any = ()=> {

    this.SocketService.verifyUser().subscribe((data)=> {

      this.disconnectedSocket = false;
      this.SocketService.setUser(this.authToken);
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
}
