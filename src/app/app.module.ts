import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { NgbModalModule, NgbModule } from '@ng-bootstrap/ng-bootstrap'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ViewCalenderComponent } from './view-calender/view-calender.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { UserHttpService } from './user-http.service';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { HomeComponent } from './home/home.component';
import { RouteGuardService } from './route-guard.service';
import { AuthService } from './auth.service';
import { EventService } from './event.service';
import { AngularDateTimePickerModule } from 'angular2-datetimepicker';
import { Event2Component } from './event2/event2.component';
import { SocketService } from './socket.service';
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';
import { RoleGuardService } from './role-guard.service';
import { compareEqualDirective } from './comparepass.directive';


@NgModule({
  declarations: [
    AppComponent,
    ViewCalenderComponent,
    NavbarComponent,
    LoginComponent,
    SignupComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    AdminDashboardComponent,
    HomeComponent,
    compareEqualDirective,
    Event2Component,
    PagenotfoundComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule, NgbModalModule,
    BrowserAnimationsModule, CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    }),
    FormsModule, CommonModule,
    HttpClientModule, ToastrModule.forRoot(),
    AngularDateTimePickerModule,
    NgbModule
  ],
  providers: [UserHttpService, RouteGuardService, RoleGuardService, AuthService, EventService, SocketService],
  bootstrap: [AppComponent]
})
export class AppModule { }
