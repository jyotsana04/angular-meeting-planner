import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router'
import {ToastrService} from 'ngx-toastr'
import { UserHttpService } from '../user-http.service';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  public firstName:any;
  public lastName:any;
  public mobileNumber:any;
  public email: any;
  public password:any;
  public cpassword:any

  constructor(private userHttpService:UserHttpService, private router:Router, private toastr: ToastrService) { }

  ngOnInit() {
  }

  public goToSignIn: any=()=>{
    this.router.navigate(['/login'])
  }

  public signupFunction: any =()=>{

    if(!this.firstName){
      this.toastr.warning('enter first name');
    }else if (!this.lastName){
      this.toastr.warning('enter last name');
    }else if (!this.mobileNumber){
      this.toastr.warning('enter mobile no.');
    }else if (!this.email){
      this.toastr.warning('enter email');
    }else if (!this.password){
      this.toastr.warning('enter password');
    }else if (!this.cpassword){
      this.toastr.warning('enter confirm password');
    }
    else{
      let data = {
        firstName: this.firstName,
        lastName: this.lastName,
        mobileNumber: this.mobileNumber,
        email: this.email,
        password:this.password,
        confirmPassword: this.cpassword
      }

      console.log(data)

      this.userHttpService.signupFunction(data).subscribe(
        (apiResponse)=>{
          console.log(apiResponse);

          if(apiResponse.status == 200){
            this.toastr.success('SignUp successfull')

            setTimeout(()=>{
              this.goToSignIn()
            },2000)
          }else{
            this.toastr.error(apiResponse.message)
          }
        }, (err)=>{
          this.toastr.error('some error occured')
        }
      ) //end else condition
    } 
  }// end signup function

}
