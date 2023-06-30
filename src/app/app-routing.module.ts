import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ProjectFormComponent} from "./pages/projects/project-form/project-form.component";
import {ProjectsListComponent} from "./pages/projects/projects-list/projects-list.component";
import {EpicsListComponent} from "./pages/epics/epics-list/epics-list.component";
import {EpicFormComponent} from "./pages/epics/epic-form/epic-form.component";
import {TasksListComponent} from "./pages/tasks/tasks-list/tasks-list.component";
import {TaskFormComponent} from "./pages/tasks/task-form/task-form.component";
import {TaskDetailsComponent} from "./pages/tasks/task-details/task-details.component";

const routes: Routes = [
  { path: '', redirectTo: '/', pathMatch: 'full'},
  { path: 'projects', component: ProjectsListComponent },
  { path: 'project/create', component: ProjectFormComponent },
  { path: ':project/edit', component: ProjectFormComponent },
  { path: ':project/epics', component: EpicsListComponent },
  { path: ':project/create', component: EpicFormComponent },
  { path: ':project/:epic/edit', component: EpicFormComponent },
  { path: ':project/:epic/tasks', component: TasksListComponent },
  { path: ':project/:epic/create', component: TaskFormComponent },
  { path: ':project/:epic/:task/edit', component: TaskFormComponent },
  { path: ':project/:epic/:task/details', component: TaskDetailsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
