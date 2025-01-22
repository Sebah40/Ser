import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-servicios',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  template: `
    <div class="servicios-container">
    <app-navbar></app-navbar>
    &nbsp;
      <div class="header-section">
        <h1>Nuestros Servicios</h1>
        <p class="subtitle">
          SER junto a RIGELEC SRL ofrece soluciones energéticas integrales, 
          asegurando calidad y eficiencia en cada proyecto.
        </p>
      </div>

      <!-- Main Services Grid -->
      <div class="services-grid">
        <!-- Asesoramiento Section -->
        <div class="service-card">
          <div class="icon-container">
            <i class="fas fa-lightbulb"></i>
          </div>
          <h2>Asesoramiento Energético</h2>
          <p>
            Optimizamos tu consumo energético mediante un análisis detallado 
            y recomendaciones personalizadas.
          </p>
          <ul class="benefits-list">
            <li>
              <i class="fas fa-check"></i>
              <span>Auditoría energética completa</span>
            </li>
            <li>
              <i class="fas fa-check"></i>
              <span>Análisis de patrones de consumo</span>
            </li>
            <li>
              <i class="fas fa-check"></i>
              <span>Recomendaciones de eficiencia</span>
            </li>
            <li>
              <i class="fas fa-check"></i>
              <span>Proyecciones de ahorro</span>
            </li>
          </ul>
        </div>

        <!-- Instalación Section -->
        <div class="service-card">
          <div class="icon-container">
            <i class="fas fa-solar-panel"></i>
          </div>
          <h2>Instalación y Venta</h2>
          <p>
            Suministro e instalación profesional de sistemas solares 
            adaptados a tus necesidades específicas.
          </p>
          <ul class="benefits-list">
            <li>
              <i class="fas fa-check"></i>
              <span>Sistemas on-grid y off-grid</span>
            </li>
            <li>
              <i class="fas fa-check"></i>
              <span>Sistemas de bombeo solar</span>
            </li>
            <li>
              <i class="fas fa-check"></i>
              <span>Instalación certificada</span>
            </li>
            <li>
              <i class="fas fa-check"></i>
              <span>Garantía de calidad</span>
            </li>
          </ul>
        </div>

        <!-- Post-venta Section -->
        <div class="service-card">
          <div class="icon-container">
            <i class="fas fa-wrench"></i>
          </div>
          <h2>Mantenimiento y Post-venta</h2>
          <p>
            Servicio completo de mantenimiento y soporte técnico para 
            asegurar el óptimo funcionamiento de tu sistema.
          </p>
          <ul class="benefits-list">
            <li>
              <i class="fas fa-check"></i>
              <span>Mantenimiento preventivo</span>
            </li>
            <li>
              <i class="fas fa-check"></i>
              <span>Soporte técnico</span>
            </li>
            <li>
              <i class="fas fa-check"></i>
              <span>Monitoreo de rendimiento</span>
            </li>
            <li>
              <i class="fas fa-check"></i>
              <span>Servicios de emergencia</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- Process Timeline -->
      <div class="process-section">
        <h2>Nuestro Proceso de Trabajo</h2>
        <div class="timeline">
          <div class="timeline-item">
            <div class="timeline-icon">
              <i class="fas fa-comments"></i>
            </div>
            <h3>Consulta Inicial</h3>
            <p>Evaluamos tus necesidades y objetivos energéticos</p>
          </div>
          <div class="timeline-item">
            <div class="timeline-icon">
              <i class="fas fa-chart-line"></i>
            </div>
            <h3>Análisis Técnico</h3>
            <p>Diseñamos la solución óptima para tu caso</p>
          </div>
          <div class="timeline-item">
            <div class="timeline-icon">
              <i class="fas fa-file-signature"></i>
            </div>
            <h3>Propuesta</h3>
            <p>Presentamos las mejores opciones para tu proyecto</p>
          </div>
          <div class="timeline-item">
            <div class="timeline-icon">
              <i class="fas fa-tools"></i>
            </div>
            <h3>Implementación</h3>
            <p>Instalación profesional con los más altos estándares</p>
          </div>
          <div class="timeline-item">
            <div class="timeline-icon">
              <i class="fas fa-shield-alt"></i>
            </div>
            <h3>Seguimiento</h3>
            <p>Soporte continuo y mantenimiento preventivo</p>
          </div>
        </div>
      </div>

      <!-- CTA Section -->
      <div class="cta-section">
        <h2>¿Listo para optimizar tu consumo energético?</h2>
        <p>
          Contáctanos para una consulta gratuita y descubre cómo podemos 
          ayudarte a alcanzar la eficiencia energética que buscas.
        </p>
        <button class="primary-button" (click)="scrollToContacto()">
  <i class="fas fa-paper-plane"></i>
  <span>Solicitar Asesoramiento</span>
