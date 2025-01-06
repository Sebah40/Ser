import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-soluciones',
  standalone: true,
  imports: [CommonModule],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-in', style({ opacity: 1 })),
      ]),
      transition(':leave', [animate('300ms ease-out', style({ opacity: 0 }))]),
    ]),
  ],
  template: `
    <section class="solutions-container" [class.dark-mode]="isDarkMode">
      <div class="header-section">
        <h1 class="section-title">Nuestras soluciones</h1>
        <p class="subtitle">Descubre las mejores soluciones en energía solar</p>
      </div>

      <div class="solutions-grid">
        <div
          *ngFor="let solution of solutions"
          class="solution-panel"
          (mouseenter)="activePanel = solution.id"
          (mouseleave)="activePanel = null"
          [@fadeInOut]
        >
          <div
            class="background-image"
            [style.backgroundImage]="'url(' + solution.image + ')'"
          >
            <div class="stats-overlay" *ngIf="activePanel === solution.id">
              <div class="stat-item" *ngFor="let stat of solution.stats">
                <span class="stat-value">{{ stat.value }}</span>
                <span class="stat-label">{{ stat.label }}</span>
              </div>
            </div>
          </div>
          <div class="overlay" [class.active]="activePanel === solution.id">
            <div class="content-wrapper">
              <h2 class="title">{{ solution.title }}</h2>
              <p class="description">{{ solution.description }}</p>
              <div
                class="button-group"
                [class.show]="activePanel === solution.id"
              >
                <button class="info-button" (click)="openSolution(solution.id)">
                  <i class="fas fa-info-circle"></i> Ver más
                </button>
                <a
                  [href]="solution.storeUrl"
                  target="_blank"
                  class="store-button"
                >
                  <i class="fas fa-shopping-cart"></i> Rigelec Store
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="cta-section">
        <button class="cta-button" (click)="showSolutionFinder()">
          <i class="fas fa-lightbulb"></i> ¿Qué solución me conviene?
        </button>
        <button class="theme-toggle" (click)="toggleTheme()">
          <i [class]="isDarkMode ? 'fas fa-sun' : 'fas fa-moon'"></i>
        </button>
      </div>

      <!-- Modal -->
      <div class="modal" *ngIf="selectedSolution" [@fadeInOut]>
        <div class="modal-content">
          <div class="modal-header">
            <h2>{{ modalTitle }}</h2>
            <button class="close-button" (click)="closeModal()">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="modal-body">
            <iframe
              *ngIf="pdfUrl"
              [src]="pdfUrl"
              [title]="modalTitle"
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      /* Add Font Awesome CDN in index.html */
      @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

      :host {
        --primary-color: #007bff;
        --secondary-color: #ffd700;
        --text-light: #ffffff;
        --text-dark: #333333;
        --transition-speed: 0.4s;
      }

      .dark-mode {
        --primary-color: #0056b3;
        --text-light: #e0e0e0;
        background-color: #1a1a1a;
      }

      .solutions-container {
        font-family: 'Poppins', sans-serif;
        padding: 4rem 2rem;
        transition: background-color var(--transition-speed);
      }

      .header-section {
        text-align: center;
        margin-bottom: 3rem;
      }

      .section-title {
        font-size: 3rem;
        font-weight: 700;
        margin-bottom: 1rem;
        background: linear-gradient(
          45deg,
          var(--primary-color),
          var(--secondary-color)
        );
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }

      .subtitle {
        font-size: 1.2rem;
        color: var(--text-dark);
        opacity: 0.8;
      }

      .solutions-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 2rem;
        max-width: 1400px;
        margin: 0 auto;
      }

      .solution-panel {
        height: 400px;
        border-radius: 15px;
        overflow: hidden;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
      }

      .solution-panel:hover {
        transform: translateY(-10px);
      }

      .background-image {
        height: 100%;
        background-size: cover;
        background-position: center;
        transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      }

      .stats-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        padding: 1rem;
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 1rem;
        background: rgba(0, 0, 0, 0.7);
      }

      .stat-item {
        text-align: center;
        color: var(--text-light);
      }

      .stat-value {
        font-size: 1.5rem;
        font-weight: 700;
        display: block;
      }

      .stat-label {
        font-size: 0.9rem;
        opacity: 0.8;
      }

      .overlay {
        position: absolute;
        inset: 0;
        background: linear-gradient(
          to top,
          rgba(0, 0, 0, 0.8) 0%,
          transparent 100%
        );
        display: flex;
        align-items: flex-end;
        padding: 2rem;
        transition: all var(--transition-speed);
      }

      .content-wrapper {
        color: var(--text-light);
        transform: translateY(60px);
        transition: transform var(--transition-speed),
          opacity var(--transition-speed);
      }

      .solution-panel:hover .content-wrapper {
        transform: translateY(0);
        opacity: 0.8;
      }

      .title {
        font-size: 2rem;
        margin-bottom: 1rem;
      }

      .description {
        opacity: 0;
        transition: opacity var(--transition-speed);
        margin-bottom: 1.5rem;
      }

      .solution-panel:hover .description {
        opacity: 1;
      }

      .button-group {
        display: flex;
        gap: 1rem;
      }

      .info-button,
      .store-button {
        padding: 0.8rem 1.5rem;
        border-radius: 50px;
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        transition: all var(--transition-speed);
      }

      .info-button {
        background-color: transparent;
        border: 2px solid var(--text-light);
        color: var(--text-light);
      }

      .store-button {
        background-color: var(--secondary-color);
        color: var(--text-dark);
        text-decoration: none;
      }

      .cta-section {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 1rem;
        margin-top: 3rem;
      }

      .cta-button {
        background-color: var(--primary-color);
        color: var(--text-light);
        padding: 1rem 2rem;
        border-radius: 50px;
        font-size: 1.2rem;
        font-weight: 600;
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        transition: transform var(--transition-speed),
          background-color var(--transition-speed);
      }

      .cta-button:hover {
        transform: scale(1.05);
        background-color: #0056b3;
      }

      .theme-toggle {
        background: transparent;
        border: none;
        color: var(--text-dark);
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0.5rem;
        transition: transform var(--transition-speed);
      }

      .theme-toggle:hover {
        transform: rotate(180deg);
      }

      .modal {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 2rem;
        z-index: 1000;
      }

      .modal-content {
        background: white;
        border-radius: 15px;
        width: 90vw;
        height: 90vh;
        max-width: 1200px;
        overflow: hidden;
      }

      .modal-header {
        padding: 1.5rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #eee;
      }

      .modal-body {
        height: calc(100% - 70px);
      }

      .modal-body iframe {
        width: 100%;
        height: 100%;
        border: none;
      }

      .close-button {
        background: transparent;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: #666;
        transition: color var(--transition-speed);
      }

      .close-button:hover {
        color: #000;
      }

      @media (max-width: 768px) {
        .solutions-container {
          padding: 2rem 1rem;
        }

        .section-title {
          font-size: 2rem;
        }

        .solution-panel {
          height: 300px;
        }

        .title {
          font-size: 1.5rem;
        }

        .button-group {
          flex-direction: column;
        }
      }
    `,
  ],
})
export class SolucionesComponent implements OnInit {
  activePanel: string | null = null;
  selectedSolution: string | null = null;
  modalTitle: string = '';
  pdfUrl: SafeResourceUrl | null = null;
  isDarkMode: boolean = false;

