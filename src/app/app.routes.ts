import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/employee/dashboard/dashboard.component';
import { ProfileComponent } from './pages/employee/profile/profile.component';
import { employeeGuard } from './services/employee.guard';
import { loggedGuard } from './services/logged.guard';
import { EmployeerProfileComponent } from './pages/employeer/employeer-profile/employeer-profile.component';
import { EmployeerDashboardComponent } from './pages/employeer/employeer-dashboard/employeer-dashboard.component';
import { employeerGuard } from './services/employeer.guard';


export const routes: Routes = [
    
    {path:'login',component:LoginComponent, canActivate:[loggedGuard]},
    {path: 'employee',component:DashboardComponent,canActivate:[employeeGuard],children:[
        {path:'profile',component:ProfileComponent}
    ]},
    {path: 'employeer',component:EmployeerDashboardComponent,canActivate:[employeerGuard],children:[
        {path:'profile',component:EmployeerProfileComponent}
    ]},
    { path: '**', redirectTo: 'login', pathMatch:'full'},
];
