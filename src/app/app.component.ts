import { Component } from '@angular/core';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HeroComponent } from './components/hero/hero.component';
@Component({
  selector: 'app-root',
  imports: [NavbarComponent, HeroComponent],
  template: `<app-navbar /><app-hero />`,
  styles: [],
})
export class AppComponent {
  title = 'ser';
}
