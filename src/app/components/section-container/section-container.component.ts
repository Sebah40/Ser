import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { HeroComponent } from '../hero/hero.component';
import { AboutComponent } from '../about/about.component';
import { CommonModule } from '@angular/common';
import { SolucionesComponent } from '../soluciones/soluciones.component';
@Component({
  selector: 'app-section-container',
  standalone: true,
  imports: [
    CommonModule,
    SolucionesComponent,
    NavbarComponent,
    HeroComponent,
    AboutComponent,
  ],
  template: `
    <div class="snap-container">
      <app-navbar></app-navbar>
      <section class="snap-section">
        <app-hero></app-hero>
      </section>
      <section class="snap-section">
        <app-about></app-about>
      </section>
      <section class="snap-section">
        <app-soluciones></app-soluciones>
      </section>
    </div>
  `,
  styles: [
    `
      .snap-container {
        height: 100vh;
        overflow-y: scroll;
        scroll-snap-type: y mandatory;
        position: relative;
      }

      .snap-section {
        scroll-snap-align: start;
        scroll-snap-stop: always;
        height: 100vh;
        position: relative;
      }

      .snap-container::-webkit-scrollbar {
        display: none;
      }

      .snap-container {
        -ms-overflow-style: none;
        scrollbar-width: none;
        scroll-behavior: smooth;
      }
    `,
  ],
})
export class SectionContainerComponent {}
