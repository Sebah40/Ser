import { Component, ChangeDetectorRef  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';

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
  imports: [CommonModule],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ opacity: 0, transform: 'translateY(-20px)' }))
      ])
    ])
  ],
  template: `
    <div class="finder-container" id="finder">
      <!-- Inicio -->
      <div *ngIf="!started" class="start-screen" [@fadeInOut]>
        <h1>Encuentra tu Solución Solar Ideal</h1>
        <p>Responde algunas preguntas simples para ayudarte a encontrar la mejor solución para tus necesidades.</p>
        <button class="primary-button" (click)="startQuiz()">
          Comenzar <i class="fas fa-arrow-right"></i>
        </button>
      </div>

      <!-- Preguntas -->
      <div *ngIf="started && !finished" class="question-screen" [@fadeInOut]>
        <div class="progress-bar">
          <div class="progress" [style.width]="progressWidth"></div>
        </div>
        
        <div class="question-content">
          <h2>{{ currentQuestion.text }}</h2>
          <div class="options-grid">
            <button
              *ngFor="let option of currentQuestion.options"
              class="option-button"
              (click)="selectOption(option)"
              [class.selected]="selectedOption === option"
            >
              {{ option.text }}
            </button>
          </div>
        </div>

        <div class="navigation-buttons">
          <button 
            *ngIf="currentQuestionIndex > 0"
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

      <!-- Resultados -->
      <div *ngIf="finished" class="result-screen" [@fadeInOut]>
        <h2>Tu Solución Recomendada</h2>
        <div class="result-card">
          <img [src]="recommendedSolution.imageUrl" [alt]="recommendedSolution.title">
          <h3>{{ recommendedSolution.title }}</h3>
          <p>{{ recommendedSolution.description }}</p>
          
          <div class="benefits-section">
            <h4>Beneficios principales:</h4>
            <ul>
              <li *ngFor="let benefit of recommendedSolution.benefits">
                <i class="fas fa-check"></i> {{ benefit }}
              </li>
            </ul>
          </div>
        </div>

        <div class="action-buttons">
          <button class="secondary-button" (click)="restartQuiz()">
            <i class="fas fa-redo"></i> Comenzar de nuevo
          </button>
          <button class="primary-button" (click)="scrollToContacto()">
    <i class="fas fa-envelope"></i> Contactar ventas
  </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .finder-container {
     width: 100%;
     min-height: 100vh;
     padding: 4rem 2rem;
     display: flex;
     flex-direction: column;
     justify-content: center;
     background-color: #f8fafc;
   }

   .start-screen {
     text-align: center;
     max-width: 800px;
     margin: 0 auto;
     padding: 4rem 2rem;
     background: white;
     border-radius: 1rem;
     box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
   }

   .start-screen h1 {
     font-size: clamp(2rem, 5vw, 3.5rem);
     font-weight: 800;
     background: linear-gradient(90deg, #2563eb, #3b82f6);
     -webkit-background-clip: text;
     -webkit-text-fill-color: transparent;
     margin-bottom: 2rem;
   }

   .question-screen {
     width: 100%;
     max-width: 1200px;
     margin: 0 auto;
     padding: 3rem;
     background: white;
     border-radius: 1rem;
     box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
   }

   .progress-bar {
     width: 100%;
     height: 12px;
     background-color: #e2e8f0;
     border-radius: 1rem;
     margin-bottom: 3rem;
   }

   .progress {
     height: 100%;
     background: linear-gradient(90deg, #2563eb, #3b82f6);
     border-radius: 1rem;
     transition: width 0.4s ease;
   }

   .question-content h2 {
     font-size: clamp(1.5rem, 3vw, 2rem);
     color: #1e293b;
     font-weight: 700;
     margin-bottom: 2rem;
   }

   .options-grid {
     display: grid;
     grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
     gap: 1.5rem;
     margin-bottom: 3rem;
   }

   .option-button {
     padding: 2rem;
     border: 2px solid #e2e8f0;
     border-radius: 1rem;
     background: white;
     font-size: 1.1rem;
     transition: all 0.3s ease;
     text-align: left;
     line-height: 1.6;
   }

   .option-button:hover {
     border-color: #2563eb;
     transform: translateY(-2px);
     box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
   }

   .option-button.selected {
     border-color: #2563eb;
     background-color: #eff6ff;
   }

   .result-screen {
     max-width: 1200px;
     margin: 0 auto;
     padding: 4rem 2rem;
   }

   .result-screen h2 {
     font-size: clamp(2rem, 4vw, 3rem);
     text-align: center;
     margin-bottom: 3rem;
     color: #1e293b;
   }

   .result-card {
     background: white;
     border-radius: 1rem;
     padding: 3rem;
     box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
   }

   .result-card img {
     width: 100%;
     max-height: 400px;
     object-fit: cover;
     border-radius: 0.5rem;
     margin-bottom: 2rem;
   }

   .result-card h3 {
     font-size: 2rem;
     color: #1e293b;
     margin-bottom: 1rem;
   }

   .result-card p {
     color: #475569;
     font-size: 1.1rem;
     line-height: 1.8;
     margin-bottom: 2rem;
   }

   .benefits-section h4 {
     font-size: 1.5rem;
     color: #1e293b;
     margin-bottom: 1.5rem;
   }

   .benefits-section li {
     font-size: 1.1rem;
     padding: 1rem;
     margin-bottom: 0.5rem;
     background: #f8fafc;
     border-radius: 0.5rem;
     transition: transform 0.3s ease;
   }

   .benefits-section li:hover {
     transform: translateX(10px);
   }

   .benefits-section i {
     color: #2563eb;
   }

   .action-buttons {
     display: flex;
     gap: 1rem;
     margin-top: 3rem;
   }

   .primary-button,
   .secondary-button {
     flex: 1;
     padding: 1rem 2rem;
     font-size: 1.1rem;
     font-weight: 600;
     border-radius: 0.5rem;
     transition: all 0.3s ease;
   }

   .primary-button {
     background: #2563eb;
     color: white;
     border: none;
   }

   .primary-button:hover {
     background: #1d4ed8;
     transform: translateY(-2px);
   }

   .secondary-button {
     background: #f8fafc;
     color: #475569;
     border: 2px solid #e2e8f0;
   }

   .secondary-button:hover {
     background: #f1f5f9;
     transform: translateY(-2px);
   }

   @media (max-width: 768px) {
     .finder-container {
       padding: 2rem 1rem;
     }

     .question-screen {
       padding: 2rem 1rem;
     }

     .option-button {
       padding: 1.5rem;
     }

     .action-buttons {
       flex-direction: column;
     }
   }

  `]
})
export class SolutionFinderComponent {
  questions: Question[] = [
    {
      id: 1,
      text: '¿Cuál es tu principal objetivo al considerar energía solar?',
      options: [
        {
          text: 'Independencia total de la red eléctrica',
          weights: { offGrid: 10, onGrid: 0, bombeo: 0 }
        },
        {
          text: 'Reducir el costo de la factura de luz',
          weights: { offGrid: 0, onGrid: 10, bombeo: 0 }
        },
        {
          text: 'Bombear agua en una zona sin electricidad',
          weights: { offGrid: 0, onGrid: 0, bombeo: 10 }
        },
        {
          text: 'Contribuir al medio ambiente',
          weights: { offGrid: 5, onGrid: 5, bombeo: 5 }
        }
      ]
    },
    {
      id: 2,
      text: '¿Tienes acceso a la red eléctrica en tu ubicación?',
      options: [
        {
          text: 'Sí, tengo conexión confiable',
          weights: { offGrid: 0, onGrid: 10, bombeo: 5 }
        },
        {
          text: 'Sí, pero el servicio es inestable',
          weights: { offGrid: 8, onGrid: 5, bombeo: 5 }
        },
        {
          text: 'No, es una zona sin acceso a la red',
          weights: { offGrid: 10, onGrid: 0, bombeo: 10 }
        }
      ]
    },
    {
      id: 3,
      text: '¿Cuál es tu presupuesto aproximado para la inversión?',
      options: [
        {
          text: 'Menos de $5,000 USD',
          weights: { offGrid: 0, onGrid: 5, bombeo: 8 }
        },
        {
          text: 'Entre $5,000 y $15,000 USD',
          weights: { offGrid: 5, onGrid: 10, bombeo: 5 }
        },
        {
          text: 'Más de $15,000 USD',
          weights: { offGrid: 10, onGrid: 5, bombeo: 0 }
        }
      ]
    },
    {
      id: 4,
      text: '¿Cuál es el uso principal que le darás a la energía?',
      options: [
        {
          text: 'Uso residencial (iluminación, electrodomésticos)',
          weights: { offGrid: 5, onGrid: 10, bombeo: 0 }
        },
        {
          text: 'Bombeo de agua para riego o consumo',
          weights: { offGrid: 0, onGrid: 0, bombeo: 10 }
        },
        {
          text: 'Uso comercial o industrial',
          weights: { offGrid: 8, onGrid: 5, bombeo: 0 }
        }
      ]
    }
  ];

