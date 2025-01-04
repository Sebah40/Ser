import { Component } from '@angular/core';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HeroComponent } from './components/hero/hero.component';
import { AboutComponent } from './components/about/about.component';
import { SectionContainerComponent } from './components/section-container/section-container.component';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [SectionContainerComponent],
  template: `<app-section-container></app-section-container>`,
  styles: [
    `
      :host {
        display: block;
        height: 100vh;
        overflow: hidden;
      }
    `,
  ],
})
export class AppComponent {
  title = 'ser';
}
