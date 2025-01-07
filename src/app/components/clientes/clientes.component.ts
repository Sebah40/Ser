import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface ClientReview {
  name: string;
  role: string;
  rating: number;
  review: string;
  company?: string;
}

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="clients-container">
      <div class="overlay">
        <h2 class="section-title">Lo que dicen nuestros clientes</h2>

        <div class="reviews-container">
          <div class="reviews-scroll">
            <div class="review-card" *ngFor="let review of clientReviews">
              <div class="review-content">
                <div class="stars">
                  <span
                    class="star"
                    *ngFor="let star of [1, 2, 3, 4, 5]"
                    [class.filled]="star <= review.rating"
                    >★</span
                  >
                </div>
                <p class="review-text">{{ review.review }}</p>
                <div class="reviewer-info">
                  <h3 class="reviewer-name">{{ review.name }}</h3>
                  <p class="reviewer-role" *ngIf="review.role">
                    {{ review.role }}
                  </p>
                  <p class="reviewer-company" *ngIf="review.company">
                    {{ review.company }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      .clients-container {
        position: relative;
        width: 100%;
        min-height: 100vh;
        background: url('/images/clientesbackground.jpg') no-repeat center
          center fixed;
        background-size: cover;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(
          to bottom,
          rgba(255, 255, 255, 0.2) 0%,
          rgba(0, 0, 0, 0.8) 100%
        );
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 2rem;
      }

      .section-title {
        color: white;
        font-size: 2.5rem;
        font-weight: 700;
        text-align: center;
        margin-bottom: 3rem;
        text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
      }

      .reviews-container {
        width: 100%;
        max-width: 1400px;
        overflow: hidden;
        padding: 2rem 0;
      }

      .reviews-scroll {
        display: flex;
        gap: 2rem;
        overflow-x: auto;
        padding: 1rem 2rem;
        scroll-snap-type: x mandatory;
        -webkit-overflow-scrolling: touch;
        scrollbar-width: none; /* Firefox */
        -ms-overflow-style: none; /* IE and Edge */
      }

      .reviews-scroll::-webkit-scrollbar {
        display: none; /* Chrome, Safari, Opera */
      }

      .review-card {
        min-width: 400px;
        scroll-snap-align: start;
        background: rgba(255, 255, 255, 0.95);
        border-radius: 12px;
        padding: 2rem;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
        transition: transform 0.3s ease;
      }

      .review-card:hover {
        transform: translateY(-5px);
      }

      .review-content {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .stars {
        display: flex;
        gap: 0.25rem;
        margin-bottom: 1rem;
      }

      .star {
        font-size: 1.5rem;
        color: #ccc;
      }

      .star.filled {
        color: #ffd700;
      }

      .review-text {
        font-size: 1.1rem;
        line-height: 1.6;
        color: #333;
        margin-bottom: 1.5rem;
        font-style: italic;
      }

      .reviewer-info {
        margin-top: auto;
        border-top: 1px solid #eee;
        padding-top: 1rem;
      }

      .reviewer-name {
        font-size: 1.2rem;
        font-weight: 600;
        color: #222;
        margin: 0;
      }

      .reviewer-role,
      .reviewer-company {
        font-size: 0.9rem;
        color: #666;
        margin: 0.25rem 0 0 0;
      }

      .scroll-indicator {
        position: absolute;
        bottom: 2rem;
        display: flex;
        align-items: center;
        gap: 1rem;
        color: white;
        font-size: 1rem;
        opacity: 0.8;
      }

      .scroll-arrow {
        font-size: 1.5rem;
        animation: scrollArrow 2s infinite;
      }

      @keyframes scrollArrow {
        0%,
        100% {
          transform: translateX(0);
        }
        50% {
          transform: translateX(10px);
        }
      }

      @media (max-width: 768px) {
        .section-title {
          font-size: 2rem;
        }

        .review-card {
          min-width: 300px;
          padding: 1.5rem;
        }

        .reviews-scroll {
          padding: 1rem;
        }
      }
    `,
  ],
})
export class ClientesComponent {
  clientReviews: ClientReview[] = [
    {
      name: 'Federico Schatenoffer',
      role: 'Secretario',
      company: 'UTN',
      rating: 5,
      review:
        'Personas muy responsables y profesionales en todo el proceso del proyecto del potrero san francisco.',
    },
    {
      name: 'Mario Smietuch',
      role: 'Apicultor',
      company: '',
      rating: 5,
      review:
        'Perfectamente conforme con todo el proceso que llevo a la instalación de 16 paneles en mi fabrica de miel.',
    },
    {
      name: 'Fernanda Lastiri',
      role: '',
      company: '',
      rating: 5,
      review:
        'Fueron muy amables y siempre cumplieron con lo hablado.                                                ',
    },
  ];
}
