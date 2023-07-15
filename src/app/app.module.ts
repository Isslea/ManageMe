import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProjectsListComponent } from './pages/projects/projects-list/projects-list.component';
import {ReactiveFormsModule} from "@angular/forms";
import { ProjectFormComponent } from './pages/projects/project-form/project-form.component';
import {HttpClientModule} from "@angular/common/http";
import { EpicsListComponent } from './pages/epics/epics-list/epics-list.component';
import { EpicFormComponent } from './pages/epics/epic-form/epic-form.component';
import { TasksListComponent } from './pages/tasks/tasks-list/tasks-list.component';
import { TaskFormComponent } from './pages/tasks/task-form/task-form.component';
import { StatusFilterPipe } from './pipes/status-filter.pipe';
import { TaskDetailsComponent } from './pages/tasks/task-details/task-details.component';
import { DurationPipe } from './pipes/duration.pipe';
import { EpicDetailsComponent } from './pages/epics/epic-details/epic-details.component';
import { ProjectDetailsComponent } from './pages/projects/project-details/project-details.component';
import { UserRegisterComponent } from './pages/users/user-register/user-register.component';
import { UserLoginComponent } from './pages/users/user-login/user-login.component';

@NgModule({
  declarations: [
    AppComponent,
    ProjectsListComponent,
    ProjectFormComponent,
    EpicsListComponent,
    EpicFormComponent,
    TasksListComponent,
    TaskFormComponent,
    StatusFilterPipe,
    TaskDetailsComponent,
    DurationPipe,
    EpicDetailsComponent,
    ProjectDetailsComponent,
    UserRegisterComponent,
    UserLoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
