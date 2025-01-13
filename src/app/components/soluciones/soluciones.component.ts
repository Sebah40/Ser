import { Component, Output, OnInit, HostListener, EventEmitter, ViewChild, ElementRef  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { 
  trigger, 
  transition, 
  style, 
  animate, 
  state 
} from '@angular/animations';

@Component({
  selector: 'app-solutions',
  standalone: true,
  imports: [CommonModule],
  animations: [
    trigger('cardAnimation', [
      state('void', style({ 
        opacity: 0, 
        transform: 'translateY(30px)' 
      })),
      state('*', style({ 
        opacity: 1, 
        transform: 'translateY(0)' 
      })),
      transition('void => *', [
        animate('600ms cubic-bezier(0.35, 0, 0.25, 1)')
      ])
    ]),
    trigger('fadeScale', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.95)' }),
        animate('200ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0, transform: 'scale(0.95)' }))
      ])
    ])
  ],
  template: `
    <section class="solutions-wrapper">
      <div class="solutions-header">
        <div class="header-content" @cardAnimation>
          <h1 class="gradient-text">Soluciones Energéticas</h1>
          <p class="subtitle">Descubre el poder de la energía solar para tu hogar o negocio</p>
          <div class="solutions-footer">
          <a href="#finder" class="finder-button"><i class="fas fa-lightbulb"></i>Encuentra tu Solución Ideal</a>
      </div>
        </div>
      </div>

      <div class="solutions-grid">
        <div 
          *ngFor="let solution of filteredSolutions" 
          class="solution-card" 
          [class.active]="activeCard === solution.id"
          (mouseenter)="!isTouchDevice && setActiveCard(solution.id)"
          (mouseleave)="!isTouchDevice && clearActiveCard()"
          (click)="handleCardClick(solution.id)"
          @cardAnimation
        >
          <div class="card-media" [style.backgroundImage]="'url(' + solution.image + ')'">
            <div class="card-overlay">
              <div class="stats-grid" *ngIf="showStats(solution.id)">
                <div class="stat-box" *ngFor="let stat of solution.stats">
                  <span class="stat-value">{{stat.value}}</span>
                  <span class="stat-label">{{stat.label}}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="card-content">
            <h2 class="card-title">{{solution.title}}</h2>
            <p class="card-description" [class.show]="showDescription(solution.id)">
              {{solution.description}}
            </p>
            
            <div class="card-actions" [class.show]="showActions(solution.id)">
              <button 
                class="action-button primary"
                (click)="openDetails(solution.id, $event)"
              >
                <i class="fas fa-info-circle"></i>
                Más Información
              </button>
              <a 
                [href]="solution.storeUrl"
                target="_blank"
                class="action-button secondary"
                (click)="$event.stopPropagation()"
              >
                <i class="fas fa-shopping-cart"></i>
                Tienda
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Details Modal -->
      <div 
        class="modal-overlay" 
        *ngIf="selectedSolution" 
        @fadeScale
        (click)="closeModal()"
      >
        <div class="modal-container" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>{{modalTitle}}</h3>
            <button class="close-button" (click)="closeModal()">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="modal-content">
            <iframe
              *ngIf="pdfUrl"
              [src]="pdfUrl"
              [title]="modalTitle"
              loading="eager"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    /* Modern styling with improved visuals */
    :host {
      --primary: #2563eb;
      --primary-light:rgb(39, 75, 133);
      --secondary:rgb(21, 166, 250);
      --accent: #0c457a;
      --background: #ffffff;
      --surface: #f8fafc;
      --text: #1e293b;
      --text-light: #64748b;
      --shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
      --radius: 1rem;
      --transition: 200ms cubic-bezier(0.4, 0, 0.2, 1);
      display: block;
      min-height: 100vh;
    }

    .solutions-wrapper {
      background: var(--background);
      color: var(--text);
      min-height: 100vh;
      transition: background-color var(--transition);
    }

    .solutions-header {
      padding: 4rem 2rem;
      background: linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%);
      clip-path: polygon(0 0, 100% 0, 100% 85%, 0 100%);
      margin-bottom: 4rem;
    }

    .header-content {
      max-width: 1200px;
      margin: 0 auto;
      text-align: center;
      color: white;
    }

    .gradient-text {
      font-size: 3.5rem;
      font-weight: 800;
      margin-bottom: 1rem;
      background: linear-gradient(to right, white, var(--secondary));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      text-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .subtitle {
      font-size: 1.25rem;
      opacity: 0.9;
      margin-bottom: 2rem;
    }

    .search-bar {
      max-width: 600px;
      margin: 0 auto;
      background: white;
      border-radius: 9999px;
      padding: 0.75rem 1.5rem;
      display: flex;
      align-items: center;
      gap: 1rem;
      box-shadow: var(--shadow);
    }

    .search-bar input {
      flex: 1;
      border: none;
      outline: none;
      font-size: 1rem;
      background: transparent;
    }

    .search-bar i {
      color: var(--text-light);
    }

    .solutions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 2rem;
      padding: 2rem;
      max-width: 1400px;
      margin: 0 auto;
    }

    .solution-card {
      background: var(--surface);
      border-radius: var(--radius);
      overflow: hidden;
      box-shadow: var(--shadow);
      transition: transform var(--transition), box-shadow var(--transition);
      cursor: pointer;
    }

    .solution-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
    }

    .card-media {
      height: 240px;
      background-size: cover;
      background-position: center;
      position: relative;
    }

    .card-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
      opacity: 0;
      transition: opacity var(--transition);
    }

    .solution-card.active .card-overlay {
      opacity: 1;
    }

    .stats-grid {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 1.5rem;
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
    }

    .stat-box {
      text-align: center;
      color: white;
    }

    .stat-value {
      font-size: 1.5rem;
      font-weight: 700;
      display: block;
    }

    .stat-label {
      font-size: 0.875rem;
      opacity: 0.9;
    }

    .card-content {
      padding: 1.5rem;
    }

    .card-title {
      font-size: 1.5rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
      color: var(--text);
    }

    .card-description {
      color: var(--text-light);
      margin-bottom: 1.5rem;
      line-height: 1.6;
      opacity: 0;
      transform: translateY(10px);
      transition: opacity var(--transition), transform var(--transition);
    }

    .card-description.show {
      opacity: 1;
      transform: translateY(0);
    }

    .card-actions {
      display: flex;
      gap: 1rem;
      opacity: 0;
      transform: translateY(10px);
      transition: opacity var(--transition), transform var(--transition);
    }

    .card-actions.show {
      opacity: 1;
      transform: translateY(0);
    }

    .action-button {
      flex: 1;
      padding: 0.75rem 1rem;
      border-radius: 9999px;
      border: none;
      font-weight: 600;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      cursor: pointer;
      transition: all var(--transition);
    }

    .action-button.primary {
      background: var(--primary);
      color: white;
    }

    .action-button.primary:hover {
      background: var(--primary-light);
    }

    .action-button.secondary {
      background: var(--secondary);
      color: var(--text);
      text-decoration: none;
    }

    .action-button.secondary:hover {
      filter: brightness(1.1);
    }

    .solutions-footer {
      padding: 2rem;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 1rem;
    }

    .finder-button {
      background: linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%);
      color: white;
      border: none;
      padding: 1rem 2rem;
      border-radius: 9999px;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      cursor: pointer;
      text-decoration: none;
      transition: all var(--transition);
      box-shadow: var(--shadow);
    }

    .finder-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
    }

    .theme-toggle {
      background: var(--surface);
      border: none;
      width: 3rem;
      height: 3rem;
      border-radius: 9999px;
      display: grid;
      place-items: center;
      cursor: pointer;
      transition: all var(--transition);
      color: var(--text);
      box-shadow: var(--shadow);
    }

    .theme-toggle:hover {
      transform: rotate(180deg);
    }

    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.75);
      display: grid;
      place-items: center;
      padding: 2rem;
      z-index: 50;
      backdrop-filter: blur(4px);
    }

    .modal-container {
      background: var(--surface);
      border-radius: var(--radius);
      width: min(90vw, 1200px);
      height: 90vh;
      overflow: hidden;
      box-shadow: var(--shadow);
    }

    .modal-header {
      padding: 1.5rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid rgb(0 0 0 / 0.1);
    }

    .modal-content {
      height: calc(100% - 4.5rem);
    }

    .modal-content iframe {
      width: 100%;
      height: 100%;
      border: none;
    }

    .close-button {
      background: transparent;
      border: none;
      width: 2.5rem;
      height: 2.5rem;
      border-radius: 9999px;
      cursor: pointer;
      display: grid;
      place-items: center;
      color: var(--text);
      transition: all var(--transition);
    }

    .close-button:hover {
      background: rgb(0 0 0 / 0.1);
    }

    @media (max-width: 768px) {
      .gradient-text {
        font-size: 2.5rem;
      }

      .solutions-header {
        padding: 3rem 1rem;
        clip-path: polygon(0 0, 100% 0, 100% 90%, 0 100%);
      }

      .subtitle {
        font-size: 1rem;
      }

      .solutions-grid {
        grid-template-columns: 1fr;
        padding: 1rem;
        gap: 1.5rem;
      }

      .card-media {
        height: 200px;
      }

      .card-actions {
        flex-direction: column;
      }

      .solutions-footer {
        flex-direction: column;
        padding: 1.5rem;
      }

      .finder-button, 
      .theme-toggle {
        width: 100%;
      }

      .search-bar {
        margin: 0 1rem;
      }

      .modal-container {
        width: 100vw;
        height: 100vh;
        border-radius: 0;
      }

      .stat-value {
        font-size: 1.25rem;
      }

      .stat-label {
        font-size: 0.75rem;
      }

      .card-title {
        font-size: 1.25rem;
      }

      .action-button {
        padding: 0.625rem 1rem;
        font-size: 0.875rem;
      }
    }

    @media (hover: none) {
      .solution-card:hover {
        transform: none;
      }

      .card-description,
      .card-actions {
        opacity: 1;
        transform: none;
      }

      .theme-toggle:hover {
        transform: none;
      }
    }
  `]
})
export class SolutionsComponent implements OnInit {
  activeCard: string | null = null;
  selectedSolution: string | null = null;
  modalTitle: string = '';
  pdfUrl: SafeResourceUrl | null = null;
  isTouchDevice: boolean = false;
  filteredSolutions: any[] = [];