</button>

      </div>
    </div>
  `,
  styles: [`
    .servicios-container {
  width: 100%;
  min-height: 90vh;
  padding: 4rem 2rem;
  background: linear-gradient(
    180deg, 
    rgba(12, 69, 122, 0.97) 0%,
    rgba(26, 110, 184, 0.95) 35%,
    rgba(64, 145, 208, 0.93) 65%,
    rgba(127, 203, 200, 0.95) 100%
  ),
  url('/about.jpg') center center;
  background-attachment: fixed;
  background-size: cover;
  color: white;
  position: relative;
  overflow: hidden;
}

    .header-section {
      text-align: center;
      max-width: 800px;
      margin: 0 auto 4rem;
    }

    .header-section h1 {
      font-size: clamp(2.5rem, 5vw, 4rem);
      font-weight: 800;
      margin-bottom: 1.5rem;
      background: linear-gradient(135deg, #ffffff 0%, #e0e7ff 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .subtitle {
      font-size: 1.2rem;
      opacity: 0.9;
    }

    .services-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
      margin: 4rem 0;
    }

    .service-card {
      background: rgba(255, 255, 255, 0.95);
      padding: 2rem;
      border-radius: 1rem;
      color: #0c457a;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .service-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
    }

    .icon-container {
      width: 60px;
      height: 60px;
      background: #0c457a;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 1.5rem;
    }

    .icon-container i {
      font-size: 1.5rem;
      color: white;
    }

    .service-card h2 {
      font-size: 1.5rem;
      margin-bottom: 1rem;
      color: #0c457a;
    }

    .benefits-list {
      list-style: none;
      padding: 0;
      margin-top: 1.5rem;
    }

    .benefits-list li {
      display: flex;
      align-items: center;
      margin-bottom: 0.75rem;
      color: #4a5568;
    }

    .benefits-list i {
      color: #0c457a;
      margin-right: 0.5rem;
    }

    .process-section {
      max-width: 1000px;
      margin: 4rem auto;
      padding: 2rem;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 1rem;
      backdrop-filter: blur(10px);
    }

    .process-section h2 {
      text-align: center;
      margin-bottom: 3rem;
      font-size: 2rem;
    }

    .timeline {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 2rem;
      position: relative;
    }

    .timeline-item {
      text-align: center;
      position: relative;
    }

    .timeline-icon {
      width: 50px;
      height: 50px;
      background: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1rem;
      color: #0c457a;
    }

    .timeline-item h3 {
      font-size: 1.2rem;
      margin-bottom: 0.5rem;
    }

    .cta-section {
      text-align: center;
      max-width: 800px;
      margin: 4rem auto;
      padding: 3rem;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 1rem;
      backdrop-filter: blur(10px);
    }

    .cta-section h2 {
      font-size: 2rem;
      margin-bottom: 1.5rem;
    }

    .primary-button {
      background: linear-gradient(135deg, #0c457a, #2563eb);
      color: white;
      padding: 1rem 2rem;
      border-radius: 1rem;
      font-weight: 600;
      border: none;
      cursor: pointer;
      transition: all 0.3s ease;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      margin-top: 1.5rem;
    }

    .primary-button:hover {
      transform: translateY(-3px);
      box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
    }

    @media (max-width: 768px) {
      .servicios-container {
        padding: 2rem 1rem;
      }

      .services-grid {
        grid-template-columns: 1fr;
      }

      .timeline {
        grid-template-columns: 1fr;
      }

      .service-card {
        padding: 1.5rem;
      }
    }
    .primary-button {
  background: linear-gradient(135deg, #0c457a, #2563eb);
  color: white;
  padding: 1rem 2.5rem;
  border-radius: 1rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  position: relative;
  overflow: hidden;
  font-size: 1.1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.primary-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.2),
    transparent
  );
  transition: left 0.5s ease;
}

.primary-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 20px rgba(12, 69, 122, 0.2);
}

.primary-button:hover::before {
  left: 100%;
}

.primary-button:active {
  transform: translateY(-1px);
  box-shadow: 0 5px 10px rgba(12, 69, 122, 0.2);
}

.primary-button i {
  font-size: 1.2rem;
}
  `]
})
export class ServiciosComponent {
  scrollToContacto(): void {
    const contactoSection = document.getElementById('contacto');
    if (contactoSection) {
      contactoSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  }
}