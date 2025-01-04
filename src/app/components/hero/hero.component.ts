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
      background: linear-gradient(to bottom right, #6C9E72, transparent);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
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
    }
    .video-container {
      display: flex;
      justify-content: space-between;
      flex-direction: column;
      align-items: center;
    }
    .hero-video {
      border-radius: 15px;
      box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
      max-height: 20vh;
      object-fit: cover;
    }
    .text-container {
      text-align: center;
    }
    .hero-title {
      font-size: 2.5rem;
      font-weight: 700;
      color: white;
      text-transform: uppercase;
    }
    .hero-subtitle {
      font-size: 1.2rem;
      font-weight: 600;
      color: white;
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
    }
  `]
})
export class HeroComponent {
  hero = {
    title: "Soluciones en Energías Renovables",
    subtitle: "Somos una empresa especializada en instalación de paneles solares y energía renovable. ¡Transformamos tu energía hacia un futuro más sostenible!",
  };
}
