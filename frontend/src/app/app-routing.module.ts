import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndividualViewComponent } from './individual-view/individual-view.component';
// import { GroupViewComponent } from './group-view/group-view.component';
import { IndividualSummaryViewComponent } from './individual-summary-view/individual-summary-view.component';
import { NextComponent} from './next/next.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './_services/auth.guard';
import { FinishedGuard } from './_services/finished.guard.service';
import { GroupGuard } from './_services/group.guard';
import { NavComponent } from './nav/nav.component';


const routes: Routes = [
  {path: '', redirectTo: '/intro', pathMatch: 'full'},
  {path: 'rating/:id', component: IndividualViewComponent, canActivate: [AuthGuard, FinishedGuard]},
  {path: 'rating/tour/:id', component: IndividualViewComponent, canActivate: [AuthGuard, FinishedGuard]},
  {path: 'individualsummary', component: IndividualSummaryViewComponent, canActivate: [AuthGuard, FinishedGuard]},
  {path: 'next', component: NextComponent, canActivate: [AuthGuard]},
  // {path: 'groupsummary', component: GroupViewComponent, canActivate: [AuthGuard, GroupGuard]},
  {path: 'intro', component: HomeComponent, canActivate: [AuthGuard]},
  {path: 'login', component: LoginComponent},
  // { path: '**', component: HomeComponent, canActivate: [AuthGuard]}, 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