  results: { [key: string]: Result } = {
    offGrid: {
      type: 'offGrid',
      title: 'Sistema Off Grid',
      description: 'Un sistema autónomo que te permite independizarte completamente de la red eléctrica.',
      imageUrl: '/offgrid.jpg',
      benefits: [
        'Independencia energética total',
        'Sin facturas de electricidad',
        'Ideal para zonas sin acceso a la red',
        'Sistema expandible según necesidades'
      ]
    },
    onGrid: {
      type: 'onGrid',
      title: 'Sistema On Grid',
      description: 'La solución perfecta para reducir tus costos de energía manteniéndote conectado a la red.',
      imageUrl: '/ongrid.jpg',
      benefits: [
        'Reducción significativa en facturas',
        'Menor inversión inicial',
        'Mantenimiento mínimo',
        'Recuperación rápida de la inversión'
      ]
    },
    bombeo: {
      type: 'bombeo',
      title: 'Sistema de Bombeo Solar',
      description: 'Solución especializada para el bombeo de agua utilizando energía solar.',
      imageUrl: '/bombeo.jpg',
      benefits: [
        'Sin costos de operación',
        'Ideal para zonas remotas',
        'Mantenimiento simple',
        'Funciona sin baterías'
      ]
    }
  };

  started: boolean = false;
  finished: boolean = false;
  currentQuestionIndex: number = 0;
  selectedOption: Option | null = null;
  scores: { offGrid: number; onGrid: number; bombeo: number } = {
    offGrid: 0,
    onGrid: 0,
    bombeo: 0
  };
  recommendedSolution!: Result;

