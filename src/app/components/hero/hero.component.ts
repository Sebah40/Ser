import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="hero-container" [style.background-image]="'url(' + currentImage + ')'">
      <!-- Navigation Arrows -->
      <button class="nav-button left" (click)="previousImage()">
        <i class="fas fa-chevron-left"></i>
      </button>
      <button class="nav-button right" (click)="nextImage()">
        <i class="fas fa-chevron-right"></i>
      </button>

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
        
        <!-- Carousel Indicators -->
        <div class="carousel-indicators">
          <button 
            *ngFor="let image of images; let i = index" 
            class="indicator"
            [class.active]="i === currentIndex"
            (click)="setImage(i)"
          ></button>
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
      background-attachment: fixed;
      background-size: cover;
      background-position: center center;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      transition: background-image 1s ease-in-out;
    }

    .nav-button:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.6);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
  transform: translateY(-50%) scale(1.05);
}

    .nav-button.left {
      left: 20px;
    }

    .nav-button.right {
      right: 20px;
    }

    /* Carousel Indicators */
    .carousel-indicators {
  position: relative;
  display: flex;
  gap: 10px;
  z-index: 3;
  padding: 15px;
  margin-top: auto;
  justify-content: center;  /* Center horizontally */
  align-items: center;      /* Center vertically */
}

    .indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  border: 2px solid rgba(255, 255, 255, 0.7);
  cursor: pointer;
  transition: all 0.3s ease;
  margin: 0 5px;  /* Add horizontal spacing between indicators */
}
.indicator.active {
  background: white;
  transform: scale(1.2);
  border-color: white;
}
.nav-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(4px);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.4);
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 3;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  overflow: hidden;
}
    .indicator.active {
      background: white;
      transform: scale(1.2);
    }

    @media (max-width: 768px) {
      .nav-button {
        width: 40px;
        height: 40px;
      }

      .nav-button.left {
        left: 10px;
      }

      .nav-button.right {
        right: 10px;
      }

      .indicator {
        width: 8px;
        height: 8px;
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
    subtitle: 'Desarrollamos soluciones con energía solar para el hogar, la industria y el campo argentino desde 2015',
  };

  images = [
    'background2.jpg',
    'background.jpg',
    'about.jpg'
  ];

  currentIndex = 0;
  private intervalId: any;
  scrollToContacto() {
    const contactoSection = document.querySelector('#contacto');
    if (contactoSection) {
      contactoSection.scrollIntoView({ behavior: 'smooth' });
    }
  }
  startCarousel() {
    this.intervalId = setInterval(() => {
      this.nextImage();
    }, 4000);
  }
  get currentImage(): string {
    return this.images[this.currentIndex];
  }

  nextImage() {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
  }

  previousImage() {
    this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
  }
  ngOnInit() {
    this.startCarousel();
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  setImage(index: number) {
    this.currentIndex = index;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.startCarousel();
    }
  }
  
}
