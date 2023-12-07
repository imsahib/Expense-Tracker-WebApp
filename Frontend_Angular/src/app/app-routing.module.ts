import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginPortalComponent } from './login-portal/login-portal.component';
import { ExpensePortalComponent } from './expense-portal/expense-portal.component';
import { UserRegisterationComponent } from './user-registeration/user-registeration.component';
import { AppComponent } from './app.component';
const routes: Routes = [
 {path:'login',component:LoginPortalComponent},
 {path:'expenses',component:ExpensePortalComponent},
 {path:'register',component:UserRegisterationComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
