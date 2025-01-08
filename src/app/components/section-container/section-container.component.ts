import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { HeroComponent } from '../hero/hero.component';
import { AboutComponent } from '../about/about.component';
import { CommonModule } from '@angular/common';
import { SolutionsComponent } from '../soluciones/soluciones.component';
import { ClientesComponent } from '../clientes/clientes.component';
import { ContactoComponent } from '../contacto/contacto.component';
import { SolutionFinderComponent } from "../solution-finder/solution-finder.component";

@Component({
  selector: 'app-section-container',
  standalone: true,
  imports: [
    CommonModule,
    SolutionsComponent,
    NavbarComponent,
    HeroComponent,
    AboutComponent,
    ClientesComponent,
    ContactoComponent,
    SolutionFinderComponent,
],
  template: `
    <div class="snap-container">
      <app-navbar></app-navbar>
      <section class="snap-section">
        <app-hero></app-hero>
      </section>
      <section class="snap-nosection">
        <app-about class="no-snap"></app-about>
      </section>
      <section class="snap-nosection">
        <app-solutions></app-solutions>
      </section>
      <section class="snap-nosection">
        <app-solution-finder></app-solution-finder>
      </section>
      <section class="snap-section">
        <app-clientes></app-clientes>
      </section>
      <section class="snap-asection">
        <app-contacto></app-contacto>
      </section>
    </div>
  `,
  styles: [
    `
      .snap-container {
        height: 100vh;
        overflow-y: scroll;
        position: relative;
        padding-top: 60px; /* Adjust according to navbar height */
        scroll-behavior: smooth;
      }

      .snap-section {
        scroll-snap-align: start;
        scroll-snap-stop: always;
        height: 100vh;
        position: relative;
      }

      .snap-asection {
        scroll-snap-align: start;
        scroll-snap-stop: always;
        height: 100vh;
        position: relative;
      }

      .snap-nosection {
        scroll-snap-align: start;
        scroll-snap-stop: always;
        position: relative;
      }

      .snap-container::-webkit-scrollbar {
        display: none;
      }

      .snap-container {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }

      /* Disable scroll snap and give more space to the about section */
      .no-snap {
        scroll-snap-align: none; /* Disable scroll snap */
        height: 120vh; /* Increase height to give more space */
      }
    `
  ]
})
export class SectionContainerComponent {
  showSolutionFinderVisible: boolean = false;

  showSolutionFinder() {
    this.showSolutionFinderVisible = true;
  }
}
