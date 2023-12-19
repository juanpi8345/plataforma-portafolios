import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { Component } from '@angular/core';
import { DashboardComponent } from './pages/employee/dashboard/dashboard.component';
import { ProfileComponent } from './pages/employee/profile/profile.component';

export const routes: Routes = [
    
    {path:'login',component:LoginComponent,},
    {path: 'employee',component:DashboardComponent,children:[
        {path:'profile',component:ProfileComponent}
    ]},
    { path: '**', redirectTo: 'login', pathMatch:'full' }
];
