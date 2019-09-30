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

  constructor(private router: Router, private _route: ActivatedRoute, private toastr: ToastrService,
    private userHttpService: UserHttpService) { }

  ngOnInit() {

    let myToken = this._route.snapshot.paramMap.get('token')

    this.userHttpService.getUserDetailByToken(myToken).subscribe(
      data => {
        this.currentUser = (data["data"])
      }, error => {
        console.log(error)
        this.toastr.error(error)
      }
    )

  }

  public resetPassword() {

    let data = {
      userId: this.currentUser.userId,
      newPassword: this.password,
      verifyPassword: this.cpassword
    }

    this.userHttpService.setNewPassword(data).subscribe(
      data => {
        this.toastr.success('Password successfully reset')
        this.router.navigate(['/login'])
      }, error => {
        console.log('error in resetting')
        this.toastr.error('Error in resetting')
      }
    )
  }


}
