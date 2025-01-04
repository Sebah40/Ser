import { Component } from '@angular/core'; 

@Component({
  selector: 'app-hero',
  template: `
    <section class="hero-container">
      <div class="grid-container">
        <div class="video-container">
          <div class="fade-in" style="animation-delay: 0.1s;">
            <video class="hero-video" autoplay muted loop>
              <source src="./hero.mp4" type="video/mp4" />
            </video>
          </div>
          <div class="fade-in" style="animation-delay: 0.2s;">
            <video class="hero-video" autoplay muted loop>
              <source src="./hero2.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
        <div class="text-container">
          <h1 class="hero-title">{{ hero.title }}</h1>
          <h2 class="hero-subtitle">{{ hero.subtitle }}</h2>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .hero-container {
      background: linear-gradient(to bottom right, #4a90e2,rgb(193, 218, 243)); /* Bluish gradient */
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
    }

    .grid-container {
      display: grid;
      grid-template-columns: 1fr 1fr;
      max-width: 1200px;
      margin: 0 auto;
      gap: 2rem;
      padding: 0 1rem;
      align-items: center;
      justify-items: center;
      position: relative;
      z-index: 1; /* Ensure grid content stays above the overlay */
    }

    .video-container {
      display: flex;
      justify-content: space-between;
      flex-direction: column;
      align-items: center;
      position: relative;
      width: 100%;
    }

    .hero-video {
      border-radius: 15px;
      box-shadow: 0 10px 20px rgba(255, 255, 255, 0.1);
      width: 100%; /* Full width */
      height: 35vh; /* 60% of the viewport height */
      object-fit: cover;
    }
    .text-container {
      text-align: center;
      color: white;
      text-shadow: 2px 2px 10px rgba(166, 160, 192, 0);
    }
    .hero-title {
      font-size: 3rem;
      font-weight: 700;
      text-transform: uppercase;
    }

    .hero-subtitle {
      font-size: 1.5rem;
      font-weight: 600;
      margin-top: 1rem;
    }

    .fade-in {
      animation: fadeIn 1s ease-in-out forwards;
    }

    @keyframes fadeIn {
      0% {
        opacity: 0;
        transform: translateY(20px);
      }
      100% {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @media (max-width: 768px) {
      .grid-container {
        grid-template-columns: 1fr;
      }
      .hero-title {
        font-size: 2rem;
      }
      .hero-subtitle {
        font-size: 1rem;
      }
      .hero-video {
        height: 20vh;
      }
    }
  `]
})
export class HeroComponent {
  hero = {
    title: "Soluciones en Energías Renovables",
    subtitle: "Somos una empresa especializada en instalación de paneles solares y energía renovable. ¡Transformamos tu energía hacia un futuro más sostenible!",
  };
}
