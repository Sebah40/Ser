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
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem;
  min-height: 500px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.start-screen {
  text-align: center;
  padding: 2rem;
}

.start-screen h1 {
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
  color: #2c3e50;
}

.start-screen p {
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 2rem;
}

.progress-bar {
  width: 100%;
  height: 10px;
  background-color: #ddd;
  border-radius: 5px;
  margin-bottom: 2rem;
  overflow: hidden;
}

.progress {
  height: 100%;
  background: linear-gradient(90deg, #4CAF50, #45a049);
  border-radius: 5px;
  transition: width 0.3s ease;
}

.question-content {
  margin-bottom: 2rem;
}

.question-content h2 {
  font-size: 1.8rem;
  color: #2c3e50;
  margin-bottom: 1.5rem;
}

.options-grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
}

.option-button {
  padding: 1.5rem;
  border: 2px solid #ddd;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s ease;
  text-align: center;
}

.option-button:hover {
  border-color: #4CAF50;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.option-button.selected {
  border-color: #4CAF50;
  background-color: #e9f5e9;
}

.navigation-buttons {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.primary-button {
  padding: 1rem 2rem;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  margin-left: auto; /* Pushes the button to the right */
}

.primary-button:hover {
  background-color: #45a049;
  transform: translateY(-2px);
}

.secondary-button {
  padding: 1rem 2rem;
  background-color: #f5f5f5;
  color: #666;
  border: 1px solid #ddd;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
}

.secondary-button:hover {
  background-color: #e0e0e0;
}

.result-screen {
  text-align: center;
  padding: 2rem 0;
}

.result-card {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  margin: 1rem 0;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.result-card img {
  width: 100%;
  max-width: 400px;
  height: auto;
  border-radius: 8px;
  margin-bottom: 1.5rem;
}

.result-card h3 {
  font-size: 1.8rem;
  color: #2c3e50;
  margin-bottom: 1rem;
}

.benefits-section {
  text-align: left;
  margin-top: 1.5rem;
}

.benefits-section h4 {
  color: #2c3e50;
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.benefits-section ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.benefits-section li {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  color: #666;
  font-size: 1rem;
}

.benefits-section i {
  color: #4CAF50;
  font-size: 1.2rem;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
}

@media (max-width: 600px) {
  .finder-container {
    padding: 1rem;
  }

  .start-screen h1 {
    font-size: 2rem;
  }

  .options-grid {
    grid-template-columns: 1fr;
  }

  .action-buttons {
    flex-direction: column;
  }

  .result-card img {
    max-width: 100%;
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