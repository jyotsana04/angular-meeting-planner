import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';

import flatpickr from "flatpickr";
import { FlatpickrModule } from 'angularx-flatpickr';
import {FullCalendarModule} from '@fullcalendar/angular'
import {NgbModalModule, NgbModule} from '@ng-bootstrap/ng-bootstrap'
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
import { InternationalPhoneNumberModule } from 'ngx-international-phone-number'
import { RouteGuardService } from './route-guard.service';
import { AuthService } from './auth.service';
import { EventService } from './event.service';

import {AngularDateTimePickerModule} from 'angular2-datetimepicker';
import { Event2Component } from './event2/event2.component';
import { SamplemodalComponent } from './samplemodal/samplemodal.component'
import {ModalModule, BsModalService} from 'ngx-bootstrap/modal'
import { SocketService } from './socket.service';
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';
import { RoleGuardService } from './role-guard.service';


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
    
    Event2Component,
    SamplemodalComponent,
    PagenotfoundComponent,
    UnauthorizedComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule, NgbModalModule,
    FlatpickrModule.forRoot(),
    BrowserAnimationsModule,CalendarModule.forRoot({
      provide:DateAdapter,
      useFactory:adapterFactory
    }),
    FormsModule, CommonModule,
    HttpClientModule, ToastrModule.forRoot(), InternationalPhoneNumberModule, FullCalendarModule,
    AngularDateTimePickerModule,
    NgbModule, ModalModule.forRoot()
  ],
  providers: [UserHttpService, RouteGuardService, RoleGuardService, AuthService, EventService, SocketService],
  bootstrap: [AppComponent]
})
export class AppModule { }
