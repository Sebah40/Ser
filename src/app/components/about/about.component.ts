import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { switchMap } from 'rxjs/operators';
import { interval, Subscription } from 'rxjs';

interface Feature {
  icon: string;
  title: string;
  description: string;
}

interface GrowattData {
  eTotal: number;
  pac: number;
  eToday: number;
}

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="about-section">
      <div class="overlay"></div>
      <div class="content-container">
        <div class="two-column-layout">
          <!-- Main Content Column -->
          <div class="main-column">
            <div class="text-content" [class.visible]="isVisible">
              <h2 class="title">Sobre nosotros</h2>
              <div class="divider"></div>
              <p class="description">
                Brindamos asesoría, consultoría e instalación de soluciones con el
                propósito de proporcionar servicios enfocados en eficiencia
                energética, reducción de consumo y aprovechamiento óptimo de la
                energía.
              </p>

              <!-- Stats Section -->
              <div class="stats-container">
                <div class="stat-item" *ngFor="let stat of stats">
                  <div class="stat-value">{{ stat.value }}</div>
                  <div class="stat-label">{{ stat.label }}</div>
                </div>
              </div>

              <!-- Tabs Section -->
              <div class="tabs-container">
                <div class="tabs-header">
                  <button
                    *ngFor="let tab of tabs"
                    class="tab-button"
                    [class.active]="activeTab === tab.id"
                    (click)="setActiveTab(tab.id)"
                  >
                    {{ tab.title }}
                  </button>
                </div>
                <div class="tab-content" [class.visible]="tabContentVisible">
                  <h3>{{ getCurrentTab().title }}</h3>
                  <p>{{ getCurrentTab().content }}</p>
                </div>
              </div>

              <!-- <button class="learn-more-btn" (click)="openModal()">
                Nuestros valores
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="arrow-icon"
                >
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </button> -->
            </div>
          </div>

          <!-- Energy Stats Column -->
          <div class="energy-stats-column">
            <!-- Energy Impact Stats -->
            <div class="energy-stats-container" *ngIf="!isLoading">
              <div class="energy-stat-card">
                <div class="stat-icon">
                  <i class="fas fa-bolt"></i>
                </div>
                <div class="stat-content">
                  <h3>Energía total generada</h3>
                  <div class="stat-value1">202 MWh</div>
                </div>
              </div>

              <div class="energy-stat-card">
                <div class="stat-icon">
                  <i class="fas fa-leaf"></i>
                </div>
                <div class="stat-content">
                  <h3>Reducción de CO2</h3>
                  <div class="stat-value1">
                    83000 Kg
                  </div>
                </div>
              </div>

              <div class="energy-stat-card">
                <div class="stat-icon">
                  <i class="fas fa-tree"></i>
                </div>
                <div class="stat-content">
                  <h3>Árboles Salvados</h3>
                  <div class="stat-value1">
                    11100 Árboles
                  </div>
                </div>
              </div>

              <div class="energy-stat-card">
                <div class="stat-icon">
                  <i class="fas fa-sun"></i>
                </div>
                <div class="stat-content">
                  <h3>Energía diaria</h3>
                  <div class="stat-value1">750 kWh</div>
                </div>
              </div>
            </div>

            <!-- Loading indicator for energy stats -->
            <div *ngIf="isLoading" class="loading-container">
              <div class="loader"></div>
            </div>
          </div>
        </div>

        <!-- Feature Cards -->
        <div class="features-container" [class.visible]="isVisible">
          <div class="feature-card" *ngFor="let feature of features">
            <div class="feature-icon" [innerHTML]="feature.icon"></div>
            <h3 class="feature-title">{{ feature.title }}</h3>
            <p class="feature-description">{{ feature.description }}</p>
          </div>
        </div>

        <!-- Modal Component -->
        <div class="modal-overlay" *ngIf="isModalVisible" (click)="closeModal()">
          <!-- Modal content remains the same -->
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      html,
      body {
        height: 100%;
        margin: 0;
        scroll-snap-type: y mandatory;
        overflow-y: scroll;
      }

      .two-column-layout {
      display: flex;
      gap: 2rem;
      margin-bottom: 2rem;
    }

    .main-column {
      flex: 1;
      min-width: 0; /* Prevents flex item from overflowing */
    }
    .energy-stats-column {
      width: 400px;
      padding-top: 3.5rem; /* Aligns with main content after title */
    }

      .about-section {
        position: relative;
        min-height: 100vh; /* Keeps the section at least the height of the viewport */
        height: auto; /* Allow the section to grow naturally based on content */
        width: 100%;
        background: url('/about.jpg') center center;
        background-attachment: fixed;
        background-size: cover;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        margin-bottom: 5vh; /* Adds space between this section and the next */
        scroll-snap-align: start; /* Ensures the section aligns correctly when scrolling */
      }

      @media (max-width: 900px) {
        .about-section {
          min-height: 80vh; /* Reduces the height on smaller screens */
          padding: 2rem; /* Adds padding to prevent text from touching the edges */
          background-position: center center;
          margin-bottom: 4vh; /* Slightly reduced margin for smaller screens */
        }
      }

      @media (max-width: 600px) {
        .about-section {
          padding: 1rem; /* Reduces padding for very small screens */
          margin-bottom: 4vh; /* Consistent margin for very small screens */
        }
      }

      .overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(
          135deg,
          rgba(255, 255, 255, 0.28) 0%,
          rgba(0, 0, 0, 0.6) 100%
        );
      }

      .content-container {
        position: relative;
        z-index: 2;
        max-width: 1200px;
        width: 100%;
        padding: 4rem 2rem;
        display: flex;
        flex-direction: column;
        gap: 3rem;
      }

      .text-content {
        max-width: 700px;
        background: rgba(255, 255, 255, 0.95);
        padding: 3rem;
        border-radius: 1rem;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
      }

      .text-content.visible {
        opacity: 1;
        transform: translateY(0);
      }

      .title {
        font-size: 2.5rem;
        color: #0c457a;
        margin-bottom: 1.5rem;
        font-weight: 700;
      }

      .divider {
        width: 60px;
        height: 4px;
        background: #4caf50;
        margin-bottom: 1.5rem;
        border-radius: 2px;
        transition: width 0.6s ease;
      }

      .text-content:hover .divider {
        width: 100px;
      }

      .description {
        font-size: 1.1rem;
        line-height: 1.8;
        color: #444;
        margin-bottom: 2rem;
      }

      /* Stats Styles */
      .stats-container {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 1.5rem;
        margin: 2rem 0;
      }

      .stat-item {
        text-align: center;
        padding: 1.5rem;
        background: rgba(12, 69, 122, 0.1);
        border-radius: 0.5rem;
        transition: transform 0.3s ease;
      }

      .stat-item:hover {
        transform: translateY(-5px);
      }

      .stat-value {
        font-size: 1.8rem;
        font-weight: 700;
        color: #0c457a;
        margin-bottom: 0.5rem;
      }
      .stat-value1 {
        font-size: 1.8rem;
        font-weight: 700;
        color:rgb(255, 255, 255);
        margin-bottom: 0.5rem;
      }


      .stat-label {
        font-size: 0.9rem;
        color: #666;
      }

      /* Tabs Styles */
      .tabs-container {
        margin: 2rem 0;
      }

      .tabs-header {
        display: flex;
        gap: 1rem;
        margin-bottom: 1rem;
      }

      .tab-button {
        padding: 0.75rem 1.5rem;
        border: none;
        background: rgba(12, 69, 122, 0.1);
        color: #0c457a;
        border-radius: 2rem;
        cursor: pointer;
        transition: all 0.3s ease;
      }

      .tab-button.active {
        background: #0c457a;
        color: white;
      }

      .tab-content {
        background: rgba(12, 69, 122, 0.05);
        padding: 1.5rem;
        border-radius: 1rem;
        opacity: 0;
        transform: translateY(10px);
        transition: all 0.3s ease;
      }

      .tab-content.visible {
        opacity: 1;
        transform: translateY(0);
      }

      .tab-content h3 {
        color: #0c457a;
        margin-bottom: 1rem;
        font-size: 1.3rem;
      }

      /* Modal Styles */
      .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
      }

      .modal-content {
        background: white;
        padding: 2rem;
        border-radius: 8px;
        max-width: 800px;
        width: 90%;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        overflow-y: auto;
      }

      .close-btn {
        background: none;
        border: none;
        font-size: 2rem;
        color: #0c457a;
        position: absolute;
        top: 1rem;
        right: 1rem;
        cursor: pointer;
      }

      .modal-title {
        font-size: 2rem;
        color: #0c457a;
        margin-bottom: 1rem;
        font-weight: bold;
      }

      .modal-body {
        font-size: 1rem;
        line-height: 1.6;
        color: #333;
      }

      .modal-body p {
        margin-bottom: 1rem;
      }

      .modal-body strong {
        color: #0c457a;
      }

      /* Feature Cards */
      .features-container {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 2rem;
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
      }

      .features-container.visible {
        opacity: 1;
        transform: translateY(0);
      }

      .feature-card {
        background: rgba(255, 255, 255, 0.95);
        padding: 2rem;
        border-radius: 1rem;
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
        transition: transform 0.3s ease;
      }

      .feature-card:hover {
        transform: translateY(-5px);
      }

      .feature-icon {
        color: #0c457a;
        margin-bottom: 1rem;
      }

      .feature-title {
        font-size: 1.3rem;
        color: #0c457a;
        margin-bottom: 1rem;
      }

      .feature-description {
        color: #666;
        margin-bottom: 1.5rem;
        line-height: 1.6;
      }

      .feature-btn {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        color: #0c457a;
        font-weight: 600;
        border: none;
        background: none;
        padding: 0;
        cursor: pointer;
        transition: gap 0.3s ease;
      }

      .feature-btn:hover {
        gap: 0.75rem;
      }

      .learn-more-btn {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        background: #0c457a;
        color: white;
        border: none;
        padding: 1rem 2rem;
        font-size: 1.1rem;
        font-weight: 600;
        border-radius: 50px;
        cursor: pointer;
        transition: all 0.3s ease;
      }

      .learn-more-btn:hover {
        background: #0d5499;
        transform: translateY(-2px);
      }

      .learn-more-btn:hover .arrow-icon {
        transform: translateX(5px);
      }

      .arrow-icon {
        transition: transform 0.3s ease;
      }

      /* Responsive adjustments */
    @media (max-width: 1200px) {
      .two-column-layout {
        flex-direction: column;
      }

      .energy-stats-column {
        width: 100%;
        padding-top: 0;
      }

      .energy-stats-container {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1rem;
      }
    }

      @media (max-width: 768px) {
        .content-container {
          padding: 2rem 1rem;
        }

        .text-content {
          padding: 2rem;
        }

        .title {
          font-size: 2rem;
        }

        .description {
          font-size: 1rem;
        }

        .stats-container {
          grid-template-columns: repeat(2, 1fr);
        }

        .tabs-header {
          flex-wrap: wrap;
        }

        .features-container {
          grid-template-columns: 1fr;
        }
      }
      .energy-stats-container {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .energy-stat-card {
      background: linear-gradient(135deg, #0c457a 0%, #1a6eb8 100%);
      padding: 1.5rem;
      border-radius: 1rem;
      color: white;
      display: flex;
      align-items: center;
      gap: 1rem;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .energy-stat-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 20px rgba(12, 69, 122, 0.2);
    }

      .stat-icon {
        background: rgba(255, 255, 255, 0.2);
        width: 50px;
        height: 50px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.5rem;
      }

      .stat-content {
        flex: 1;
      }

      .stat-content h3 {
        font-size: 0.9rem;
        margin: 0 0 0.5rem 0;
        opacity: 0.9;
      }

      .stat-value {
        font-size: 1.4rem;
        font-weight: 700;
      }

      .loading-container {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 200px;
      }

      .loader {
        width: 40px;
        height: 40px;
        border: 4px solid rgba(12, 69, 122, 0.1);
        border-left-color: #0c457a;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }

      @keyframes spin {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }

      @media (max-width: 768px) {
        .energy-stats-container {
        grid-template-columns: 1fr;
      }

        .energy-stat-card {
          padding: 1rem;
        }

        .stat-value {
          font-size: 1.2rem;
        }
      }
    `,
  ],
})
export class AboutComponent implements OnInit {
  isVisible = false;
  activeTab = 'vision';
  tabContentVisible = false;
  isModalVisible = false;
  isLoading = true;

  private dataSubscription?: Subscription;
  stats = [
    { value: '+500 kW', label: 'Paneles solares instalados' },
    { value: '+100 kWh', label: 'Baterías para sistemas aislados en el campo' },
  ];

  growattData: GrowattData = {
    eTotal: 0,
    pac: 0,
    eToday: 0,
  };

  tabs = [
    {
      id: 'vision',
      title: '¿Quienes somos?',
      content:
        'SER es una compañía del grupo RIGELEC, dedicada a ofrecer servicios de asesoría, consultoría e instalación de soluciones vinculadas a la eficiencia energética, ahorro de energía y uso responsable de los recursos energéticos. Fundada en 2017 como Rigelec Renovables, en 2021 decidimos constituir SER como una unidad independiente, con el fin de proporcionar a nuestros clientes una gama más amplia y mejorada de soluciones.',
    },
    {
      id: 'mission',
      title: 'Nuestra Misión',
      content:
        'Empoderar a los clientes con soluciones tecnológicas de vanguardia que impulsen su crecimiento.',
    },
  ];

  features = [
    {
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>`,
      title: 'Equipo Experto',
      description:
        'Profesionales altamente cualificados con experiencia en diversas industrias.',
    },
    {
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>`,
      title: 'Soluciones Precisas',
      description:
        'Estrategias personalizadas que se alinean perfectamente con tus objetivos.',
    },
    {
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>`,
      title: 'Resultados Rápidos',
      description:
        'Implementación ágil y eficiente para maximizar tu retorno de inversión.',
    },
  ];

  constructor(private http: HttpClient) {
    // Initialize tab content visibility after a short delay
    setTimeout(() => {
      this.tabContentVisible = true;
    }, 400);
  }

  ngOnInit() {
    setTimeout(() => {
      this.isVisible = true;
    }, 100);
    this.fetchData();
    this.startDataPolling();
  }

  ngOnDestroy() {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }
  private fetchData() {
    this.http.get<GrowattData>('/api/growatt').subscribe({
      next: (data) => {
        this.growattData = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching Growatt data:', error);
        this.isLoading = false;
      },
    });
  }

  private startDataPolling() {
    this.dataSubscription = interval(60000)
      .pipe(switchMap(() => this.http.get<GrowattData>('/api/growatt')))
      .subscribe({
        next: (data) => {
          this.growattData = data;
        },
        error: (error) => {
          console.error('Error polling Growatt data:', error);
        },
      });
  }

  setActiveTab(tabId: string) {
    this.tabContentVisible = false;
    setTimeout(() => {
      this.activeTab = tabId;
      this.tabContentVisible = true;
    }, 300);
  }

  getCurrentTab() {
    return this.tabs.find((tab) => tab.id === this.activeTab) || this.tabs[0];
  }

  onFeatureClick(feature: any) {
    console.log('Feature clicked:', feature.title);
    // Add your navigation or modal logic here
  }

  onLearnMoreClick() {
    console.log('Learn more clicked');
    // Add your navigation or modal logic here
  }

  scrollIntoView(elementRef: any) {
    elementRef.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  openModal() {
    this.isModalVisible = true;
  }

  closeModal() {
    this.isModalVisible = false;
  }
}
