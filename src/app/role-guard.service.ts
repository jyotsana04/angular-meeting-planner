import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, Router} from '@angular/router'
import {Cookie} from 'ng2-cookies/ng2-cookies'
import {ToastrService} from 'ngx-toastr'


@Injectable({
  providedIn: 'root'
})
export class RoleGuardService {

  
  constructor(private router:Router, private toastr:ToastrService) { }

  canActivate(route:ActivatedRouteSnapshot):boolean{

    console.log('in role guard service')
    
    
    if(Cookie.get('authToken')===undefined || Cookie.get('authToken')===''|| Cookie.get('authToken')=== null){
      this.toastr.success('please login first')
      
      this.router.navigate(['/login'])
      
      return false;

    }else if(Cookie.get("userName")===undefined || Cookie.get("userName")===''|| Cookie.get("userName")===null ){
      
      this.toastr.error("UserName missing, please login again")
      return false
    }else if(Cookie.get("userName")){
      let userName = Cookie.get("userName")
      
      let temp = userName.split('-')
      
      if(temp[1]!="admin"){
        
        this.toastr.error("you are not authorized to view this page")
        this.router.navigate(['/calender'])
        return false
      }  
    else {
      console.log('true')
      return true;
    }
  }
   
  }
}
