import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BlogCreateService } from '../../services/blog-create.service';

@Component({
  selector: 'app-blog-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <section class="blog-create-section">
      <div class="blog-form-container">
        <div class="form-card">
          <h2>Crear Nuevo Post</h2>
          <p class="subtitle">Completa los detalles del post y el código de autenticación</p>
          <form [formGroup]="blogForm" (ngSubmit)="createPost()">
            <!-- Auth Code Field -->
            <div class="form-group">
              <input 
                type="text" 
                formControlName="authCode"
                placeholder="Código de autenticación *"
                [class.invalid]="isFieldInvalid('authCode')"
              >
              <small class="error-message" *ngIf="isFieldInvalid('authCode')">
                El código es requerido
              </small>
            </div>

            <div class="form-divider"></div>

            <!-- Post Details -->
            <div class="form-group">
              <input 
                type="text" 
                formControlName="title"
                placeholder="Título *"
                [class.invalid]="isFieldInvalid('title')"
              >
              <small class="error-message" *ngIf="isFieldInvalid('title')">
                El título es requerido
              </small>
            </div>

            <div class="form-group">
              <input 
                type="text" 
                formControlName="description"
                placeholder="Descripción corta *"
                [class.invalid]="isFieldInvalid('description')"
              >
              <small class="error-message" *ngIf="isFieldInvalid('description')">
                La descripción es requerida
              </small>
            </div>

            <div class="form-group">
              <textarea 
                formControlName="content"
                placeholder="Contenido del post *"
                rows="6"
                [class.invalid]="isFieldInvalid('content')"
              ></textarea>
              <small class="error-message" *ngIf="isFieldInvalid('content')">
                El contenido es requerido
              </small>
            </div>

            <div class="form-row">
              <div class="form-group">
                <select formControlName="category"
                        [class.invalid]="isFieldInvalid('category')">
                  <option value="" disabled>Selecciona categoría *</option>
                  <option value="proyecto">Proyecto</option>
                  <option value="artículo">Artículo</option>
                </select>
                <small class="error-message" *ngIf="isFieldInvalid('category')">
                  La categoría es requerida
                </small>
              </div>

              <div class="form-group">
                <input 
                  type="text" 
                  formControlName="imageUrl"
                  placeholder="URL de la imagen *"
                  [class.invalid]="isFieldInvalid('imageUrl')"
                >
                <small class="error-message" *ngIf="isFieldInvalid('imageUrl')">
                  La URL de la imagen es requerida
                </small>
              </div>
            </div>

            <!-- Project Stats (only shown for projects) -->
            <div class="form-group" *ngIf="blogForm.get('category')?.value === 'proyecto'">
              <h3>Estadísticas del Proyecto</h3>
              <div class="stats-container">
                <input 
                  type="text" 
                  formControlName="powerOutput"
                  placeholder="Potencia (ej: 100 kW)"
                >
                <input 
                  type="number" 
                  formControlName="panelsInstalled"
                  placeholder="Número de paneles"
                >
                <input 
                  type="text" 
                  formControlName="costSavings"
                  placeholder="Ahorro estimado"
                >
              </div>
            </div>

            <div class="form-group">
              <input 
                type="text" 
                formControlName="tags"
                placeholder="Tags (separados por coma)"
              >
            </div>

            <!-- Error Message Display -->
            <div class="error-container" *ngIf="errorMessage">
              <p class="error-message">{{ errorMessage }}</p>
            </div>

            <div class="button-group">
              <button type="button" class="secondary" (click)="resetForm()">
                Cancelar
              </button>
              <button type="submit" [disabled]="blogForm.invalid || isSubmitting">
                <span>{{ isSubmitting ? 'Creando...' : 'Crear Post' }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Success Modal -->
      <div class="modal" *ngIf="showSuccessModal" (click)="closeModal()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <div class="success-icon">✓</div>
          <h3>¡Post Creado!</h3>
          <p>El post ha sido creado exitosamente.</p>
          <button (click)="closeModal()">Aceptar</button>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .blog-create-section {
      padding: 2rem;
      min-height: 100vh;
      background: var(--background-light, #f8fafc);
    }

    .auth-container, .blog-form-container {
      max-width: 800px;
      margin: 0 auto;
    }

    .form-divider {
  height: 1px;
  background: var(--border-color, #e2e8f0);
  margin: 2rem 0;
  width: 100%;
}

.error-container {
  margin: 1rem 0;
  padding: 1rem;
  background: #fee2e2;
  border-radius: 8px;
  border: 1px solid #ef4444;
}

.error-container .error-message {
  color: #dc2626;
  margin: 0;
  text-align: center;
}

    .auth-card, .form-card {
      background: white;
      padding: 2rem;
      border-radius: 16px;
      box-shadow: 0 4px 20px rgba(12, 69, 122, 0.1);
    }

    .auth-card {
      max-width: 400px;
      margin: 4rem auto;
    }

    h2 {
      color: var(--primary-color, #0c457a);
      margin-bottom: 1rem;
      font-size: 1.8rem;
    }

    .subtitle {
      color: var(--text-secondary, #64748b);
      margin-bottom: 2rem;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    input, select, textarea {
      width: 100%;
      padding: 0.75rem 1rem;
      border: 1px solid var(--border-color, #e2e8f0);
      border-radius: 8px;
      font-size: 1rem;
      transition: all 0.3s ease;
    }

    input:focus, select:focus, textarea:focus {
      outline: none;
      border-color: var(--primary-color, #0c457a);
      box-shadow: 0 0 0 3px rgba(12, 69, 122, 0.1);
    }

    .invalid {
      border-color: #ef4444;
    }

    .error-message {
      color: #ef4444;
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }

    .stats-container {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1rem;
      margin-top: 1rem;
    }

    .button-group {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
      margin-top: 2rem;
    }

    button {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 8px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    button[type="submit"] {
      background: var(--primary-color, #0c457a);
      color: white;
    }

    button.secondary {
      background: var(--background-light, #f8fafc);
      color: var(--text-primary, #1e293b);
    }

    button:hover:not(:disabled) {
      transform: translateY(-2px);
    }

    button:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    /* Modal Styles */
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

    @media (max-width: 768px) {
      .form-row, .stats-container {
        grid-template-columns: 1fr;
      }

      .button-group {
        flex-direction: column;
      }

      button {
        width: 100%;
      }
    }
  `]
})
export class BlogCreateComponent implements OnInit {
  blogForm: FormGroup;
  isAuthenticated = false;
  isSubmitting = false;
  showSuccessModal = false;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private blogCreateService: BlogCreateService
  ) {
    this.blogForm = this.fb.group({
      authCode: ['', [Validators.required, Validators.minLength(6)]],  // Move authCode here
      title: ['', Validators.required],
      description: ['', Validators.required],
      content: ['', Validators.required],
      imageUrl: ['', Validators.required],
      category: ['', Validators.required],
      tags: [''],
      // Stats fields directly in the form
      powerOutput: [''],
      panelsInstalled: [null],
      costSavings: ['']
    });
  }

  ngOnInit() {
    this.isAuthenticated = false;
    this.errorMessage = null;
  }

  // Use blogForm's authCode field
  verifyCode() {
    if (this.blogForm.get('authCode')?.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      this.errorMessage = null;

      const authCode = this.blogForm.get('authCode')?.value;
      
      this.blogCreateService.verifyAuth(authCode).subscribe({
        next: () => {
          this.isAuthenticated = true;
          this.isSubmitting = false;
        },
        error: (error) => {
          console.error('Authentication failed:', error);
          this.isSubmitting = false;
          this.errorMessage = 'Código de autenticación inválido';
        }
      });
    }
  }

  createPost() {
    if (this.blogForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      this.errorMessage = null;

      // Prepare form data
      const postData = {
        authCode: this.blogForm.get('authCode')?.value, // Directly get authCode from blogForm
        title: this.blogForm.get('title')?.value,
        description: this.blogForm.get('description')?.value,
        content: this.blogForm.get('content')?.value,
        imageUrl: this.blogForm.get('imageUrl')?.value,
        category: this.blogForm.get('category')?.value,
        date: new Date().toISOString().split('T')[0],
        tags: this.blogForm.get('tags')?.value
          ? this.blogForm.get('tags')?.value.split(',').map((tag: string) => tag.trim())
          : [],
        powerOutput: this.blogForm.get('powerOutput')?.value || null,
        panelsInstalled: this.blogForm.get('panelsInstalled')?.value || null,
        costSavings: this.blogForm.get('costSavings')?.value || null
      };

      // Pass the entire postData object as a single parameter
      this.blogCreateService.verifyAndCreatePost(postData).subscribe({
        next: (response) => {
          this.showSuccessModal = true;
          this.isSubmitting = false;
          this.resetForm();
        },
        error: (error) => {
          console.error('Error creating post:', error);
          this.isSubmitting = false;
          this.errorMessage = 'Error al crear el post. Por favor, intente nuevamente.';
        }
      });
    } else {
      this.markFormGroupTouched(this.blogForm);
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.blogForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  resetForm() {
    this.blogForm.reset();
    this.isAuthenticated = false;
    this.errorMessage = null;
  }

  closeModal() {
    this.showSuccessModal = false;
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}