  solutions = [
    {
      id: 'offgrid',
      title: 'Off Grid',
      description: 'Soluciones completas para independencia energética total. Ideal para propiedades sin acceso a la red eléctrica o que buscan autosuficiencia total.',
      image: '/offgrid.jpeg',
      storeUrl: 'https://tienda.rigelec.com.ar/?product_cat=b-aislados',
      pdf: '/pdfs/off-grid.pdf',
      stats: [
        { value: '100%', label: 'Autonomía' },
        { value: '24/7', label: 'Disponibilidad' },
        { value: '0', label: 'Facturas' },
        { value: '15+', label: 'Años de vida útil' }
      ]
    },
    {
      id: 'ongrid',
      title: 'On Grid',
      description: 'Reduce tu factura de luz manteniendo la conexión a la red. Solución perfecta para hogares y negocios que buscan ahorrar en costos energéticos.',
      image: '/ongrid.jpg',
      storeUrl: 'https://tienda.rigelec.com.ar/?product_cat=a-ahorro',
      pdf: '/pdfs/on-grid.pdf',
      stats: [
        { value: '80%', label: 'Ahorro' },
        { value: '4-6', label: 'Años para recuperar inversión' },
        { value: '0', label: 'Mantenimiento' },
        { value: '15+', label: 'Años de vida útil' }
      ]
    },
    {
      id: 'bombeo',
      title: 'Bombeo Solar',
      description: 'Sistemas de bombeo eficientes alimentados por energía solar. Perfecto para agricultura, riego y abastecimiento de agua en zonas rurales.',
      image: '/bombeo.jpg',
      storeUrl: 'https://tienda.rigelec.com.ar/?product_cat=e-bombeo',
      pdf: '/pdfs/bombeo.pdf',
      stats: [
        { value: '100%', label: 'Solar' },
        { value: '8h', label: 'Bombeo diario' },
        { value: '40m', label: 'Altura máx.' },
        { value: '15+', label: 'Años de vida útil' }
      ]
    }
  ];
  constructor(private sanitizer: DomSanitizer) {
    this.isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    this.filteredSolutions = this.solutions;
  }

