import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { 
  trigger, 
  transition, 
  style, 
  animate,
  AnimationEvent 
} from '@angular/animations';

interface Question {
  id: string;
  text: string;
  type: 'radio' | 'checkbox' | 'number';
  options?: Array<{ value: string; label: string }>;
  nextQuestion?: string;
  condition?: {
    value: string;
    nextQuestion: string;
  }[];
}

interface Appliance {
  name: string;
  watts: number;
  quantity: number;
  hoursPerDay: number;
}

@Component({
  selector: 'app-presupuesto',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <main class="presupuesto-container">
      <!-- Progress Bar -->
      <div class="progress-container">
        <div class="progress-bar" [style.width]="progress + '%'"></div>
        <span class="progress-text">{{ progress }}% Completado</span>
      </div>

      <!-- Initial Section -->
      <section *ngIf="currentStep === 'start'">
        <div class="welcome-section">
          <h1>Calculadora Solar Personalizada</h1>
          <p class="subtitle">Descubre la solución solar perfecta para tus necesidades</p>
          <button class="primary-button" (click)="startQuestionnaire()">
            <i class="fas fa-solar-panel"></i>
            Comenzar Cálculo
          </button>
        </div>
      </section>

      <!-- Questionnaire Section -->
      <section *ngIf="currentStep === 'questionnaire'">
  <div class="question-card">
    <h2>{{ currentQuestion?.text }}</h2>
    
    <ng-container *ngIf="currentQuestion">
      <div class="options-container" [ngSwitch]="currentQuestion.type">
        <!-- Radio Options -->
        <div *ngSwitchCase="'radio'" class="radio-options">
          <div *ngFor="let option of currentQuestion.options" class="radio-option">
            <input 
              type="radio" 
              [id]="option.value" 
              [name]="currentQuestion.id"
              [value]="option.value"
              [(ngModel)]="answers[currentQuestion.id]"
            >
            <label [for]="option.value">{{ option.label }}</label>
          </div>
        </div>

        <!-- Number Input -->
        <div *ngSwitchCase="'number'" class="number-input">
          <input 
            type="number" 
            [(ngModel)]="answers[currentQuestion.id]"
            placeholder="Ingrese un valor"
          >
        </div>
      </div>

      <div class="button-group">
        <button 
          *ngIf="!isFirstQuestion" 
          class="secondary-button"
          (click)="previousQuestion()"
        >
          <i class="fas fa-arrow-left"></i> Anterior
        </button>
        <button 
          class="primary-button"
          (click)="nextQuestion()"
          [disabled]="!hasAnsweredCurrentQuestion()"
        >
          {{ isLastQuestion ? 'Ver Resultados' : 'Siguiente' }}
          <i class="fas fa-arrow-right"></i>
        </button>
      </div>
    </ng-container>
  </div>
</section>

      <!-- Appliances Section -->
      <section *ngIf="currentStep === 'appliances'">
        <div class="appliances-card">
          <h2>Electrodomésticos y Consumo</h2>
          <p>Selecciona los electrodomésticos que utilizas en tu hogar:</p>

          <div class="appliances-grid">
            <div *ngFor="let appliance of selectedAppliances; let i = index" class="appliance-item">
              <div class="appliance-header">
                <span>{{ appliance.name }}</span>
                <button class="delete-button" (click)="removeAppliance(i)">
                  <i class="fas fa-times"></i>
                </button>
              </div>
              <div class="appliance-inputs">
                <div class="input-group">
                  <label>Cantidad:</label>
                  <input 
                    type="number" 
                    [(ngModel)]="appliance.quantity" 
                    min="1"
                  >
                </div>
                <div class="input-group">
                  <label>Horas por día:</label>
                  <input 
                    type="number" 
                    [(ngModel)]="appliance.hoursPerDay"
                    min="0" 
                    max="24"
                  >
                </div>
              </div>
            </div>
          </div>

          <div class="add-appliance">
            <select [(ngModel)]="newApplianceType">
              <option value="">Agregar electrodoméstico...</option>
              <option *ngFor="let app of availableAppliances" [value]="app.name">
                {{ app.name }}
              </option>
            </select>
            <button 
              class="primary-button" 
              (click)="addAppliance()"
              [disabled]="!newApplianceType"
            >
              <i class="fas fa-plus"></i> Agregar
            </button>
          </div>

          <div class="button-group">
            <button class="secondary-button" (click)="currentStep = 'questionnaire'">
              <i class="fas fa-arrow-left"></i> Anterior
            </button>
            <button class="primary-button" (click)="calculateRecommendation()">
              Calcular Recomendación <i class="fas fa-calculator"></i>
            </button>
          </div>
        </div>
      </section>

      <!-- Results Section -->
      <section *ngIf="currentStep === 'results'">
        <div class="results-card">
          <div class="results-header">
            <h2>Tu Solución Solar Recomendada</h2>
            <div class="system-type">
              {{ recommendedSystem.type }}
            </div>
          </div>

          <div class="system-details">
            <div class="detail-section">
              <h3>Especificaciones del Sistema</h3>
              <ul>
                <li>
                  <i class="fas fa-solar-panel"></i>
                  <span>Potencia Total: {{ recommendedSystem.power }} kW</span>
                </li>
                <li>
                  <i class="fas fa-battery-full"></i>
                  <span>Capacidad de Batería: {{ recommendedSystem.battery }}</span>
                </li>
                <li>
                  <i class="fas fa-plug"></i>
                  <span>Tipo de Inversor: {{ recommendedSystem.inverter }}</span>
                </li>
              </ul>
            </div>

            <div class="consumption-summary">
              <h3>Resumen de Consumo</h3>
              <p>Consumo Diario Estimado: {{ dailyConsumption }} kWh</p>
              <p>Consumo Mensual Estimado: {{ monthlyConsumption }} kWh</p>
            </div>

            <div class="price-section">
              <div class="price-tag">
                <span class="currency">ARS</span>
                <span class="amount">{{ recommendedSystem.price.toLocaleString() }}</span>
              </div>
              <p class="price-note">*Precio estimado sujeto a variaciones</p>
            </div>

            <div class="benefits">
              <h3>Beneficios del Sistema</h3>
              <ul>
                <li *ngFor="let benefit of recommendedSystem.benefits">
                  <i class="fas fa-check"></i>
                  <span>{{ benefit }}</span>
                </li>
              </ul>
            </div>
          </div>

          <div class="next-steps">
            <h3>¿Qué sigue?</h3>
            <div class="action-buttons">
              <a href="/contact" class="primary-button">
                <i class="fas fa-envelope"></i>
                Solicitar Cotización Detallada
              </a>
              <button class="secondary-button" (click)="restartCalculator()">
                <i class="fas fa-redo"></i>
                Realizar Nuevo Cálculo
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  `,
  styles: [`
    :host {
      --primary: #1a5f7a;
      --primary-light: #2c7a9c;
      --primary-dark: #134559;
      --secondary: #fbb03b;
      --success: #4caf50;
      --danger: #f44336;
      --gray-50: #f9fafb;
      --gray-100: #f3f4f6;
      --gray-200: #e5e7eb;
      --gray-300: #d1d5db;
      --gray-600: #4b5563;
      --gray-700: #374151;
      --gray-800: #1f2937;
      --radius-lg: 1rem;
      --radius-md: 0.5rem;
      --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
      --shadow-md: 0 4px 6px -1px rgba(0,0,0,0.1);
    }

    .presupuesto-container {
      max-width: 800px;
      margin: 2rem auto;
      padding: 0 1rem;
    }

    .progress-container {
      margin-bottom: 2rem;
      background: var(--gray-100);
      border-radius: 9999px;
      overflow: hidden;
      height: 8px;
      position: relative;
    }

    .progress-bar {
      height: 100%;
      background: var(--primary);
      transition: width 0.3s ease;
    }

    .progress-text {
      position: absolute;
      top: 12px;
      right: 0;
      font-size: 0.875rem;
      color: var(--gray-600);
    }

    .welcome-section {
      text-align: center;
      padding: 4rem 2rem;
      background: white;
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-md);
    }

    .welcome-section h1 {
      font-size: 2.5rem;
      color: var(--gray-800);
      margin-bottom: 1rem;
    }

    .subtitle {
      color: var(--gray-600);
      margin-bottom: 2rem;
    }

    .question-card,
    .appliances-card,
    .results-card {
      background: white;
      border-radius: var(--radius-lg);
      padding: 2rem;
      box-shadow: var(--shadow-md);
    }

    .question-card h2 {
      font-size: 1.5rem;
      color: var(--gray-800);
      margin-bottom: 2rem;
    }

    .options-container {
      margin-bottom: 2rem;
    }

    .radio-options {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .radio-option {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 1rem;
      border: 1px solid var(--gray-200);
      border-radius: var(--radius-md);
      cursor: pointer;
      transition: all 0.2s;
    }

    .radio-option:hover {
      background: var(--gray-50);
    }

    .button-group {
      display: flex;
      justify-content: space-between;
      gap: 1rem;
    }

    .primary-button,
    .secondary-button {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      border-radius: var(--radius-md);
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
    }

    .primary-button {
      background: var(--primary);
      color: white;
      border: none;
    }

    .primary-button:hover {
      background: var(--primary-light);
    }

    .secondary-button {
      background: white;
      color: var(--gray-700);
      border: 1px solid var(--gray-200);
    }

    .secondary-button:hover {
      background: var(--gray-50);
    }

    .appliances-grid {
      display: grid;
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .appliance-item {
      border: 1px solid var(--gray-200);
      border-radius: var(--radius-md);
      padding: 1rem;
    }

    .appliance-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .appliance-inputs {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
    }

    .input-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .input-group input {
      padding: 0.5rem;
      border: 1px solid var(--gray-200);
      border-radius: var(--radius-md);
    }

    .add-appliance {
      display: flex;
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .add-appliance select {
      flex: 1;
      padding: 0.75rem;
      border: 1px solid var(--gray-200);
      border-radius: var(--radius-md);
    }

    .results-header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .system-type {
      display: inline-block;
      padding: 0.5rem 1rem;
      background: var(--primary);
      color: white;
      border-radius: var(--radius-md);
      margin-top: 1rem;
    }

    .system-details {
      display: grid;
      gap: 2rem;
    }

    .detail-section ul,
    .benefits ul {
      list-style: none;
      padding: 0;
    }
    li {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 0.75rem;
    }

    .price-section {
      text-align: center;
      padding: 2rem;
      background: var(--gray-50);
      border-radius: var(--radius-lg);
      margin: 2rem 0;
    }

    .price-tag {
      display: flex;
      align-items: baseline;
      justify-content: center;
      gap: 0.5rem;
    }

    .currency {
      font-size: 1.5rem;
      color: var(--gray-600);
    }

    .amount {
      font-size: 3rem;
      font-weight: 700;
      color: var(--primary);
    }

    .price-note {
      color: var(--gray-600);
      font-size: 0.875rem;
      margin-top: 0.5rem;
    }

    .next-steps {
      text-align: center;
      margin-top: 2rem;
      padding-top: 2rem;
      border-top: 1px solid var(--gray-200);
    }

    .action-buttons {
      display: flex;
      justify-content: center;
      gap: 1rem;
      margin-top: 1.5rem;
    }

    @media (max-width: 768px) {
      .button-group,
      .action-buttons {
        flex-direction: column;
      }

      .add-appliance {
        flex-direction: column;
      }

      .appliance-inputs {
        grid-template-columns: 1fr;
      }
    }
  `],
})
export class PresupuestoComponent {
  currentStep: 'start' | 'questionnaire' | 'appliances' | 'results' = 'start';
  currentQuestionIndex = 0;
  progress = 0;
  answers: Record<string, any> = {};
  newApplianceType = '';
  selectedAppliances: Appliance[] = [];
  dailyConsumption = 0;
  monthlyConsumption = 0;
  recommendedSystem: any = {};

  questions: Question[] = [
    {
      id: 'location',
      text: '¿Tienes acceso a la red eléctrica en tu ubicación?',
      type: 'radio',
      options: [
        { value: 'yes', label: 'Sí, tengo conexión a la red eléctrica' },
        { value: 'no', label: 'No, necesito una solución independiente' }
      ]
    },
    {
      id: 'purpose',
      text: '¿Cuál es el principal objetivo de tu sistema solar?',
      type: 'radio',
      options: [
        { value: 'savings', label: 'Reducir la factura de luz' },
        { value: 'independence', label: 'Independencia energética total' },
        { value: 'backup', label: 'Respaldo para cortes de energía' },
        { value: 'water', label: 'Bombeo de agua' }
      ]
    },
    {
      id: 'consumption',
      text: '¿Cuál es tu consumo mensual promedio en kWh?',
      type: 'number'
    }
  ];

  availableAppliances = [
    { name: 'Heladera', watts: 400 },
    { name: 'Lavarropas', watts: 500 },
    { name: 'Aire Acondicionado', watts: 1500 },
    { name: 'Televisor', watts: 100 },
    { name: 'Computadora', watts: 200 },
    { name: 'Microondas', watts: 1000 },
    { name: 'Iluminación LED', watts: 10 },
    { name: 'Bomba de Agua', watts: 750 },
    { name: 'Horno Eléctrico', watts: 2000 },
    { name: 'Ventilador', watts: 70 }
  ];

  get currentQuestion(): Question | null {
    return this.questions[this.currentQuestionIndex] || null;
  }
  hasAnsweredCurrentQuestion(): boolean {
    if (!this.currentQuestion) return false;
    return !!this.answers[this.currentQuestion.id];
  }

  get isFirstQuestion() {
    return this.currentQuestionIndex === 0;
  }

  get isLastQuestion() {
    return this.currentQuestionIndex === this.questions.length - 1;
  }

  startQuestionnaire() {
    this.currentStep = 'questionnaire';
    this.updateProgress();
  }

  previousQuestion() {
    if (!this.isFirstQuestion) {
      this.currentQuestionIndex--;
      this.updateProgress();
    }
  }

  nextQuestion() {
    if (this.isLastQuestion) {
      this.currentStep = 'appliances';
    } else {
      this.currentQuestionIndex++;
    }
    this.updateProgress();
  }

  updateProgress() {
    const totalSteps = this.questions.length + 2; // +2 for appliances and results
    const currentStep = this.currentQuestionIndex + (this.currentStep === 'appliances' ? this.questions.length : 0);
    this.progress = Math.round((currentStep / totalSteps) * 100);
  }

  addAppliance() {
    if (this.newApplianceType) {
      const appliance = this.availableAppliances.find(a => a.name === this.newApplianceType);
      if (appliance) {
        this.selectedAppliances.push({
          name: appliance.name,
          watts: appliance.watts,
          quantity: 1,
          hoursPerDay: 1
        });
      }
      this.newApplianceType = '';
    }
  }

  removeAppliance(index: number) {
    this.selectedAppliances.splice(index, 1);
  }

  calculateRecommendation() {
    // Calculate daily consumption
    this.dailyConsumption = this.selectedAppliances.reduce((total, appliance) => {
      return total + (appliance.watts * appliance.quantity * appliance.hoursPerDay) / 1000;
    }, 0);
    
    this.monthlyConsumption = this.dailyConsumption * 30;

    // Determine system type based on answers and consumption
    if (this.answers['purpose'] === 'water') {
      this.recommendBombeo();
    } else if (this.answers['location'] === 'no' || this.answers['purpose'] === 'independence') {
      this.recommendOffGrid();
    } else {
      this.recommendOnGrid();
    }

    this.currentStep = 'results';
    this.progress = 100;
  }

  recommendOnGrid() {
    const systemSize = Math.ceil(this.monthlyConsumption / 120); // Simplified calculation
    this.recommendedSystem = {
      type: 'Sistema On-Grid',
      power: systemSize,
      inverter: `Inversor Grid-Tie ${systemSize}kW`,
      battery: 'No requiere',
      price: systemSize * 800000, // Base price in ARS
      benefits: [
        'Reducción del 80% en tu factura de luz',
        'Conexión a la red eléctrica mantenida',
        'Sin mantenimiento de baterías',
        'Retorno de inversión en 4-6 años'
      ]
    };
  }

  recommendOffGrid() {
    const systemSize = Math.ceil(this.monthlyConsumption / 100); // Adjusted for battery losses
    this.recommendedSystem = {
      type: 'Sistema Off-Grid',
      power: systemSize,
      inverter: `Inversor/Cargador ${systemSize}kW`,
      battery: `${systemSize * 2}kWh Litio`,
      price: systemSize * 1200000, // Base price in ARS
      benefits: [
        'Independencia energética total',
        'Sin facturas de electricidad',
        'Energía 24/7',
        'Sistema expandible a futuro'
      ]
    };
  }

  recommendBombeo() {
    const systemSize = Math.ceil(this.dailyConsumption / 6); // Assuming 6 hours of sun
    this.recommendedSystem = {
      type: 'Sistema de Bombeo Solar',
      power: systemSize,
      inverter: `Controlador de Bombeo ${systemSize}kW`,
      battery: 'Operación directa',
      price: systemSize * 600000, // Base price in ARS
      benefits: [
        'Bombeo de agua sin costo operativo',
        'Mantenimiento mínimo',
        'Ideal para riego y consumo',
        'Funciona con luz solar directa'
      ]
    };
  }

  restartCalculator() {
    this.currentStep = 'start';
    this.currentQuestionIndex = 0;
    this.progress = 0;
    this.answers = {};
    this.selectedAppliances = [];
    this.recommendedSystem = {};
  }
}