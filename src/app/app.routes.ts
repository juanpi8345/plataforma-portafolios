import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/employee/dashboard/dashboard.component';
import { ProfileComponent } from './pages/employee/profile/profile.component';
import { employeeGuard } from './services/employee.guard';

export const routes: Routes = [
    
    {path:'login',component:LoginComponent,},
    {path: 'employee',component:DashboardComponent,canActivate:[employeeGuard],children:[
        {path:'profile',component:ProfileComponent}
    ]},
    { path: '**', redirectTo: 'login', pathMatch:'full' }
];
