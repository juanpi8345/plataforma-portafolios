import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { Component } from '@angular/core';
import { DashboardComponent } from './pages/employee/dashboard/dashboard.component';

export const routes: Routes = [
    
    {path:'login',component:LoginComponent,},
    {path: 'employee',component:DashboardComponent,children:[
        
    ]},
    { path: '**', redirectTo: 'login', pathMatch:'full' }
];
