import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="about-section">
      <div class="overlay"></div>
      <div class="content-container">
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
          <button class="learn-more-btn">
            Conoce más
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
      </div>
    </section>
  `,
  styles: [
    `
      .about-section {
        position: relative;
        min-height: 100vh;
        height: 100vh;
        width: 100%;
        background: url('/about.jpg') center center;
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
      }
    `,
  ],
})
export class AboutComponent implements OnInit {
  isVisible = false;

  ngOnInit() {
    // Add a small delay to ensure the animation is visible
    setTimeout(() => {
      this.isVisible = true;
    }, 100);
  }
}
