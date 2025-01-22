import { Routes } from '@angular/router';
import { BlogComponent } from './components/blog/blog.component';
import { SectionContainerComponent } from './components/section-container/section-container.component';
import { BlogCreateComponent } from './components/blog/blog-create.component';
import { ProjectComponent } from './components/project/project.component';
import { ServiciosComponent } from './components/servicios/servicios.component';
import { ListComponent } from './components/list/list.component';
export const routes: Routes = [
  {
    path: '',
    component: SectionContainerComponent,
    pathMatch: 'full',
  },
  {
    path: 'blog',
    component: BlogComponent,
  },
  { path: 'crearblog/:id', component: BlogCreateComponent },
  { path: 'crearblog', component: BlogCreateComponent },
  { path: 'project/:id', component: ProjectComponent },
  { path: 'servicios', component: ServiciosComponent },
  { path: 'lista', component: ListComponent },
  {path: '**', redirectTo: ''},

];
