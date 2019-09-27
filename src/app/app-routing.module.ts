import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewCalenderComponent } from './view-calender/view-calender.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { HomeComponent } from './home/home.component';
import { RouteGuardService } from './route-guard.service';
import { Event2Component } from './event2/event2.component';
import { SamplemodalComponent } from './samplemodal/samplemodal.component';
import { RoleGuardService } from './role-guard.service';

const routes: Routes = [
  {path:'home', component:HomeComponent},  
  {path:'', redirectTo:'home', pathMatch:'full'},
  {path:'calender', component:ViewCalenderComponent, canActivate:[RouteGuardService]},
  {path:'login', component:LoginComponent},
  {path:'signup', component:SignupComponent},
  {path:'forgot', component:ForgotPasswordComponent},
  {path:'reset/:token', component:ResetPasswordComponent},
  {path:'dashboard', component:AdminDashboardComponent, canActivate:[RoleGuardService]},
  {path:'event2/:userId', component:Event2Component,canActivate:[RoleGuardService]}
    
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
