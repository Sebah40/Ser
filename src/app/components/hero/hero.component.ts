import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface HeroSlide {
  image: string;
  title: string;
  subtitle: string;
}
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
        <div class="text-container">
          <h1 class="hero-title text-slide">{{ currentSlide.title }}</h1>
          <h2 class="hero-subtitle text-slide" >{{ currentSlide.subtitle }}</h2>
          <button
            class="cta-button text-slide"
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
      width: 100%;
      position: relative;
      background-attachment: fixed;
      background-size: cover;
      background-position: center;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      transition: background-image 1s ease-in-out;
    }

    /* Overlay gradient */
    .overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(
        135deg,
        rgba(255, 255, 255, 0.27) 0%,
        rgba(0, 0, 0, 0.3) 50%
      );
      z-index: 1;
    }

    /* Content layout */
    .content-container {
      max-width: 1200px;
      width: 100%;
      padding: 0 2rem;
      position: relative;
      z-index: 2;
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }

    .text-container {
      text-align: center;
      color: white;
      max-width: 800px;
      margin: auto;
      padding: 2rem 0;
      animation: none;
    }

    .text-container * {
      animation-fill-mode: both;
    }

    /* Typography */
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
      text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.2);
    }

    /* Button styles */
    .cta-button {
      background: #0c457a;
      color: white;
      border: none;
      padding: 1rem 2.5rem;
      font-size: 1.1rem;
      font-weight: 600;
      border-radius: 50px;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .cta-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
      background: #0d4d8a;
    }

    /* Navigation buttons */
    .nav-button {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(4px);
      border: 2px solid rgba(255, 255, 255, 0.4);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.3s ease;
      z-index: 3;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
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

    /* Carousel indicators */
    .carousel-indicators {
      position: relative;
      display: flex;
      gap: 10px;
      z-index: 3;
      padding: 15px;
      margin-top: auto;
      justify-content: center;
      align-items: center;
      margin-bottom: 2rem;
    }

    .indicator {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.5);
      border: 2px solid rgba(255, 255, 255, 0.7);
      cursor: pointer;
      padding: 0;
      transition: all 0.3s ease;
      margin: 0 5px;
    }

    .indicator.active {
      background: white;
      transform: scale(1.2);
      border-color: white;
    }

    /* Animations */
    .slide-in {
      animation: slideIn 0.8s ease-out forwards;
      opacity: 0;
    }

    .hero-subtitle.slide-in {
      animation-delay: 0.2s;
    }

    .cta-button.slide-in {
      animation-delay: 0.4s;
    }

    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    /* Responsive design */
    @media (max-width: 768px) {
      .content-container {
        padding: 0 1rem;
      }

      .hero-title {
        font-size: 2.5rem;
        margin-bottom: 1rem;
      }

      .hero-subtitle {
        font-size: 1.2rem;
        margin-bottom: 1.5rem;
      }

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

      .cta-button {
        padding: 0.875rem 2rem;
        font-size: 1rem;
      }
    }

    @media (max-width: 480px) {
      .hero-title {
        font-size: 2rem;
      }

      .hero-subtitle {
        font-size: 1.1rem;
      }
    }
    .carousel-indicators {
      position: absolute;
      bottom: 100px;  /* Move indicators up */
      left: 0;
      right: 0;
      display: flex;
      gap: 10px;
      z-index: 3;
      padding: 15px;
      justify-content: center;
      align-items: center;
    }

    /* Text animations */
    .text-container {
      text-align: center;
      color: white;
      max-width: 800px;
      margin: auto;
      padding: 2rem 0;
    }

    .text-slide {
      animation: textSlide 0.8s ease-out forwards;
      opacity: 0;
    }

    .hero-title.text-slide {
      animation-delay: 0s;
    }

    .hero-subtitle.text-slide {
      animation-delay: 0.2s;
    }

    .cta-button.text-slide {
      animation-delay: 0.4s;
    }

    @keyframes textSlide {
      0% {
        opacity: 0;
        transform: translateY(20px);
      }
      100% {
        opacity: 1;
        transform: translateY(0);
      }
    }
    `,
  ],
})

export class HeroComponent {
  slides: HeroSlide[] = [
    {
      image: 'background2.jpg',
      title: 'Soluciones en Energías Renovables',
      subtitle: 'Desarrollamos soluciones con energía solar para el hogar, la industria y el campo argentino desde 2015'
    },
    {
      image: 'background.jpg',
      title: 'Innovación Sostenible',
      subtitle: 'Sistemas personalizados que maximizan tu ahorro energético y cuidan el medio ambiente'
    },
    {
      image: 'about.jpg',
      title: 'Expertos en Energía Solar',
      subtitle: 'Más de 100 proyectos exitosos respaldan nuestra experiencia en el sector'
    }
  ];

  currentIndex = 0;
  private intervalId: any;

  get currentSlide(): HeroSlide {
    return this.slides[this.currentIndex];
  }

  get currentImage(): string {
    return this.currentSlide.image;
  }

  nextImage() {
    this.currentIndex = (this.currentIndex + 1) % this.slides.length;
    this.resetAnimations();
  }

  previousImage() {
    this.currentIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
    this.resetAnimations();
  }

  setImage(index: number) {
    this.currentIndex = index;
    this.resetAnimations();
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.startCarousel();
    }
  }
  private resetAnimations() {
    // Force DOM reflow to restart animations
    const elements = document.querySelectorAll('.text-slide');
    elements.forEach(element => {
      const htmlElement = element as HTMLElement; // Type assertion
      htmlElement.classList.remove('text-slide');
      void htmlElement.offsetWidth; // Now TypeScript knows it's an HTMLElement
      htmlElement.classList.add('text-slide');
    });
  }

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

  ngOnInit() {
    this.startCarousel();
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}