import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/employee/dashboard/dashboard.component';
import { ProfileComponent } from './components/profile/profile.component';
import { employeeGuard } from './services/employee.guard';
import { EmployeerDashboardComponent } from './pages/employeer/employeer-dashboard/employeer-dashboard.component';
import { employeerGuard } from './services/employeer.guard';


export const routes: Routes = [
    
    {path:'login',component:LoginComponent},
    {path: 'employee',component:DashboardComponent,canActivate:[employeeGuard],children:[
        {path:'profile',component:ProfileComponent}
    ]},
    {path: 'employeer',component:EmployeerDashboardComponent,canActivate:[employeerGuard],children:[
        {path:'profile',component:ProfileComponent}
    ]},
    { path: '**', redirectTo: 'login', pathMatch:'full'},
];
