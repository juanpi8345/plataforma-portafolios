import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/employee/dashboard/dashboard.component';
import { employeeGuard } from './services/employee.guard';
import { EmployeerDashboardComponent } from './pages/employeer/employeer-dashboard/employeer-dashboard.component';
import { employeerGuard } from './services/employeer.guard';
import { SearchEmployeersComponent } from './pages/employee/search-employeers/search-employeers.component';
import { EmployeeProfileComponent } from './pages/employee/employee-profile/employee-profile.component';
import { EmployerProfileComponent } from './pages/employeer/employer-profile/employer-profile.component';
import { ViewEmployerComponent } from './pages/employee/view-employer/view-employer.component';
import { SearchEmployeesComponent } from './pages/employeer/search-employees/search-employees.component';
import { ViewEmployeeComponent } from './pages/employeer/view-employee/view-employee.component';
import { ChatComponent } from './components/chat/chat.component';
import { MessagesComponent } from './components/messages/messages.component';


export const routes: Routes = [
    
    {path:'login',component:LoginComponent},
    {path: 'employee',component:DashboardComponent,canActivate:[employeeGuard],children:[
        {path:'profile',component:EmployeeProfileComponent},
        {path:'search',component:SearchEmployeersComponent},
        {path: 'view/:profileId',component:ViewEmployerComponent},
        {path: 'chat',component:ChatComponent,children:[
            {path: 'profile/:receiverId',component:MessagesComponent}
        ]}
    ]},
    {path: 'employer',component:EmployeerDashboardComponent,canActivate:[employeerGuard],children:[
        {path:'profile',component:EmployerProfileComponent},
        {path:'search',component:SearchEmployeesComponent},
        {path: 'view/:profileId',component:ViewEmployeeComponent},
        {path: 'chat',component:ChatComponent,children:[
            {path: ':receiverId',component:MessagesComponent}
        ]}
    ]},
    { path: '**', redirectTo: 'login', pathMatch:'full'},
];
