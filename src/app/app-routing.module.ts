import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ProjectFormComponent} from "./pages/projects/project-form/project-form.component";
import {ProjectsListComponent} from "./pages/projects/projects-list/projects-list.component";
import {EpicsListComponent} from "./pages/epics/epics-list/epics-list.component";
import {EpicFormComponent} from "./pages/epics/epic-form/epic-form.component";
import {TasksListComponent} from "./pages/tasks/tasks-list/tasks-list.component";
import {TaskFormComponent} from "./pages/tasks/task-form/task-form.component";
import {TaskDetailsComponent} from "./pages/tasks/task-details/task-details.component";
import {UserRegisterComponent} from "./pages/users/user-register/user-register.component";
import {UserLoginComponent} from "./pages/users/user-login/user-login.component";
import {AuthGuard} from "./authGuard";

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: UserLoginComponent},
  { path: 'register', component: UserRegisterComponent},
  { path: 'projects', component: ProjectsListComponent, canActivate: [AuthGuard] },
  { path: 'create', component: ProjectFormComponent, canActivate: [AuthGuard]  },
  {
    path: ':project',
    canActivate: [AuthGuard],
    children: [
      { path: 'edit', component: ProjectFormComponent, canActivate: [AuthGuard]  },
      { path: 'epics', component: EpicsListComponent, canActivate: [AuthGuard]  },
      { path: 'create', component: EpicFormComponent, canActivate: [AuthGuard]  },
      {
        path: ':epic',
        canActivate: [AuthGuard],
        children: [
          { path: 'edit', component: EpicFormComponent, canActivate: [AuthGuard]  },
          { path: 'tasks', component: TasksListComponent, canActivate: [AuthGuard]  },
          { path: 'create', component: TaskFormComponent, canActivate: [AuthGuard]  },
          {
            path: ':task',
            canActivate: [AuthGuard],
            children: [
              { path: 'edit', component: TaskFormComponent, canActivate: [AuthGuard]  },
              { path: 'details', component: TaskDetailsComponent, canActivate: [AuthGuard]  }
            ]
          }
        ]
      }
    ]
  }
  ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
