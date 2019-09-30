import { Component, OnInit } from '@angular/core';
import { UserHttpService } from '../user-http.service';
import { SocketService } from '../socket.service'
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr'
import { Cookie } from 'ng2-cookies/ng2-cookies';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {

  public allUsers; //to hold list of all registered users

  public authToken: any;

  constructor(private userHttpService: UserHttpService, private SocketService: SocketService,
    public router: Router, public toastr: ToastrService) {

  }

  ngOnInit() {

    this.authToken = Cookie.get('authToken')

    this.allUsers = this.userHttpService.getAllUsers(this.authToken).subscribe(

      (apiResponse) => {
        if (apiResponse.status == 200) {
          this.allUsers = apiResponse['data']
        } else {
          this.toastr.error(apiResponse.message)
        }
      },
      (error) => {
        console.log('some error occured')
        console.log(error.errorMessage)
        this.toastr.warning(error.errorMessage)
      }
    ) //end all users list

  }
}
