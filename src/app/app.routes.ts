import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/employee/dashboard/dashboard.component';
import { employeeGuard } from './services/employee.guard';
import { EmployeerDashboardComponent } from './pages/employeer/employeer-dashboard/employeer-dashboard.component';
import { employeerGuard } from './services/employeer.guard';
import { SearchEmployeersComponent } from './pages/employee/search-employeers/search-employeers.component';
import { EmployeeProfileComponent } from './pages/employee/employee-profile/employee-profile.component';
import { EmployerProfileComponent } from './pages/employeer/employer-profile/employer-profile.component';


export const routes: Routes = [
    
    {path:'login',component:LoginComponent},
    {path: 'employee',component:DashboardComponent,canActivate:[employeeGuard],children:[
        {path:'profile',component:EmployeeProfileComponent},
        {path:'search',component:SearchEmployeersComponent}
    ]},
    {path: 'employer',component:EmployeerDashboardComponent,canActivate:[employeerGuard],children:[
        {path:'profile',component:EmployerProfileComponent}
    ]},
    { path: '**', redirectTo: 'login', pathMatch:'full'},
];
