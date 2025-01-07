import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="hero-container">
      <div class="overlay"></div>
      <div class="content-container">
        <div class="text-container fade-in">
          <h1 class="hero-title">{{ hero.title }}</h1>
          <h2 class="hero-subtitle">{{ hero.subtitle }}</h2>
          <button
            class="cta-button fade-in"
            style="animation-delay: 0.3s;"
            (click)="scrollToContacto()"
          >
            Contáctanos
          </button>
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      .hero-container {
        min-height: 100vh;
        height: 100vh;
        width: 100%;
        position: relative;
        background: url('/background.jpg') center center;
        background-attachment: fixed;
        background-size: cover;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
      }

      .overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(
          135deg,
          rgba(255, 255, 255, 0.27) 0%,
          rgba(0, 0, 0, 0.3) 50%
        );
        z-index: 1;
      }

      .content-container {
        max-width: 1200px;
        width: 100%;
        padding: 0 2rem;
        position: relative;
        z-index: 2;
      }

      .text-container {
        text-align: center;
        color: white;
        max-width: 800px;
        margin: 0 auto;
      }

      .hero-title {
        font-size: 4rem;
        font-weight: 800;
        margin-bottom: 1.5rem;
        letter-spacing: -0.02em;
        line-height: 1.2;
        text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.3);
      }

      .hero-subtitle {
        font-size: 1.5rem;
        font-weight: 400;
        line-height: 1.6;
        margin-bottom: 2rem;
        opacity: 0.9;
      }

      .cta-button {
        background:#0c457a;
        color: white;
        border: none;
        padding: 1rem 2.5rem;
        font-size: 1.1rem;
        font-weight: 600;
        border-radius: 50px;
        cursor: pointer;
        transition: transform 0.3s ease, box-shadow 0.3s ease;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      }

      .cta-button:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
      }

      .fade-in {
        animation: fadeIn 1s ease-out forwards;
        opacity: 0;
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      @media (max-width: 768px) {
        .hero-title {
          font-size: 2.5rem;
        }

        .hero-subtitle {
          font-size: 1.2rem;
        }

        .content-container {
          padding: 0 1rem;
        }
      }
    `,
  ],
})
export class HeroComponent {
  hero = {
    title: 'Soluciones en Energías Renovables',
    subtitle:
      'Somos una empresa especializada en instalación de paneles solares y energía renovable. ¡Transformamos tu energía hacia un futuro más sostenible!',
  };
  scrollToContacto() {
    const contactoSection = document.querySelector('#contacto');
    if (contactoSection) {
      contactoSection.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
