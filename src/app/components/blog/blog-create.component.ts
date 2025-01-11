import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { BlogCreateService } from '../../services/blog-create.service';
import { Router } from '@angular/router';
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

            <!-- Content Images Section -->
            <div class="content-images">
                <h4>Imágenes del Contenido</h4>
                <div formArrayName="contentImages">
                  <div *ngFor="let image of contentImages.controls; let i=index" class="image-input-group">
                    <div class="image-input-row">
                      <input 
                        [formControlName]="i"
                        type="text"
                        placeholder="URL de la imagen"
                      >
                      <button type="button" class="remove-btn" (click)="removeContentImage(i)">
                        <i class="fas fa-times"></i>
                      </button>
                    </div>
                    <!-- Preview if URL is valid -->
                    <div *ngIf="image.value" class="image-preview">
                      <img [src]="image.value" (error)="handleImageError($event)" alt="Preview">
                    </div>
                  </div>
                </div>
                <button type="button" class="add-image-btn" (click)="addContentImage()">
                  <i class="fas fa-plus"></i> Agregar Imagen
                </button>
              </div>
              <div class="modal" *ngIf="showImageHelperModal" (click)="closeImageHelper()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <h3>Imágenes Disponibles</h3>
          <div class="available-images">
            <div *ngFor="let image of contentImages.controls" class="image-item" 
                 (click)="insertImageToContent(image.value)">
              <img [src]="image.value" alt="Available image">
              <div class="image-overlay">Click para insertar</div>
            </div>
          </div>
          <button (click)="closeImageHelper()">Cerrar</button>
        </div>
      </div>
            <div class="form-row">
              <div class="form-group">
                <select formControlName="category"
                        [class.invalid]="isFieldInvalid('category')">
                  <option value="" disabled>Selecciona categoría *</option>
                  <option value="project">Proyecto</option>
                  <option value="articulo">Artículo</option>
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
            <div class="form-group" *ngIf="blogForm.get('category')?.value === 'project'">
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

.content-section {
      position: relative;
    }

    .content-images {
      margin-top: 2rem;
      border-top: 1px solid var(--border-color, #e2e8f0);
      padding-top: 1.5rem;
    }

    h4 {
      color: var(--primary-color, #0c457a);
      margin-bottom: 1rem;
      font-size: 1.1rem;
    }

    .image-input-group {
      margin-bottom: 1rem;
    }

    .image-input-row {
      display: flex;
      gap: 0.5rem;
      align-items: center;
    }

    .remove-btn {
      padding: 0.5rem;
      background: #ef4444;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .remove-btn:hover {
      background: #dc2626;
    }

    .add-image-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      background: var(--primary-color, #0c457a);
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s;
      margin-top: 1rem;
    }

    .add-image-btn:hover {
      background: var(--primary-light, #1a6eb8);
    }

    .image-preview {
      margin-top: 0.5rem;
      max-width: 200px;
      border-radius: 4px;
      overflow: hidden;
    }

    .image-preview img {
      width: 100%;
      height: auto;
      display: block;
    }

    .available-images {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      gap: 1rem;
      margin: 1rem 0;
      max-height: 400px;
      overflow-y: auto;
    }

    .image-item {
      position: relative;
      cursor: pointer;
      border-radius: 4px;
      overflow: hidden;
    }

    .image-item img {
      width: 100%;
      height: 120px;
      object-fit: cover;
    }

    .image-overlay {
      position: absolute;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.2s;
    }

    .image-item:hover .image-overlay {
      opacity: 1;
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
  showImageHelperModal = false;

  constructor(
    private fb: FormBuilder,
    private blogCreateService: BlogCreateService,
    private router: Router

  ) {
    this.blogForm = this.fb.group({
      authCode: ['', [Validators.required, Validators.minLength(6)]],
      title: ['', Validators.required],
      description: ['', Validators.required],
      content: ['', Validators.required],
      imageUrl: ['', Validators.required],
      category: ['', Validators.required],
      tags: [''],
      contentImages: this.fb.array([]),
      powerOutput: [''],
      panelsInstalled: [null],
      costSavings: ['']
    });
  }

  get contentImages() {
    return this.blogForm.get('contentImages') as FormArray;
  }


  addContentImage() {
    this.contentImages.push(this.fb.control(''));
  }

  removeContentImage(index: number) {
    this.contentImages.removeAt(index);
  }

  handleImageError(event: any) {
    event.target.src = 'assets/placeholder-image.jpg'; // Replace with your placeholder
  }

  showImageHelper() {
    this.showImageHelperModal = true;
  }

  closeImageHelper() {
    this.showImageHelperModal = false;
  }

  insertImageToContent(imageUrl: string) {
    const contentControl = this.blogForm.get('content');
    const currentContent = contentControl?.value || '';
    const imageMarkdown = `\n![Imagen](${imageUrl})\n`;
    contentControl?.setValue(currentContent + imageMarkdown);
    this.closeImageHelper();
  }

  createPost() {
    if (this.blogForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      this.errorMessage = null;

      // Filter out empty image URLs
      const contentImages = this.contentImages.value.filter((url: string) => url.trim() !== '');

      const postData = {
        ...this.blogForm.value,
        contentImages,
        tags: this.blogForm.get('tags')?.value
          ? this.blogForm.get('tags')?.value.split(',').map((tag: string) => tag.trim())
          : [],
        date: new Date().toISOString().split('T')[0]
      };

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

  ngOnInit() {
    this.isAuthenticated = false;
    this.errorMessage = null;
    this.addContentImage(); // Add first image input by default
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

  

  isFieldInvalid(fieldName: string): boolean {
    const field = this.blogForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  resetForm() {
    this.router.navigate(['/blog']);
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
