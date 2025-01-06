import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="about-section">
      <div class="overlay"></div>
      <div class="content-container">
        <!-- Main Content -->
        <div class="text-content" [class.visible]="isVisible">
          <h2 class="title">Sobre nosotros</h2>
          <div class="divider"></div>
          <p class="description">
            Ofrecemos soluciones personalizadas que se adaptan a las necesidades
            únicas de cada cliente. Nuestro enfoque personalizado y equipo
            experto garantiza resultados excepcionales que superan las
            expectativas. Trabajamos estrechamente contigo para impulsar tu
            éxito con soluciones efectivas y eficientes.
          </p>

          <!-- Modal Component HTML -->
          <div
            class="modal-overlay"
            *ngIf="isModalVisible"
            (click)="closeModal()"
          >
            <div class="modal-content" (click)="$event.stopPropagation()">
              <button class="close-btn" (click)="closeModal()">×</button>
              <h2 class="modal-title">VALORES</h2>
              <div class="modal-body">
                <p>
                  <strong>Sostenibilidad:</strong> Nos comprometemos a la
                  promoción y desarrollo de soluciones energéticas sostenibles y
                  respetuosas con el medio ambiente.
                </p>
                <p>
                  <strong>Responsabilidad:</strong> Participando y colaborando
                  en las acciones comunitarias que contribuyan a cuidar el
                  planeta.
                </p>
                <p>
                  <strong>Innovación:</strong> Buscando constantemente
                  soluciones innovadoras y desarrollo de tecnologías más
                  eficientes y rentables.
                </p>
                <p>
                  <strong>Calidad:</strong> Nos comprometemos a la entrega de
                  productos y servicios de alta calidad, garantizando la
                  satisfacción del cliente y la durabilidad de las soluciones
                  implementadas.
                </p>
                <p>
                  <strong>Confianza:</strong> Buscamos construir relaciones
                  sólidas con los clientes, basadas en la confianza y la
                  integridad en todas las interacciones.
                </p>
                <p>
                  <strong>Colaboración:</strong> Mediante la búsqueda de
                  alianzas estratégicas con otros actores del sector para
                  promover el crecimiento y la adopción de energía solar
                  fotovoltaica.
                </p>
                <p>
                  <strong>Educación y divulgación:</strong> Mediante la
                  promoción de la conciencia y el conocimiento sobre la energía
                  solar fotovoltaica, ofreciendo programas de educación y
                  divulgación para clientes y la comunidad en general.
                </p>
                <p>
                  <strong>Ética:</strong> Actuando con integridad y ética en
                  todas nuestras actividades comerciales, prevaleciendo el
                  respeto hacia las partes interesadas.
                </p>
              </div>
            </div>
          </div>

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

          <button class="learn-more-btn" (click)="openModal()">
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
          </button>
        </div>

        <!-- Feature Cards -->
        <div class="features-container" [class.visible]="isVisible">
          <div class="feature-card" *ngFor="let feature of features">
            <div class="feature-icon" [innerHTML]="feature.icon"></div>
            <h3 class="feature-title">{{ feature.title }}</h3>
            <p class="feature-description">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [
    `
    html, body {
    height: 100%;
    margin: 0;
    scroll-snap-type: y mandatory;
    overflow-y: scroll;
}

.about-section {
    position: relative;
    min-height: 100vh;  /* Keeps the section at least the height of the viewport */
    height: auto;       /* Allow the section to grow naturally based on content */
    width: 100%;
    background: url('/about.jpg') center center;
    background-attachment: fixed;
    background-size: cover;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    margin-bottom: 5vh;  /* Adds space between this section and the next */
    scroll-snap-align: start;  /* Ensures the section aligns correctly when scrolling */
}

@media (max-width: 900px) {
    .about-section {
        min-height: 80vh;  /* Reduces the height on smaller screens */
        padding: 2rem;     /* Adds padding to prevent text from touching the edges */
        background-position: center center;
        margin-bottom: 4vh;  /* Slightly reduced margin for smaller screens */
    }
}

@media (max-width: 600px) {
    .about-section {
        padding: 1rem;  /* Reduces padding for very small screens */
        margin-bottom: 4vh;  /* Consistent margin for very small screens */
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
        rgba(0, 0, 0, 0.8) 0%,
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
    `,
  ],
})
export class AboutComponent implements OnInit {
  isVisible = false;
  activeTab = 'vision';
  tabContentVisible = false;
  isModalVisible = false;
  stats = [
    { value: '100+', label: 'Clientes Satisfechos' },
    { value: '10+', label: 'Años de Experiencia' },
  ];

  tabs = [
    {
      id: 'vision',
      title: 'Nuestra Visión',
      content:
        'Aspiramos a ser líderes en la zona en soluciones innovadoras, transformando desafíos en oportunidades.',
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

  constructor() {
    // Initialize tab content visibility after a short delay
    setTimeout(() => {
      this.tabContentVisible = true;
    }, 400);
  }

  ngOnInit() {
    setTimeout(() => {
      this.isVisible = true;
    }, 100);
  }

  ngOnDestroy() {
    // Clear any existing timeouts if component is destroyed
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