  ngOnInit() {  }


  setActiveCard(id: string): void {
    this.activeCard = id;
  }

  clearActiveCard(): void {
    this.activeCard = null;
  }

  handleCardClick(id: string): void {
    if (this.isTouchDevice) {
      if (this.activeCard === id) {
        this.activeCard = null;
      } else {
        this.activeCard = id;
      }
    }
  }

  showStats(id: string): boolean {
    return this.activeCard === id;
  }

  showDescription(id: string): boolean {
    return !this.isTouchDevice || this.activeCard === id;
  }

  showActions(id: string): boolean {
    return !this.isTouchDevice || this.activeCard === id;
  }

  openDetails(id: string, event: Event): void {
    event.stopPropagation();
    const solution = this.solutions.find(s => s.id === id);
    if (solution) {
      this.selectedSolution = id;
      this.modalTitle = solution.title;
      this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(solution.pdf);
    }
  }

  @HostListener('window:keydown.escape')
  closeModal(): void {
    this.selectedSolution = null;
    this.pdfUrl = null;
  }



  @ViewChild('finder') finderElement!: ElementRef;

  onSolutionFinderClick(): void {
    if (this.finderElement) {
      this.finderElement.nativeElement.scrollIntoView({ behavior: 'smooth' });
    }
  }

}