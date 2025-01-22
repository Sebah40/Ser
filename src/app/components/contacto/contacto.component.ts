import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <section class="contact-container" id="contacto">
  <div class="overlay">
    <div class="contact-content">
      <!-- Contact Info Side -->
      <div class="contact-info">
        <h2>¿Hablamos?</h2>
        <p class="subtitle">
          Estamos aquí para ayudarte con tus proyectos de energía solar
        </p>

        <div class="contact-details">
          <div class="contact-item">
            <i class="fas fa-map-marker-alt"></i>
            <p>Las Heras 331 Primer Piso, Concordia</p>
          </div>
          
          <a
            href="https://wa.me/message/6OHMJMTGTRMWP1/?text=hola%2C%20quer%C3%ADa%20consultar%20sobre%3A%20"
            target="_blank"
            class="whatsapp-button"
          >
            <i class="fab fa-whatsapp"></i>
            <span>¿Tienes algún plan?</span>
          </a>
          <div class="find-solution-container">
            <a href="#finder" class="find-solution-button">Encuentra tu solución</a>
          </div>
        </div>
      </div>

      <!-- Contact Form Side -->
      <div class="contact-form">
        <form [formGroup]="contactForm" (ngSubmit)="onSubmit()" action="https://formspree.io/f/xkggpdgb" method="POST">
          <div class="form-row">
            <div class="form-group">
              <input
                type="text"
                formControlName="name"
                placeholder="Nombre completo *"
                [class.invalid]="isFieldInvalid('name')"
              />
              <small class="error-message" *ngIf="isFieldInvalid('name')">
                Nombre requerido
              </small>
            </div>

            <div class="form-group">
              <input
                type="email"
                formControlName="email"
                placeholder="Email *"
                [class.invalid]="isFieldInvalid('email')"
              />
              <small class="error-message" *ngIf="isFieldInvalid('email')">
                Email válido requerido
              </small>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <input
                type="tel"
                formControlName="phone"
                placeholder="Teléfono"
              />
            </div>

            <div class="form-group">
              <select formControlName="subject">
                <option value="" disabled selected>
                  Motivo de contacto *
                </option>
                <option value="info">Información general</option>
                <option value="quote">Solicitar presupuesto</option>
                <option value="support">Soporte técnico</option>
                <option value="other">Otro</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <textarea
              formControlName="message"
              placeholder="Tu mensaje *"
              rows="4"
              [class.invalid]="isFieldInvalid('message')"
            ></textarea>
            <small class="error-message" *ngIf="isFieldInvalid('message')">
              Mensaje requerido
            </small>
          </div>

          <button type="submit" [disabled]="contactForm.invalid || isSubmitting" [class.submitting]="isSubmitting">
            <span>{{ isSubmitting ? 'Enviando...' : 'Enviar mensaje' }}</span>
          </button>
        </form>
      </div>
    </div>
  </div>

  <!-- Success Modal -->
  <div class="modal" *ngIf="showSuccessModal" (click)="closeModal()">
    <div class="modal-content" (click)="$event.stopPropagation()">
      <div class="success-icon">✓</div>
      <h3>¡Mensaje enviado!</h3>
      <p>Nos pondremos en contacto contigo pronto.</p>
      <button class="modal-button" (click)="closeModal()">Aceptar</button>
    </div>
  </div>
</section>
  `,
  styles: [
    `
      .contact-container {
        min-height: 80vh;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 4rem 1rem;
      }

      .contact-content {
        max-width: 1000px;
        margin: 0 auto;
        display: grid;
        grid-template-columns: 1fr 1.5fr;
        gap: 3rem;
        background: white;
        border-radius: 16px;
        padding: 2.5rem;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
      }

      .contact-info {
        padding-right: 2rem;
        border-right: 1px solid #edf2f7;
      }

      .contact-info h2 {
        font-size: 2.2rem;
        color: #0c457a;
        margin-bottom: 1rem;
        font-weight: 700;
      }

      .subtitle {
        color: #64748b;
        font-size: 1rem;
        line-height: 1.5;
        margin-bottom: 2rem;
      }

      .contact-details {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      }

      .contact-item {
        display: flex;
        align-items: center;
        gap: 1rem;
        color: #64748b;
      }

      .contact-item i {
        color: #0c457a;
        font-size: 1.2rem;
      }

      .whatsapp-button {
        display: inline-flex;
        align-items: center;
        gap: 0.75rem;
        background: #309b5c;
        color: white;
        padding: 0.75rem 1.5rem;
        border-radius: 50px;
        text-decoration: none;
        font-weight: 500;
        transition: all 0.3s ease;
        box-shadow: 0 4px 12px #000000;
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 1000;
      }

      .whatsapp-button:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
        background: #128c7e;
      }

      .whatsapp-button i {
        font-size: 1.3rem;
      }

      @media (max-width: 768px) {
        .whatsapp-button {
          padding: 0.5rem 1rem;
          font-size: 0.875rem;
        }
      }

      .form-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
        margin-bottom: 1rem;
      }

      .form-group {
        margin-bottom: 1rem;
      }

      input,
      select,
      textarea {
        width: 100%;
        padding: 0.75rem 1rem;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        font-size: 0.95rem;
        transition: all 0.3s ease;
        background: #f8fafc;
      }
      .find-solution-button {
  display: inline-block;
  background-color: #0c457a;
  color: white;
  padding: 1rem 2rem;
  border-radius: 50px;
  font-size: 1.1rem;
  font-weight: 600;
  text-decoration: none;
  transition: background-color 0.3s ease, transform 0.3s ease;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}

