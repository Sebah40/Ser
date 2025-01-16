import { Component, OnInit, HostListener } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { HeroComponent } from '../hero/hero.component';
import { AboutComponent } from '../about/about.component';
import { CommonModule } from '@angular/common';
import { SolutionsComponent } from '../soluciones/soluciones.component';
import { ContactoComponent } from '../contacto/contacto.component';
import { SolutionFinderComponent } from '../solution-finder/solution-finder.component';
import { MapsComponent } from "../maps/maps.component";
import { trigger, transition, style, animate } from '@angular/animations';


@Component({
  selector: 'app-section-container',
  standalone: true,
  imports: [CommonModule,
    SolutionsComponent,
    NavbarComponent,
    HeroComponent,
    AboutComponent,
    ContactoComponent,
    SolutionFinderComponent,
    MapsComponent],
  animations: [
    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('600ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ],
  template: `
    <div class="main-container" [class.scrolling]="isScrolling">

      <!-- Progress Bar -->
      <div class="progress-bar">
        <div class="progress" [style.width]="scrollProgress + '%'"></div>
      </div>

      <!-- Scroll Indicator (only show on first section) -->
      <div class="scroll-indicator" *ngIf="currentSection === 0" @fadeInUp>
        <span>Scroll</span>
        <i class="fas fa-chevron-down"></i>
      </div>

      <!-- Main Content -->
      <div class="snap-container" (scroll)="onScroll($event)">
        <app-navbar></app-navbar>
        
        <section id="hero" class="snap-section">
          <app-hero></app-hero>
        </section>

        <section id="about" class="snap-nosection">
          <app-about class="no-snap"></app-about>
        </section>

        <section id="solutions" class="snap-nosection">
          <app-solutions></app-solutions>
        </section>

        <section id="finder" class="snap-nosection">
          <app-solution-finder></app-solution-finder>
        </section>

        <section id="location" class="snap-nosection">
          <app-maps></app-maps>
        </section>

        <section id="contact" class="snap-asection">
          <app-contacto></app-contacto>
        </section>

        <!-- Back to Top Button -->
        <button 
          class="back-to-top"
          [class.visible]="showBackToTop"
          (click)="scrollToTop()"
        >
          <i class="fas fa-arrow-up"></i>
        </button>
      </div>
    </div>
  `,
  styles: [`
  :host {
      display: block;
      width: 100%;
      --primary: #0c457a;
      --primary-light: #2563eb;
      --secondary: rgb(21, 166, 250);
      --text: #1e293b;
      --text-light: #64748b;
      --background: #ffffff;
      --surface: #f8fafc;
    }

    .main-container {
      position: relative;
      height: 100vh;
      background: var(--background);
    }

    /* Progress Bar */
    .progress-bar {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 3px;
      background: rgba(255, 255, 255, 0.1);
      z-index: 1000;
    }

    .progress {
      height: 100%;
      background: linear-gradient(90deg, var(--primary), var(--accent));
      transition: width 0.3s ease;
    }

    /* Section Navigation */
    .section-nav {
      position: fixed;
      right: 2rem;
      top: 50%;
      transform: translateY(-50%);
      z-index: 1000;
    }

    .section-nav ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .section-nav button {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      border: 2px solid var(--primary);
      background: transparent;
      margin: 1rem 0;
      padding: 0;
      cursor: pointer;
      position: relative;
      transition: all 0.3s ease;
    }

    .section-nav button:hover,
    .section-nav button.active {
      background: var(--primary);
      transform: scale(1.2);
    }

    .nav-tooltip {
      position: absolute;
      right: 100%;
      top: 50%;
      transform: translateY(-50%);
      margin-right: 1rem;
      padding: 0.5rem 1rem;
      background: var(--primary);
      color: white;
      border-radius: 0.5rem;
      font-size: 0.875rem;
      white-space: nowrap;
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s ease;
    }

    .section-nav button:hover .nav-tooltip {
      opacity: 1;
      visibility: visible;
      transform: translateY(-50%) translateX(-0.5rem);
    }

    /* Scroll Indicator */
    .scroll-indicator {
      position: fixed;
      bottom: 2rem;
      left: 50%;
      transform: translateX(-50%);
      color: var(--primary);
      text-align: center;
      z-index: 1000;
      animation: bounce 2s infinite;
    }

    .scroll-indicator span {
      display: block;
      margin-bottom: 0.5rem;
      font-size: 0.875rem;
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }

    @keyframes bounce {
      0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
      40% { transform: translateY(-10px); }
      60% { transform: translateY(-5px); }
    }

    /* Back to Top Button */
    .back-to-top {
  position: fixed;
  bottom: 2rem;
  left: 2rem;        /* Changed from right to left */
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  background: var(--primary);
  color: white;
  border: none;
  cursor: pointer;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  z-index: 1000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

    .back-to-top.visible {
      opacity: 1;
      visibility: visible;
    }

    .back-to-top:hover {
      transform: translateY(-3px);
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
    }

    /* Keep your existing styles and add these modifications */
    .snap-container {
      height: 100vh;
      overflow-y: scroll;
      position: relative;
      scroll-behavior: smooth;
      padding-top: 60px;
    }

    .snap-section,
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

    .no-snap {
      scroll-snap-align: none;
      min-height: 100vh;
    }

    /* Hide scrollbar but keep functionality */
    .snap-container::-webkit-scrollbar {
      width: 0px;
    }

    .snap-container {
      scrollbar-width: none;
    }

    @media (max-width: 768px) {
      .section-nav {
        display: none;
      }

      .back-to-top {
        bottom: 1rem;
        right: 1rem;
      }
    }
  `]
})
export class SectionContainerComponent implements OnInit {
  currentSection = 0;
  showBackToTop = false;
  scrollProgress = 0;
  isScrolling = false;
  scrollTimeout: any;


  @HostListener('window:scroll', ['$event'])
  onScroll(event: any) {
    // Update scroll progress
    const container = event.target;
    const scrolled = container.scrollTop;
    const maxScroll = container.scrollHeight - container.clientHeight;
    this.scrollProgress = (scrolled / maxScroll) * 100;

    // Show/hide back to top button
    this.showBackToTop = scrolled > 600;

    // Detect current section
    this.detectCurrentSection(scrolled);

    // Add scrolling class for animations
    this.isScrolling = true;
    clearTimeout(this.scrollTimeout);
    this.scrollTimeout = setTimeout(() => {
      this.isScrolling = false;
    }, 150);
  }

  detectCurrentSection(scrolled: number) {
    const sections = document.querySelectorAll('section');
    sections.forEach((section, index) => {
      const top = section.offsetTop - 100;
      const bottom = top + section.offsetHeight;
      if (scrolled >= top && scrolled < bottom) {
        this.currentSection = index;
      }
    });
  }



  scrollToTop() {
    const container = document.querySelector('.snap-container');
    if (container) {
      container.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  ngOnInit() {
    // Initial detection
    setTimeout(() => {
      this.detectCurrentSection(0);
    }, 100);
  }
}