  get currentQuestion(): Question {
    return this.questions[this.currentQuestionIndex];
  }

  refreshInfo(): void {
    this.cdr.detectChanges();
  }

  get isLastQuestion(): boolean {
    return this.currentQuestionIndex === this.questions.length - 1;
  }

  get progressWidth(): string {
    return `${((this.currentQuestionIndex + 1) / this.questions.length) * 100}%`;
  }

  constructor(private cdr: ChangeDetectorRef) {}

  startQuiz(): void {
    this.started = true;
    this.cdr.detectChanges();

  }

  selectOption(option: Option): void {
    this.selectedOption = option;
  }

  previousQuestion(): void {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
      this.selectedOption = null;
    }
  }

  nextQuestion(): void {
    if (this.selectedOption) {
      // Add scores from selected option
      this.scores.offGrid += this.selectedOption.weights.offGrid;
      this.scores.onGrid += this.selectedOption.weights.onGrid;
      this.scores.bombeo += this.selectedOption.weights.bombeo;

      if (this.isLastQuestion) {
        this.calculateResult();
      } else {
        this.currentQuestionIndex++;
        this.selectedOption = null;
      }
    }
  }

  calculateResult(): void {
    // Find the solution type with the highest score
    const maxScore = Math.max(
      this.scores.offGrid,
      this.scores.onGrid,
      this.scores.bombeo
    );

    if (this.scores.offGrid === maxScore) {
      this.recommendedSolution = this.results['offGrid'];
    } else if (this.scores.onGrid === maxScore) {
      this.recommendedSolution = this.results['onGrid'];
    } else {
      this.recommendedSolution = this.results['bombeo'];
    }

    this.finished = true;
    this.refreshInfo();
  }

  restartQuiz(): void {
    this.started = true;
    this.finished = false;
    this.currentQuestionIndex = 0;
    this.selectedOption = null;
    this.scores = {
      offGrid: 0,
      onGrid: 0,
      bombeo: 0
    };
    this.refreshInfo();
  }
  scrollToContacto() {
    const contactoSection = document.getElementById('contacto');
    if (contactoSection) {
      contactoSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}