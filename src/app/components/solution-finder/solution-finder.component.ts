import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';
import { FormsModule, NgForm } from '@angular/forms';
import { ContactService } from '../../services/contact.service';
interface Question {
  id: number;
  text: string;
  options: Option[];
}

interface Option {
  text: string;
  weights: {
    offGrid: number;
    onGrid: number;
    bombeo: number;
  };
}

interface TreeNode {
  id: number;
  text: string;
  options: OptionNode[];
}

interface OptionNode {
  text: string;
  weights: {
    offGrid: number;
    onGrid: number;
    bombeo: number;
  };
  nextQuestion?: TreeNode;
}

const questionTree: TreeNode = {
  id: 1,
  text: '¿Cuál es tu principal objetivo al considerar energía solar?',
  options: [
    {
      text: 'Independencia total de la red eléctrica',
      weights: { offGrid: 10, onGrid: 0, bombeo: 0 },
      nextQuestion: {
        id: 3,
        text: '¿Qué tipo de propiedad tienes?',
        options: [
          {
            text: 'Casa/Cabaña rural aislada',
            weights: { offGrid: 10, onGrid: 0, bombeo: 0 },
            nextQuestion: {
              id: 31,
              text: '¿Cuál es tu presupuesto aproximado para la inversión?',
              options: [
                {
                  text: 'Menos de $8,000 USD',
                  weights: { offGrid: 5, onGrid: 0, bombeo: 0 },
                  nextQuestion: {
                    id: 311,
                    text: '¿Cuál es tu consumo energético diario estimado?',
                    options: [
                      {
                        text: 'Básico (iluminación y pequeños electrodomésticos)',
                        weights: { offGrid: 10, onGrid: 0, bombeo: 0 },
                        nextQuestion: {
                          id: 3111,
                          text: '¿Cuántos días de autonomía necesitas?',
                          options: [
                            {
                              text: '1-2 días (clima mayormente soleado)',
                              weights: { offGrid: 8, onGrid: 0, bombeo: 0 },
                            },
                            {
                              text: '3-4 días (clima variable)',
                              weights: { offGrid: 10, onGrid: 0, bombeo: 0 },
                            },
                          ],
                        },
                      },
                      {
                        text: 'Moderado (incluye refrigerador)',
                        weights: { offGrid: 7, onGrid: 2, bombeo: 0 },
                        nextQuestion: {
                          id: 3112,
                          text: '¿Consideras expandir el sistema en el futuro?',
                          options: [
                            {
                              text: 'Sí, planeo agregar más equipos',
                              weights: { offGrid: 5, onGrid: 5, bombeo: 0 },
                            },
                            {
                              text: 'No, mantendré el mismo consumo',
                              weights: { offGrid: 8, onGrid: 0, bombeo: 0 },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
                {
                  text: '$8,000 - $15,000 USD',
                  weights: { offGrid: 8, onGrid: 0, bombeo: 0 },
                  nextQuestion: {
                    id: 312,
                    text: '¿Qué electrodomésticos planeas usar?',
                    options: [
                      {
                        text: 'Estándar (incluye lavadora y microondas)',
                        weights: { offGrid: 10, onGrid: 0, bombeo: 0 },
                        nextQuestion: {
                          id: 3121,
                          text: '¿Tienes espacio para paneles y baterías?',
                          options: [
                            {
                              text: 'Sí, amplio espacio disponible',
                              weights: { offGrid: 10, onGrid: 0, bombeo: 0 },
                            },
                            {
                              text: 'Espacio limitado',
                              weights: { offGrid: 5, onGrid: 3, bombeo: 0 },
                            },
                          ],
                        },
                      },
                      {
                        text: 'Alto consumo (incluye aire acondicionado)',
                        weights: { offGrid: 5, onGrid: 5, bombeo: 0 },
                        nextQuestion: {
                          id: 3122,
                          text: '¿En qué horario usarás más energía?',
                          options: [
                            {
                              text: 'Durante el día principalmente',
                              weights: { offGrid: 8, onGrid: 2, bombeo: 0 },
                            },
                            {
                              text: 'Uso constante día y noche',
                              weights: { offGrid: 4, onGrid: 6, bombeo: 0 },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            text: 'Rancho/Finca productiva',
            weights: { offGrid: 8, onGrid: 0, bombeo: 2 },
            nextQuestion: {
              id: 32,
              text: '¿Qué actividades necesitan energía?',
              options: [
                {
                  text: 'Uso mixto (vivienda y bombeo)',
                  weights: { offGrid: 7, onGrid: 0, bombeo: 3 },
                  nextQuestion: {
                    id: 321,
                    text: '¿Cuál es la prioridad principal?',
                    options: [
                      {
                        text: 'Confiabilidad del sistema',
                        weights: { offGrid: 10, onGrid: 0, bombeo: 2 },
                      },
                      {
                        text: 'Minimizar costos iniciales',
                        weights: { offGrid: 5, onGrid: 3, bombeo: 5 },
                      },
                    ],
                  },
                },
                {
                  text: 'Principalmente equipos de trabajo',
                  weights: { offGrid: 8, onGrid: 0, bombeo: 2 },
                  nextQuestion: {
                    id: 322,
                    text: '¿Qué tipo de maquinaria usarás?',
                    options: [
                      {
                        text: 'Herramientas pequeñas y medianas',
                        weights: { offGrid: 9, onGrid: 0, bombeo: 1 },
                      },
                      {
                        text: 'Equipos industriales pesados',
                        weights: { offGrid: 4, onGrid: 6, bombeo: 0 },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      text: 'Reducir el costo de la factura de luz',
      weights: { offGrid: 0, onGrid: 10, bombeo: 0 },
      nextQuestion: {
        id: 2,
        text: '¿Cuál es tu factura mensual promedio?',
        options: [
          {
            text: 'Menos de $100 USD',
            weights: { offGrid: 0, onGrid: 6, bombeo: 0 },
            nextQuestion: {
              id: 21,
              text: '¿Qué tipo de tarifa eléctrica tienes?',
              options: [
                {
                  text: 'Tarifa residencial básica',
                  weights: { offGrid: 0, onGrid: 8, bombeo: 0 },
                  nextQuestion: {
                    id: 211,
                    text: '¿Cuál es tu meta de ahorro?',
                    options: [
                      {
                        text: 'Reducir 50% o más',
                        weights: { offGrid: 0, onGrid: 10, bombeo: 0 },
                      },
                      {
                        text: 'Cualquier ahorro es bienvenido',
                        weights: { offGrid: 0, onGrid: 7, bombeo: 0 },
                      },
                    ],
                  },
                },
                {
                  text: 'Tarifa comercial/industrial',
                  weights: { offGrid: 0, onGrid: 10, bombeo: 0 },
                  nextQuestion: {
                    id: 212,
                    text: '¿En qué horario consumes más energía?',
                    options: [
                      {
                        text: 'Horario pico (más caro)',
                        weights: { offGrid: 2, onGrid: 10, bombeo: 0 },
                      },
                      {
                        text: 'Horario regular',
                        weights: { offGrid: 0, onGrid: 8, bombeo: 0 },
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            text: '$100 - $300 USD',
            weights: { offGrid: 0, onGrid: 8, bombeo: 0 },
            nextQuestion: {
              id: 22,
              text: '¿Tienes espacio en el techo para paneles?',
              options: [
                {
                  text: 'Sí, techo amplio y bien orientado',
                  weights: { offGrid: 0, onGrid: 10, bombeo: 0 },
                  nextQuestion: {
                    id: 221,
                    text: '¿Te interesa almacenar energía?',
                    options: [
                      {
                        text: 'Sí, quiero baterías de respaldo',
                        weights: { offGrid: 3, onGrid: 8, bombeo: 0 },
                      },
                      {
                        text: 'No, solo generación solar',
                        weights: { offGrid: 0, onGrid: 10, bombeo: 0 },
                      },
                    ],
                  },
                },
                {
                  text: 'Espacio limitado o con sombra',
                  weights: { offGrid: 0, onGrid: 6, bombeo: 0 },
                  nextQuestion: {
                    id: 222,
                    text: '¿Consideras optimizar tu consumo?',
                    options: [
                      {
                        text: 'Sí, puedo cambiar hábitos',
                        weights: { offGrid: 0, onGrid: 8, bombeo: 0 },
                      },
                      {
                        text: 'No, necesito mantener mi consumo actual',
                        weights: { offGrid: 0, onGrid: 5, bombeo: 0 },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      text: 'Bombear agua',
      weights: { offGrid: 0, onGrid: 0, bombeo: 10 },
      nextQuestion: {
        id: 4,
        text: '¿Cuál es el uso principal del agua?',
        options: [
          {
            text: 'Riego agrícola',
            weights: { offGrid: 0, onGrid: 0, bombeo: 10 },
            nextQuestion: {
              id: 41,
              text: '¿Qué área necesitas regar?',
              options: [
                {
                  text: 'Menos de 1 hectárea',
                  weights: { offGrid: 0, onGrid: 0, bombeo: 8 },
                  nextQuestion: {
                    id: 411,
                    text: '¿Qué tipo de cultivo tienes?',
                    options: [
                      {
                        text: 'Cultivos de bajo consumo',
                        weights: { offGrid: 0, onGrid: 0, bombeo: 7 },
                      },
                      {
                        text: 'Cultivos que requieren riego frecuente',
                        weights: { offGrid: 0, onGrid: 0, bombeo: 10 },
                      },
                    ],
                  },
                },
                {
                  text: 'Más de 1 hectárea',
                  weights: { offGrid: 0, onGrid: 0, bombeo: 10 },
                  nextQuestion: {
                    id: 412,
                    text: '¿Tienes sistema de riego instalado?',
                    options: [
                      {
                        text: 'Sí, riego por goteo',
                        weights: { offGrid: 0, onGrid: 0, bombeo: 10 },
                      },
                      {
                        text: 'No, necesito sistema completo',
                        weights: { offGrid: 0, onGrid: 0, bombeo: 8 },
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            text: 'Consumo ganadero',
            weights: { offGrid: 0, onGrid: 0, bombeo: 9 },
            nextQuestion: {
              id: 42,
              text: '¿Cuántos animales necesitan agua?',
              options: [
                {
                  text: 'Menos de 50 cabezas',
                  weights: { offGrid: 0, onGrid: 0, bombeo: 8 },
                  nextQuestion: {
                    id: 421,
                    text: '¿Tienes tanque de almacenamiento?',
                    options: [
                      {
                        text: 'Sí, tengo tanque elevado',
                        weights: { offGrid: 0, onGrid: 0, bombeo: 10 },
                      },
                      {
                        text: 'No, necesito solución completa',
                        weights: { offGrid: 0, onGrid: 0, bombeo: 7 },
                      },
                    ],
                  },
                },
                {
                  text: 'Más de 50 cabezas',
                  weights: { offGrid: 0, onGrid: 0, bombeo: 10 },
                  nextQuestion: {
                    id: 422,
                    text: '¿Necesitas bombeo continuo?',
                    options: [
                      {
                        text: 'Sí, todo el día',
                        weights: { offGrid: 2, onGrid: 0, bombeo: 10 },
                      },
                      {
                        text: 'No, solo durante el día',
                        weights: { offGrid: 0, onGrid: 0, bombeo: 8 },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
};

interface OptionNode {
  text: string;
  weights: {
    offGrid: number;
    onGrid: number;
    bombeo: number;
  };
  nextQuestion?: TreeNode;
}

interface TreeNode {
  id: number;
  text: string;
  options: OptionNode[];
}

interface ContactForm {
  name: string;
  email: string;
  phone: string;
  comments?: string;
}

interface Result {
  type: 'offGrid' | 'onGrid' | 'bombeo';
  title: string;
  description: string;
  imageUrl: string;
  benefits: string[];
}

@Component({
  selector: 'app-solution-finder',
  standalone: true,
  imports: [CommonModule, FormsModule],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate(
          '300ms ease-out',
          style({ opacity: 1, transform: 'translateY(0)' })
        ),
      ]),
      transition(':leave', [
        animate(
          '300ms ease-in',
          style({ opacity: 0, transform: 'translateY(-20px)' })
        ),
      ]),
    ]),
  ],
  template: `
    <div class="finder-container" id="finder">
      <!-- Start Screen -->
      <div *ngIf="!started" class="start-screen" [@fadeInOut]>
        <h1>Encuentra tu Solución Solar Ideal</h1>
        <p>
          Responde algunas preguntas simples para ayudarte a encontrar la mejor
          solución para tus necesidades.
        </p>
        <button class="primary-button" (click)="startQuiz()">
          Comenzar
        </button>
      </div>

      <!-- Questions Screen -->
      <div *ngIf="started && !finished" class="question-screen" [@fadeInOut]>
        <!-- Progress Bar -->
        <div class="progress-container">
          <div class="progress-bar">
            <div class="progress" [style.width]="progressWidth">
              <div class="progress-glow"></div>
            </div>
          </div>
          <span class="progress-text">Pregunta {{ userPath.length }}</span>
        </div>

        <!-- Question Content -->
        <div class="question-content">
          <h2>{{ currentQuestion.text }}</h2>
          <div class="options-grid">
            <button
              *ngFor="let option of currentQuestion.options"
              class="option-button"
              (click)="selectOption(option)"
              [class.selected]="selectedOption === option"
            >
              <div class="option-content">
                {{ option.text }}
                <i
                  *ngIf="selectedOption === option"
                  class="fas fa-check-circle"
                ></i>
              </div>
            </button>
          </div>
        </div>

        <!-- Navigation -->
        <div class="navigation-buttons">
          <button
            *ngIf="userPath.length > 1"
            class="secondary-button"
            (click)="previousQuestion()"
          >
            <i class="fas fa-arrow-left"></i> Anterior
          </button>
          <button
            *ngIf="selectedOption"
            class="primary-button"
            (click)="nextQuestion()"
          >
            {{ isLastQuestion ? 'Ver Resultado' : 'Siguiente' }}
            <i class="fas fa-arrow-right"></i>
          </button>
        </div>
      </div>

      <!-- Results Screen -->
      <div *ngIf="finished" class="result-screen" [@fadeInOut]>
        <div class="result-header">
          <h2>Tu Solución Recomendada</h2>
        </div>

        <div class="result-card">
          <div class="result-image-container">
            <img
              [src]="recommendedSolution.imageUrl"
              [alt]="recommendedSolution.title"
            />
          </div>

          <div class="result-content">
            <h3>{{ recommendedSolution.title }}</h3>
            <p class="result-description">
              {{ recommendedSolution.description }}
            </p>

            <div class="benefits-section">
              <h4>Beneficios principales:</h4>
              <ul>
                <li *ngFor="let benefit of recommendedSolution.benefits">
                  <i class="fas fa-check"></i>
                  <span>{{ benefit }}</span>
                </li>
              </ul>
            </div>
          </div>

          <!-- Contact Form Section -->
          <div class="contact-section" *ngIf="!showForm">
            <p class="contact-prompt">
              ¿Te gustaría recibir más información sobre esta solución?
            </p>
            <button class="primary-button" (click)="showForm = true">
              <i class="fas fa-envelope"></i> Recibir Información
            </button>
          </div>

          <form *ngIf="showForm" class="contact-form" #form="ngForm">
            <div class="form-group">
              <label for="name">Nombre completo *</label>
              <input
                type="text"
                id="name"
                [(ngModel)]="contactForm.name"
                name="name"
                required
                placeholder="Tu nombre"
              />
            </div>

            <div class="form-group">
              <label for="email">Correo electrónico *</label>
              <input
                type="email"
                id="email"
                [(ngModel)]="contactForm.email"
                name="email"
                required
                placeholder="tu@email.com"
              />
            </div>

            <div class="form-group">
              <label for="phone">Teléfono *</label>
              <input
                type="tel"
                id="phone"
                [(ngModel)]="contactForm.phone"
                name="phone"
                required
                placeholder="Tu número de teléfono"
              />
            </div>

            <div class="form-group">
              <label for="comments">Comentarios adicionales</label>
              <textarea
                id="comments"
                [(ngModel)]="contactForm.comments"
                name="comments"
                rows="3"
                placeholder="¿Algo más que quieras comentarnos?"
              ></textarea>
            </div>

            <div class="form-actions">
              <button
                type="button"
                class="secondary-button"
                (click)="showForm = false"
              >
                <i class="fas fa-times"></i> Cancelar
              </button>
              <button
                type="submit"
                class="primary-button"
                (click)="sendResults(form)"
                [disabled]="!form.valid"
              >
                <i class="fas fa-paper-plane"></i> Enviar Información
              </button>
            </div>
          </form>

          <div class="action-buttons" *ngIf="!showForm">
            <button class="secondary-button" (click)="restartQuiz()">
              <i class="fas fa-redo"></i> Comenzar de nuevo
            </button>
            <button class="primary-button" (click)="scrollToContacto()">
              <i class="fas fa-envelope"></i> Contactar ventas
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .finder-container {
        width: 100%;
        min-height: 90vh; /* Reduced from 100vh */
        padding: 2rem; /* Reduced from 4rem */
        display: flex;
        flex-direction: column;
        justify-content: center;
        background: linear-gradient(
            45deg,
            rgba(12, 69, 122, 0.95),
            rgba(26, 110, 184, 0.95)
          ),
          url('/about.jpg') center center;
        background-attachment: fixed;
        background-size: cover;
        position: relative;
        overflow: hidden;
      }

      /* Animated background effect */
      .finder-container::before {
        content: '';
        position: absolute;
        top: 0;
        left: -50%;
        width: 200%;
        height: 200%;
        background: radial-gradient(
          circle,
          rgba(255, 255, 255, 0.1) 0%,
          transparent 60%
        );
        animation: shine 15s linear infinite;
      }

      @keyframes shine {
        0% {
          transform: translateY(-50%) rotate(0deg);
        }
        100% {
          transform: translateY(-50%) rotate(360deg);
        }
      }

      .start-screen {
        text-align: center;
        max-width: 800px;
        margin: 0 auto;
        padding: 4rem;
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(10px);
        border-radius: 2rem;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25),
          0 0 0 1px rgba(255, 255, 255, 0.1);
        transform: translateY(0);
        transition: transform 0.3s ease;
      }

      .primary-button img {
  width: 25px;
  height: 25px;
}

      .start-screen:hover {
        transform: translateY(-5px);
      }

      .start-screen h1 {
        font-size: clamp(2.5rem, 5vw, 4rem);
        font-weight: 800;
        background: linear-gradient(135deg, #0c457a 0%, #2563eb 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        margin-bottom: 1.5rem;
        line-height: 1.2;
        animation: gradientFlow 5s ease infinite;
      }

      @keyframes gradientFlow {
        0% {
          background-position: 0% 50%;
        }
        50% {
          background-position: 100% 50%;
        }
        100% {
          background-position: 0% 50%;
        }
      }

      .option-button {
        padding: 2rem;
        border: 2px solid rgba(12, 69, 122, 0.1);
        border-radius: 1.5rem;
        background: white;
        font-size: 1.1rem;
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        text-align: left;
        line-height: 1.6;
        position: relative;
        overflow: hidden;
      }

      .secondary-button {
        background: rgba(255, 255, 255, 0.9);
        color: #0c457a;
        padding: 1rem 2rem;
        border-radius: 1rem;
        font-weight: 600;
        border: 2px solid #0c457a;
        transition: all 0.3s ease;
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        position: relative;
        overflow: hidden;
      }

      .secondary-button::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: rgba(12, 69, 122, 0.1);
        transition: left 0.3s ease;
      }

      .secondary-button:hover {
        transform: translateY(-3px);
        box-shadow: 0 10px 20px -5px rgba(12, 69, 122, 0.2);
        background: #f8fafc;
      }

      .secondary-button:hover::before {
        left: 100%;
      }
      .option-button::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(
          90deg,
          transparent,
          rgba(12, 69, 122, 0.05),
          transparent
        );
        transition: left 0.5s ease;
      }

      .option-button:hover {
        border-color: #0c457a;
        transform: translateY(-5px) scale(1.02);
        box-shadow: 0 20px 30px -10px rgba(12, 69, 122, 0.3);
      }

      .option-button:hover::before {
        left: 100%;
      }

      .option-button.selected {
        border-color: #0c457a;
        background: rgb(127, 203, 200);
        box-shadow: 0 20px 30px -10px rgba(12, 69, 122, 0.2);
      }

      .progress-bar {
        width: 100%;
        height: 12px;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 1rem;
        overflow: hidden;
        margin-bottom: 3rem;
      }

      .progress {
        height: 100%;
        background: linear-gradient(90deg, #0c457a, #2563eb);
        border-radius: 1rem;
        transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        position: relative;
        overflow: hidden;
      }

      .progress::after {
        content: '';
        position: absolute;
        top: 0;
        left: -200%;
        width: 200%;
        height: 100%;
        background: linear-gradient(
          90deg,
          transparent,
          rgba(255, 255, 255, 0.4),
          transparent
        );
        animation: shine 2s linear infinite;
      }

      .result-card {
        background: rgba(255, 255, 255, 0.95);
        padding: 3rem;
        border-radius: 2rem;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        transform: translateY(0);
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
      }

      .result-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 5px;
        background: linear-gradient(90deg, #0c457a, #2563eb);
      }

      .result-card img {
        transform: scale(1);
        transition: transform 0.5s ease;
        border-radius: 1rem;
        box-shadow: 0 20px 30px -10px rgba(0, 0, 0, 0.2);
      }

      .result-card:hover img {
        transform: scale(1.02);
      }

      .benefits-section li {
        background: white;
        padding: 1.25rem;
        border-radius: 1rem;
        margin-bottom: 1rem;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        transform: translateX(0);
        transition: all 0.3s ease;
        border-left: 4px solid #0c457a;
      }

      .benefits-section li:hover {
        transform: translateX(10px);
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
      }

      .primary-button {
        background: linear-gradient(135deg, #0c457a, #2563eb);
        color: white;
        padding: 1rem 2rem;
        border-radius: 1rem;
        font-weight: 600;
        transition: all 0.3s ease;
        border: none;
        position: relative;
        overflow: hidden;
      }

      .contact-section {
        text-align: center;
        margin: 2rem 0;
        padding: 2rem;
        background: rgba(12, 69, 122, 0.05);
        border-radius: 1rem;
      }

      .contact-prompt {
        margin-bottom: 1.5rem;
        color: var(--text);
        font-size: 1.1rem;
      }

      .contact-form {
        margin-top: 2rem;
        padding: 2rem;
        background: var(--surface);
        border-radius: 1rem;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      }

      .form-group {
        margin-bottom: 1.5rem;
      }

      .form-group label {
        display: block;
        margin-bottom: 0.5rem;
        color: var(--text);
        font-weight: 500;
      }

      .form-group input,
      .form-group textarea {
        width: 100%;
        padding: 0.75rem;
        border: 1px solid var(--gray-200);
        border-radius: 0.5rem;
        transition: all 0.3s ease;
      }

      .form-group input:focus,
      .form-group textarea:focus {
        outline: none;
        border-color: var(--primary);
        box-shadow: 0 0 0 3px rgba(12, 69, 122, 0.1);
      }

      .form-actions {
        display: flex;
        gap: 1rem;
        justify-content: flex-end;
        margin-top: 2rem;
      }

      @media (max-width: 768px) {
        .contact-form {
          padding: 1.5rem;
        }

        .form-actions {
          flex-direction: column;
        }

        .form-actions button {
          width: 100%;
        }
      }
      .primary-button::before {
        content: '';
        position: absolute;
        top: -50%;
        left: -50%;
        width: 200%;
        height: 200%;
        background: radial-gradient(
          circle,
          rgba(255, 255, 255, 0.2) 0%,
          transparent 60%
        );
        transform: rotate(45deg);
        transition: all 0.3s ease;
        opacity: 0;
      }

      .primary-button:hover::before {
        opacity: 1;
        transform: rotate(45deg) translateY(-50%);
      }

      .primary-button:hover {
        transform: translateY(-3px);
        box-shadow: 0 20px 30px -10px rgba(12, 69, 122, 0.4);
      }

      @media (max-width: 768px) {
        .finder-container {
          padding: 2rem 1rem;
        }

        .start-screen,
        .result-card {
          padding: 2rem;
        }

        .option-button {
          padding: 1.5rem;
        }
      }
      .progress-container {
        text-align: center;
        margin-bottom: 3rem;
      }

      .progress-text {
        color: white;
        font-size: 0.9rem;
        margin-top: 0.5rem;
        display: block;
      }

      .progress-glow {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(
          90deg,
          transparent,
          rgba(255, 255, 255, 0.3),
          transparent
        );
        animation: progressGlow 2s linear infinite;
      }

      @keyframes progressGlow {
        0% {
          transform: translateX(-100%);
        }
        100% {
          transform: translateX(100%);
        }
      }

      .question-screen {
        color: white;
      }

      .question-content h2 {
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
      }

      .option-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
      }

      .option-button i {
        color: #0c457a;
        font-size: 1.2rem;
        opacity: 0;
        transform: scale(0);
        transition: all 0.3s ease;
      }

      .option-button.selected i {
        opacity: 1;
        transform: scale(1);
      }

      .result-header {
        text-align: center;
        color: white;
        margin-bottom: 2rem;
      }

      .result-image-container {
        position: relative;
        overflow: hidden;
        border-radius: 1rem;
        margin: -3rem -3rem 2rem -3rem;
        height: 250px; /* Reduced from 300px */
      }

      .result-image-container img {
        width: 100%;
        height: 300px;
        object-fit: cover;
      }

      .result-content {
        margin-bottom: 2rem;
      }

      .result-description {
        color: #4a5568;
        font-size: 1.1rem;
        line-height: 1.8;
        margin: 1rem 0 2rem 0;
      }

      .result-card .benefits-section {
        margin-top: 2rem;
        padding: 2rem;
      }

      .benefits-section li {
        display: flex;
        align-items: center;
        gap: 1rem;
      }

      .benefits-section li i {
        background: #0c457a;
        color: white;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.8rem;
        flex-shrink: 0;
      }

      .action-buttons {
        display: flex;
        gap: 1rem;
        margin-top: 3rem;
      }

      .action-buttons button {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
      }

      @media (max-width: 768px) {
        .result-image-container {
          margin: -2rem -2rem 1.5rem -2rem;
        }

        .result-image-container img {
          height: 200px;
        }

        .action-buttons {
          flex-direction: column;
        }
      }
      .result-screen {
        max-width: 800px;
        margin: 0 auto;
        padding: 1rem;
      }

      .result-header {
        text-align: center;
        color: white;
        margin-bottom: 1.5rem;
      }

      .result-header h2 {
        font-size: 2rem;
        margin: 0;
      }

      .result-card {
        background: rgba(255, 255, 255, 0.95);
        border-radius: 1rem;
        box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
        overflow: hidden;
        position: relative;
      }

      .result-image-container {
        position: relative;
        height: 200px;
        margin: 0;
        overflow: hidden;
      }

      .result-image-container img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .result-content {
        padding: 1.5rem;
      }

      .result-content h3 {
        font-size: 1.5rem;
        color: #0c457a;
        margin: 0 0 0.5rem 0;
      }

      .result-description {
        font-size: 1rem;
        line-height: 1.5;
        color: #4a5568;
        margin-bottom: 1rem;
      }

      .benefits-section h4 {
        font-size: 1.1rem;
        color: #0c457a;
        margin: 0 0 0.75rem 0;
      }

      .benefits-section ul {
        margin: 0;
        padding: 0;
        list-style: none;
      }

      .benefits-section li {
        padding: 0.75rem;
        margin-bottom: 0.5rem;
        font-size: 0.95rem;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        background: rgba(12, 69, 122, 0.05);
        border-radius: 0.5rem;
        border-left: 3px solid #0c457a;
      }
      @media (max-width: 768px) {
        .result-screen {
          padding: 0.5rem;
        }

        .result-image-container {
          height: 150px;
        }

        .result-content {
          padding: 1rem;
        }

        .action-buttons {
          padding: 1rem;
          flex-direction: column;
        }

        .benefits-section li {
          padding: 0.5rem;
          font-size: 0.9rem;
        }
      }
    `,
  ],
})
export class SolutionFinderComponent {
  // Tree navigation properties
  currentNode: TreeNode = questionTree;
  userPath: { node: TreeNode; selectedOption: OptionNode | null }[] = [
    {
      node: questionTree,
      selectedOption: null,
    },
  ];
  selectedOption: OptionNode | null = null;
  selectedOptions: OptionNode[] = [];

  // Component state
  started: boolean = false;
  finished: boolean = false;
  showForm: boolean = false;

  // Tracking scores
  scores: { offGrid: number; onGrid: number; bombeo: number } = {
    offGrid: 0,
    onGrid: 0,
    bombeo: 0,
  };

  // Form data
  contactForm: ContactForm = {
    name: '',
    email: '',
    phone: '',
    comments: '',
  };

  // Store user answers for email
  userAnswers: { questionId: number; selectedOption: string }[] = [];

  // Results definitions
  results: { [key: string]: Result } = {
    offGrid: {
      type: 'offGrid',
      title: 'Sistema Off Grid',
      description:
        'Un sistema autónomo que te permite independizarte completamente de la red eléctrica.',
      imageUrl: '/offgrid.jpg',
      benefits: [
        'Independencia energética total',
        'Sin facturas de electricidad',
        'Ideal para zonas sin acceso a la red',
        'Sistema expandible según necesidades',
      ],
    },
    onGrid: {
      type: 'onGrid',
      title: 'Sistema On Grid',
      description:
        'La solución perfecta para reducir tus costos de energía manteniéndote conectado a la red.',
      imageUrl: '/ongrid.jpg',
      benefits: [
        'Reducción significativa en facturas',
        'Menor inversión inicial',
        'Mantenimiento mínimo',
        'Recuperación rápida de la inversión',
      ],
    },
    bombeo: {
      type: 'bombeo',
      title: 'Sistema de Bombeo Solar',
      description:
        'Solución especializada para el bombeo de agua utilizando energía solar.',
      imageUrl: '/bombeo.jpg',
      benefits: [
        'Sin costos de operación',
        'Ideal para zonas remotas',
        'Mantenimiento simple',
        'Funciona sin baterías',
      ],
    },
  };

  recommendedSolution!: Result;

  constructor(
    private cdr: ChangeDetectorRef,
    private contactService: ContactService
  ) {}

  // Getters
  get currentQuestion(): TreeNode {
    return this.currentNode;
  }

  get isLastQuestion(): boolean {
    return !this.selectedOption?.nextQuestion;
  }

  get progressWidth(): string {
    const typicalPathLength = 3;
    return `${(this.userPath.length / typicalPathLength) * 100}%`;
  }

  // Navigation methods
  startQuiz(): void {
    this.started = true;
    this.cdr.detectChanges();
  }

  selectOption(option: OptionNode): void {
    this.selectedOption = option;
  }

  previousQuestion(): void {
    if (this.userPath.length > 1) {
      // Remove the last answer from tracking
      this.userAnswers.pop();

      // Get the last selected option before removing it
      const lastPathEntry = this.userPath[this.userPath.length - 1];
      const lastSelected = lastPathEntry.selectedOption;

      // Remove last path entry
      this.userPath.pop();
      this.selectedOptions.pop();

      // Update current node
      const currentPathEntry = this.userPath[this.userPath.length - 1];
      this.currentNode = currentPathEntry.node;
      this.selectedOption = null;

      // Subtract scores from the last selected option
      if (lastSelected) {
        this.scores.offGrid -= lastSelected.weights.offGrid;
        this.scores.onGrid -= lastSelected.weights.onGrid;
        this.scores.bombeo -= lastSelected.weights.bombeo;
      }
    }
  }

  nextQuestion(): void {
    if (this.selectedOption) {
      // Add scores from selected option
      this.scores.offGrid += this.selectedOption.weights.offGrid;
      this.scores.onGrid += this.selectedOption.weights.onGrid;
      this.scores.bombeo += this.selectedOption.weights.bombeo;

      // Track the answer
      this.userAnswers.push({
        questionId: this.currentNode.id,
        selectedOption: this.selectedOption.text,
      });

      // Store selected option
      this.selectedOptions.push(this.selectedOption);

      // Update current path entry with selected option
      this.userPath[this.userPath.length - 1].selectedOption =
        this.selectedOption;

      if (this.selectedOption.nextQuestion) {
        this.currentNode = this.selectedOption.nextQuestion;
        // Add new path entry
        this.userPath.push({
          node: this.selectedOption.nextQuestion,
          selectedOption: null,
        });
        this.selectedOption = null;
      } else {
        this.calculateResult();
      }
    }
  }

  // Result handling
  calculateResult(): void {
    // Find the solution type with the highest score
    const maxScore = Math.max(
      this.scores.offGrid,
      this.scores.onGrid,
      this.scores.bombeo
    );

    if (this.scores.offGrid === maxScore) {
      console.log('offgrid');
      this.recommendedSolution = this.results['offGrid'];
    } else if (this.scores.onGrid === maxScore) {
      console.log('ongrid');
      this.recommendedSolution = this.results['onGrid'];
    } else {
      console.log('bombeo');
      this.recommendedSolution = this.results['bombeo'];
    }

    this.finished = true;
    this.refreshInfo();
  }

  sendResults(form: NgForm): void {
    if (form.valid) {
      const resultData = {
        solution: this.recommendedSolution,
        scores: this.scores,
        contact: this.contactForm,
        answers: this.userAnswers,
      };

      this.contactService.sendQuizResults(resultData).subscribe({
        next: (response) => {
          if (response.success) {
            console.log('Email sent successfully');
            this.showForm = false;
          } else {
            console.error('Failed to send email:', response.message);
          }
        },
        error: (error) => {
          console.error('Error sending email:', error);
        },
      });
    }
  }

  // Utility methods
  refreshInfo(): void {
    this.cdr.detectChanges();
  }

  restartQuiz(): void {
    this.currentNode = questionTree;
    this.selectedOption = null;
    this.selectedOptions = [];
    this.userPath = [{ node: questionTree, selectedOption: null }];
    this.userAnswers = [];
    this.scores = {
      offGrid: 0,
      onGrid: 0,
      bombeo: 0,
    };
    this.started = true;
    this.finished = false;
  }

  scrollToContacto(): void {
    const contactoSection = document.getElementById('contacto');
    if (contactoSection) {
      contactoSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
