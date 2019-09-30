import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr'
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { UserHttpService } from '../user-http.service';
import { Observable } from 'rxjs'
import { AuthService } from '../auth.service';
import { SocketService } from '../socket.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {


  constructor(private authService: AuthService, private router: Router, private toastr: ToastrService, private SocketService: SocketService) { }

  ngOnInit() {

  }

  public logout: any = () => {

    this.authService.logout()
      .subscribe((apiResponse) => {

        if (apiResponse.status === 200) {
          console.log("logout called")
          Cookie.delete('authToken');
          Cookie.delete('receiverId');
          Cookie.delete('receiverName');
          Cookie.delete('userName');
          this.SocketService.exitSocket()

          this.router.navigate(['/home']);

        } else {
          this.toastr.error(apiResponse.message)
          Cookie.delete('authToken');
          Cookie.delete('authtoken');
          Cookie.delete('receiverId');
          Cookie.delete('receiverName');
          Cookie.delete('userName');
          this.SocketService.exitSocket()
          this.router.navigate(['/home']);
        } // end condition

      }, (err) => {
        this.toastr.error('some error occured')
      });

  } // end logout

}
