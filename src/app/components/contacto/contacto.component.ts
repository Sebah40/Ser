import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  template: `
    <section class="contact-container" id="contacto">
      <div class="overlay">
        <div class="contact-content">
          <div class="contact-info">
            <h2>Contacta con Nosotros</h2>
            <p class="subtitle">
              Estamos aquí para ayudarte con tus proyectos de energía solar
            </p>

            <div class="contact-details">
              <div class="contact-item">
                <i class="icon">📍</i>
                <div>
                  <h3>Ubicación</h3>
                  <p>Las Heras 331, Concordia, Entre Ríos</p>
                </div>
              </div>
            </div>
          </div>

          <div class="contact-form">
            <form [formGroup]="contactForm" (ngSubmit)="onSubmit()">
              <div class="form-group">
                <input
                  type="text"
                  formControlName="name"
                  placeholder="Nombre completo *"
                  [class.invalid]="isFieldInvalid('name')"
                />
                <div class="error-message" *ngIf="isFieldInvalid('name')">
                  Por favor, introduce tu nombre
                </div>
              </div>

              <div class="form-group">
                <input
                  type="email"
                  formControlName="email"
                  placeholder="Email *"
                  [class.invalid]="isFieldInvalid('email')"
                />
                <div class="error-message" *ngIf="isFieldInvalid('email')">
                  Por favor, introduce un email válido
                </div>
              </div>

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
                    Selecciona el motivo de contacto *
                  </option>
                  <option value="info">Información general</option>
                  <option value="quote">Solicitar presupuesto</option>
                  <option value="support">Soporte técnico</option>
                  <option value="other">Otro</option>
                </select>
              </div>

              <div class="form-group">
                <textarea
                  formControlName="message"
                  placeholder="Tu mensaje *"
                  rows="5"
                  [class.invalid]="isFieldInvalid('message')"
                ></textarea>
                <div class="error-message" *ngIf="isFieldInvalid('message')">
                  Por favor, escribe tu mensaje
                </div>
              </div>

              <button
                type="submit"
                [disabled]="contactForm.invalid || isSubmitting"
                [class.submitting]="isSubmitting"
              >
                {{ isSubmitting ? 'Enviando...' : 'Enviar mensaje' }}
              </button>
            </form>
          </div>
        </div>
      </div>

      <!-- Success Modal -->
      <div class="modal" *ngIf="showSuccessModal">
        <div class="modal-content">
          <div class="success-icon">✓</div>
          <h3>¡Mensaje enviado!</h3>
          <p>Nos pondremos en contacto contigo pronto.</p>
          <button (click)="closeModal()">Aceptar</button>
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      .contact-container {
        position: relative;
        width: 100%;
        min-height: 100vh;
        background: linear-gradient(135deg, #1a1a1a 0%, #363636 100%);
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .overlay {
        width: 100%;
        padding: 2rem;
      }

      .contact-content {
        max-width: 1200px;
        margin: 0 auto;
        display: grid;
        grid-template-columns: 1fr 1.5fr;
        gap: 4rem;
        background: rgba(255, 255, 255, 0.95);
        border-radius: 20px;
        padding: 3rem;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
      }

      .contact-info {
        color: #333;
      }

      .contact-info h2 {
        font-size: 2.5rem;
        margin-bottom: 1rem;
        color: #1a1a1a;
      }

      .subtitle {
        font-size: 1.1rem;
        color: #666;
        margin-bottom: 3rem;
      }

      .contact-details {
        display: flex;
        flex-direction: column;
        gap: 2rem;
      }

      .contact-item {
        display: flex;
        align-items: flex-start;
        gap: 1rem;
      }

      .icon {
        font-size: 1.5rem;
        min-width: 40px;
        height: 40px;
        background: #f0f0f0;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .contact-item h3 {
        font-size: 1.1rem;
        margin: 0 0 0.5rem 0;
        color: #1a1a1a;
      }

      .contact-item p {
        color: #666;
        margin: 0;
      }

      .contact-form {
        background: white;
        border-radius: 10px;
        padding: 2rem;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      }

      .form-group {
        margin-bottom: 1.5rem;
      }

      input,
      select,
      textarea {
        width: 100%;
        padding: 1rem;
        border: 1px solid #ddd;
        border-radius: 8px;
        font-size: 1rem;
        transition: border-color 0.3s ease;
      }

      input:focus,
      select:focus,
      textarea:focus {
        outline: none;
        border-color: #007bff;
      }

      input.invalid,
      textarea.invalid {
        border-color: #dc3545;
      }

      .error-message {
        color: #dc3545;
        font-size: 0.875rem;
        margin-top: 0.5rem;
      }

      button {
        width: 100%;
        padding: 1rem;
        background: #007bff;
        color: white;
        border: none;
        border-radius: 8px;
        font-size: 1rem;
        cursor: pointer;
        transition: background-color 0.3s ease;
      }

      button:hover:not(:disabled) {
        background: #0056b3;
      }

      button:disabled {
        background: #ccc;
        cursor: not-allowed;
      }

      button.submitting {
        position: relative;
        color: transparent;
      }

      button.submitting::after {
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

      @keyframes spinner {
        to {
          transform: rotate(360deg);
        }
      }

      .modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
      }

      .modal-content {
        background: white;
        padding: 2rem;
        border-radius: 10px;
        text-align: center;
        max-width: 400px;
        width: 90%;
      }

      .success-icon {
        width: 60px;
        height: 60px;
        background: #28a745;
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 2rem;
        margin: 0 auto 1rem;
      }

      @media (max-width: 992px) {
        .contact-content {
          grid-template-columns: 1fr;
          gap: 2rem;
        }
      }

      @media (max-width: 768px) {
        .overlay {
          padding: 1rem;
        }

        .contact-content {
          padding: 2rem;
        }

        .contact-info h2 {
          font-size: 2rem;
        }
      }
    `,
  ],
})
export class ContactoComponent implements OnInit {
  contactForm!: FormGroup;
  isSubmitting = false;
  showSuccessModal = false;

  constructor(private fb: FormBuilder, private http: HttpClient) {}

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

      // Replace with your actual email service endpoint
      const emailEndpoint = 'your-email-service-endpoint';

      this.http.post(emailEndpoint, this.contactForm.value).subscribe({
        next: () => {
          this.isSubmitting = false;
          this.showSuccessModal = true;
          this.contactForm.reset();
        },
        error: (error) => {
          console.error('Error sending email:', error);
          this.isSubmitting = false;
          // Handle error (show error message to user)
        },
      });
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
