import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SectionContainerComponent } from './components/section-container/section-container.component';
import { BlogComponent } from './components/blog/blog.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <router-outlet></router-outlet>
  `,
  styles: [`
    :host {
      display: block;
      height: 100vh;
      overflow: auto;
    }
  `]
})
export class AppComponent {
  title = 'ser';
}