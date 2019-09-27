import { Component, OnInit } from '@angular/core';
import { UserHttpService } from '../user-http.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  public userEmail

  constructor(private userHttpService:UserHttpService, private router:Router, private toastr:ToastrService) { }

  ngOnInit() {
  }

  public sendForgotToken(){
 
    let email=this.userEmail;

    this.userHttpService.forgotPassword(email).subscribe((apiResponse)=>{

      if(apiResponse.status==200){
        this.toastr.info('Please check your registered mail for password reset options')
        
      }else{
        this.toastr.error(apiResponse.message)
      }
    },
    (err)=>{
      console.log(err)
      this.toastr.error('User Not Found, Signup'+err)
    }
    )
    

  }

}