  solutions = [
    {
      id: 'offgrid',
      title: 'Off Grid',
      description: 'Soluciones completas para independencia energética total',
      image: '/offgrid.jpg',
      storeUrl: 'https://tienda.rigelec.com.ar/?product_cat=b-aislados',
      pdf: '/pdfs/off-grid.pdf',
      stats: [
        { value: '100%', label: 'Autonomía' },
        { value: '24/7', label: 'Disponibilidad' },
        { value: '0', label: 'Facturas' },
        { value: '15+', label: 'Años de vida útil' },
      ],
    },
    {
      id: 'ongrid',
      title: 'On Grid',
      description: 'Reduce tu factura de luz manteniendo la conexión a la red',
      image: '/ongrid.jpg',
      storeUrl: 'https://tienda.rigelec.com.ar/?product_cat=a-ahorro',
      pdf: '/pdfs/on-grid.pdf',
      stats: [
        { value: '80%', label: 'Ahorro' },
        { value: '5+', label: 'Años ROI' },
        { value: '0', label: 'Mantenimiento' },
        { value: '25+', label: 'Años garantía' },
      ],
    },
    {
      id: 'bombeo',
      title: 'Bombeo Solar',
      description:
        'Sistemas de bombeo eficientes alimentados por energía solar',
      image: '/bombeo.jpg',
      storeUrl: 'https://tienda.rigelec.com.ar/?product_cat=e-bombeo',
      pdf: '/pdfs/bombeo.pdf',
      stats: [
        { value: '100%', label: 'Solar' },
        { value: '8h', label: 'Bombeo diario' },
        { value: '40m', label: 'Altura máx.' },
        { value: '10+', label: 'Años de vida' },
      ],
    },
  ];

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit() {
    this.checkPreferredTheme();
  }

  @HostListener('window:keydown.escape')
  handleEscKey() {
    this.closeModal();
  }

  checkPreferredTheme() {
    this.isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
  }

  openSolution(solutionId: string) {
    this.selectedSolution = solutionId;
    const solution = this.solutions.find((sol) => sol.id === solutionId);
    if (solution) {
      this.modalTitle = solution.title;
      this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(solution.pdf);
    }
  }

  closeModal() {
    this.selectedSolution = null;
    this.pdfUrl = null;
  }

  showSolutionFinder() {
    console.log('Solution finder clicked');
  }
}
