import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import {Cookie} from 'ng2-cookies/ng2-cookies'
import { Router } from '@angular/router';
import { UserHttpService } from '../user-http.service';
import { AuthService } from '../auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public email
  public password
  public authToken = Cookie.get('authToken')
  public receiverId = Cookie.get('receiverId')
  public receiverName = Cookie.get('receiverName')
  constructor(private authService:AuthService ,private userHttpService:UserHttpService, public toastr:ToastrService, public router:Router) { }

  ngOnInit() {
    if(this.authToken!=null || this.receiverId!= null || this.receiverName !=null){
      this.toastr.warning("User is already logged in, logout first")
      
    }
  }

  public loginFunction: any =()=>{

    if(this.authToken!=null || this.receiverId!= null || this.receiverName !=null){
      
      this.authService.logout()
      .subscribe((apiResponse) => {

        if (apiResponse.status === 200) {
          console.log("logout called")
          Cookie.delete('authToken');
          Cookie.delete('receiverId');
          Cookie.delete('receiverName');
          //this.SocketService.exitSocket()
          this.toastr.warning("Previous user was logged out")
        } else {
          this.toastr.error(apiResponse.message)
        } // end condition
      }, (err) => {
        this.toastr.error('some error occured')
      });

    }
    
    let data = {
      email: this.email,
      password: this.password
    }

    this.authService.loginFunction(data).subscribe((apiResponse)=>{

      if(apiResponse.status == 200){
        console.log(apiResponse)
        this.toastr.success(apiResponse.message)
        Cookie.set('authToken', apiResponse.data.authToken);
            
        Cookie.set('receiverId', apiResponse.data.userDetails.userId);
            
        Cookie.set('receiverName', apiResponse.data.userDetails.firstName + ' ' + apiResponse.data.userDetails.lastName);
        Cookie.set('userName', apiResponse.data.userDetails.userName);
        this.userHttpService.setUserInfoInLocalStorage(apiResponse.data.userDetails)
         
        let username = Cookie.get('userName')
        let temp = username.split('-')
        if(temp[1]=="admin"){
        
          this.router.navigate(['/dashboard'])
          
        } else{
          this.router.navigate(['/calender']);
        } 
        
        
      }else {

        this.toastr.error(apiResponse.message)
        this.toastr.error('cant login')
        console.log('wrong password')
      }

    },(err)=>{
      this.toastr.error(err.error)
    })
  }

}
