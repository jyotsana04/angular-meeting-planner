import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserHttpService } from '../user-http.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  public currentUser
  public password
  public cpassword

  constructor(private  router:Router, private _route:ActivatedRoute, private toastr: ToastrService,
    private userHttpService:UserHttpService) { }

  ngOnInit() {

    let myToken = this._route.snapshot.paramMap.get('token')
    console.log('my token is '+myToken)
    
    this.userHttpService.getUserDetailByToken(myToken).subscribe(
      data=>{
        console.log('printing data from resetpasswordcomponent'+data)
        this.currentUser = (data["data"])
        console.log(this.currentUser)
      },error=>{
        console.log('some error occured while fetching single user')
        console.log(error)
      }
    )
    
  }

  public resetPassword(){

    let data={
      userId:this.currentUser.userId,
      newPassword:this.password,
      verifyPassword:this.cpassword
    }
    
    this.userHttpService.setNewPassword(data).subscribe(
      data=>{
        console.log('done resetting')
        this.toastr.success('Password successfully reset')
        this.router.navigate(['/login'])
      }, error =>{
        console.log('error in resetting')
        this.toastr.error('Error in resetting')
      }
    )
  }


}
