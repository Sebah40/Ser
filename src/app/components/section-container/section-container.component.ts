import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { HeroComponent } from '../hero/hero.component';
import { AboutComponent } from '../about/about.component';
import { CommonModule } from '@angular/common';
import { SolucionesComponent } from '../soluciones/soluciones.component';
import { ClientesComponent } from '../clientes/clientes.component';
import { ContactoComponent } from '../contacto/contacto.component';

@Component({
  selector: 'app-section-container',
  standalone: true,
  imports: [
    CommonModule,
    SolucionesComponent,
    NavbarComponent,
    HeroComponent,
    AboutComponent,
    ClientesComponent,
    ContactoComponent,
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
        <app-soluciones></app-soluciones>
      </section>
      <section class="snap-section">
        <app-clientes></app-clientes>
      </section>
      <section class="snap-section">
        <app-contacto></app-contacto>
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
        scroll-behavior: smooth;
      }

      /* Disable scroll snap and give more space to the about section */
      .no-snap {
        scroll-snap-align: none; /* Disable scroll snap */
        height: 120vh; /* Increase height to give more space */
      }
    `,
  ],
})
export class SectionContainerComponent {}
