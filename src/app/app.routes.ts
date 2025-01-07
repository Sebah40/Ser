import { Routes } from '@angular/router';
import { BlogComponent } from './components/blog/blog.component';
import { SectionContainerComponent } from './components/section-container/section-container.component';
import { EnergiaComponent } from './components/energia/energia.component';
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
  { path: 'energia', component: EnergiaComponent },

  {
    path: '**',
    redirectTo: '',
  },
];