/* Button hover effect */
.find-solution-button:hover {
  background-color: #0d5499;
  transform: translateY(-3px);
}

/* Button focus effect */
.find-solution-button:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(12, 69, 122, 0.3);
}

/* Button for mobile responsiveness */
@media (max-width: 768px) {
  .find-solution-button {
    padding: 0.8rem 1.6rem;
    font-size: 1rem;
  }
}

      input:focus,
      select:focus,
      textarea:focus {
        outline: none;
        border-color: #0c457a;
        background: white;
        box-shadow: 0 0 0 3px rgba(12, 69, 122, 0.1);
      }

      .invalid {
        border-color: #ef4444;
      }

      .error-message {
        color: #ef4444;
        font-size: 0.75rem;
        margin-top: 0.25rem;
      }

      button[type='submit'] {
        width: 100%;
        padding: 0.875rem;
        background: #0c457a;
        color: white;
        border: none;
        border-radius: 8px;
        font-size: 1rem;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.3s ease;
      }

      button[type='submit']:hover:not(:disabled) {
        background: #0d5499;
        transform: translateY(-1px);
      }

      button[type='submit']:disabled {
        background: #94a3b8;
        cursor: not-allowed;
      }

      .submitting {
        position: relative;
      }

      .submitting span {
        opacity: 0;
      }

      .submitting::after {
        content: '';
        position: absolute;
        width: 20px;
        height: 20px;
        top: 50%;
        left: 50%;
        margin: -10px 0 0 -10px;
        border: 2px solid white;
        border-top-color: transparent;
        border-radius: 50%;
        animation: spinner 0.8s linear infinite;
      }

      /* Modal styles */
      .modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(4px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
      }

      .modal-content {
        background: white;
        padding: 2rem;
        border-radius: 16px;
        text-align: center;
        max-width: 400px;
        width: 90%;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
          0 10px 10px -5px rgba(0, 0, 0, 0.04);
      }

      .success-icon {
        width: 60px;
        height: 60px;
        background: #22c55e;
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.8rem;
        margin: 0 auto 1.5rem;
      }

      .modal-button {
        margin-top: 1.5rem;
        padding: 0.75rem 2rem;
        background: #0c457a;
        color: white;
        border: none;
        border-radius: 8px;
        font-size: 1rem;
        cursor: pointer;
        transition: all 0.3s ease;
      }

      @media (max-width: 768px) {
        .contact-content {
          grid-template-columns: 1fr;
          gap: 2rem;
          padding: 1.5rem;
        }

        .contact-info {
          padding-right: 0;
          border-right: none;
          border-bottom: 1px solid #edf2f7;
          padding-bottom: 2rem;
        }

        .form-row {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class ContactoComponent implements OnInit {
  contactForm!: FormGroup;
  isSubmitting = false;
  showSuccessModal = false;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      subject: ['', Validators.required],
      message: ['', Validators.required],
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.contactForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  onSubmit() {
    if (this.contactForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      setTimeout(() => {
        this.isSubmitting = false;
        this.showSuccessModal = true;
        this.contactForm.reset();
      }, 1000);
    } else {
      Object.keys(this.contactForm.controls).forEach((key) => {
        const control = this.contactForm.get(key);
        if (control) {
          control.markAsTouched();
        }
      });
    }
  }

  closeModal() {
    this.showSuccessModal = false;
  }
}
