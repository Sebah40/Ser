import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, AfterViewInit } from '@angular/core';
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
            <!-- Previous form fields remain the same until the editor -->
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
            <!-- Enhanced Rich Text Editor Toolbar -->
            <div class="editor-toolbar">
              <div class="toolbar-group">
                <button type="button" (click)="execCommand('bold')" 
                        [class.active]="isFormatActive('bold')" 
                        title="Negrita">
                  <i class="fas fa-bold"></i>
                </button>
                <button type="button" (click)="execCommand('italic')" 
                        [class.active]="isFormatActive('italic')" 
                        title="Cursiva">
                  <i class="fas fa-italic"></i>
                </button>
                <button type="button" (click)="execCommand('underline')" 
                        [class.active]="isFormatActive('underline')" 
                        title="Subrayado">
                  <i class="fas fa-underline"></i>
                </button>
              </div>

              <div class="separator"></div>

              <div class="toolbar-group">
                <select (change)="onChange($event)" class="format-select">
                  <option value="p">Normal</option>
                  <option value="h1">Título 1</option>
                  <option value="h2">Título 2</option>
                  <option value="h3">Título 3</option>
                  <option value="h4">Título 4</option>
                </select>

                <select (change)="onFontSizeChange($event)" class="format-select">
                  <option value="3">Normal</option>
                  <option value="1">Pequeño</option>
                  <option value="2">Medio</option>
                  <option value="4">Grande</option>
                  <option value="5">Muy Grande</option>
                </select>
              </div>

              <div class="separator"></div>

              <div class="toolbar-group">
                <button type="button" (click)="execCommand('justifyLeft')" 
                        [class.active]="isFormatActive('justifyLeft')" 
                        title="Alinear izquierda">
                  <i class="fas fa-align-left"></i>
                </button>
                <button type="button" (click)="execCommand('justifyCenter')" 
                        [class.active]="isFormatActive('justifyCenter')" 
                        title="Centrar">
                  <i class="fas fa-align-center"></i>
                </button>
                <button type="button" (click)="execCommand('justifyRight')" 
                        [class.active]="isFormatActive('justifyRight')" 
                        title="Alinear derecha">
                  <i class="fas fa-align-right"></i>
                </button>
              </div>

              <div class="separator"></div>

              <div class="toolbar-group">
                <button type="button" (click)="insertImage()" title="Insertar imagen">
                  <i class="fas fa-image"></i>
                </button>
                <button type="button" (click)="insertLink()" title="Insertar enlace"
                        [class.active]="isFormatActive('createLink')">
                  <i class="fas fa-link"></i>
                </button>
                <button type="button" (click)="execCommand('unlink')" title="Remover enlace"
                        [class.active]="isFormatActive('unlink')">
                  <i class="fas fa-unlink"></i>
                  </button>
                <button type="button" (click)="execCommand('insertUnorderedList')" 
                        [class.active]="isFormatActive('insertUnorderedList')" 
                        title="Lista">
                  <i class="fas fa-list-ul"></i>
                </button>
                <button type="button" (click)="execCommand('insertOrderedList')" 
                        [class.active]="isFormatActive('insertOrderedList')" 
                        title="Lista numerada">
                  <i class="fas fa-list-ol"></i>
                </button>
                <button type="button" (click)="execCommand('outdent')" title="Reducir sangría">
                  <i class="fas fa-outdent"></i>
                </button>
                <button type="button" (click)="execCommand('indent')" title="Aumentar sangría">
                  <i class="fas fa-indent"></i>
                </button>
              </div>
            </div>

            <!-- Enhanced Rich Text Editor Content Area -->
            <div class="form-group editor-container">
            <div 
                #contentEditor
                class="rich-text-editor"
                [class.invalid]="isFieldInvalid('content')"
                contenteditable="true"
                (input)="onEditorInput($event)"
                (keydown)="handleKeyDown($event)"
              ></div>


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
 .editor-container {
     position: relative;
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
 .editor-toolbar {
     display: flex;
     flex-wrap: wrap;
     gap: 0.5rem;
     padding: 0.75rem;
     background: #f8fafc;
     border: 1px solid var(--border-color, #e2e8f0);
     border-bottom: none;
     border-radius: 8px 8px 0 0;
     align-items: center;
}
 .editor-toolbar button {
     padding: 0.5rem;
     background: white;
     border: 1px solid var(--border-color, #e2e8f0);
     border-radius: 4px;
     cursor: pointer;
     transition: all 0.2s;
     width: 36px;
     height: 36px;
     display: flex;
     align-items: center;
     justify-content: center;
     color: var(--text-primary, #1e293b);
}
 .editor-toolbar button:hover {
     background: var(--primary-light, #1a6eb8);
     color: white;
     transform: translateY(-1px);
}
 .editor-toolbar select {
     padding: 0.5rem;
     border: 1px solid var(--border-color, #e2e8f0);
     border-radius: 4px;
     background: white;
}
 .separator {
     width: 1px;
     height: 24px;
     background: var(--border-color, #e2e8f0);
     margin: 0 0.5rem;
}
 .rich-text-editor {
     min-height: 300px;
     max-height: 600px;
     padding: 1rem;
     border: 1px solid var(--border-color, #e2e8f0);
     border-radius: 0 0 8px 8px;
     background: white;
     overflow-y: auto;
     line-height: 1.6;
     color: var(--text-primary, #1e293b);
}
 .rich-text-editor img {
     max-width: 100%;
     height: auto;
     border-radius: 4px;
     margin: 1rem 0;
}
 .rich-text-editor:focus {
     outline: none;
     border-color: var(--primary-color, #0c457a);
     box-shadow: 0 0 0 3px rgba(12, 69, 122, 0.1);
}
 .rich-text-editor.invalid {
     border-color: #ef4444;
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
 .toolbar-group {
     display: flex;
     gap: 0.25rem;
}
 .button-group {
     display: flex;
     gap: 1rem;
     justify-content: flex-end;
     margin-top: 2rem;
}
 .format-select {
     padding: 0.5rem;
     border: 1px solid var(--border-color, #e2e8f0);
     border-radius: 4px;
     background: white;
     min-width: 100px;
}
 button {
     padding: 0.75rem 1.5rem;
     border: none;
     border-radius: 8px;
     font-weight: 500;
     cursor: pointer;
     transition: all 0.3s ease;
}
 .editor-toolbar button.active {
     background: var(--primary-color, #0c457a);
     color: white;
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
 .editor-toolbar {
     display: flex;
     flex-wrap: wrap;
     gap: 0.5rem;
     padding: 0.75rem;
     background: #f8fafc;
     border: 1px solid var(--border-color, #e2e8f0);
     border-bottom: none;
     border-radius: 8px 8px 0 0;
     align-items: center;
}
 .toolbar-group {
     display: flex;
     gap: 0.25rem;
}
 .editor-toolbar button {
     padding: 0.5rem;
     background: white;
     border: 1px solid var(--border-color, #e2e8f0);
     border-radius: 4px;
     cursor: pointer;
     transition: all 0.2s;
     width: 36px;
     height: 36px;
     display: flex;
     align-items: center;
     justify-content: center;
     color: var(--text-primary, #1e293b);
}
 .editor-toolbar button:hover {
     background: var(--primary-light, #1a6eb8);
     color: white;
     transform: translateY(-1px);
}
 .editor-toolbar button.active {
     background: var(--primary-color, #0c457a);
     color: white;
}
 .format-select {
     padding: 0.5rem;
     border: 1px solid var(--border-color, #e2e8f0);
     border-radius: 4px;
     background: white;
     min-width: 100px;
}
 .separator {
     width: 1px;
     height: 24px;
     background: var(--border-color, #e2e8f0);
     margin: 0 0.5rem;
}
 .editor-container {
     position: relative;
}
 .rich-text-editor {
     min-height: 300px;
     max-height: 600px;
     padding: 1rem;
     border: 1px solid var(--border-color, #e2e8f0);
     border-radius: 0 0 8px 8px;
     background: white;
     overflow-y: auto;
     line-height: 1.6;
     color: var(--text-primary, #1e293b);
}
 .rich-text-editor:focus {
     outline: none;
     border-color: var(--primary-color, #0c457a);
     box-shadow: 0 0 0 3px rgba(12, 69, 122, 0.1);
}
 .rich-text-editor.invalid {
     border-color: #ef4444;
}
 .rich-text-editor img {
     max-width: 100%;
     height: auto;
     border-radius: 4px;
     margin: 1rem 0;
}
 .rich-text-editor h1 {
     font-size: 2em;
     margin: 0.67em 0;
}
 .rich-text-editor h2 {
     font-size: 1.5em;
     margin: 0.75em 0;
}
 .rich-text-editor h3 {
     font-size: 1.17em;
     margin: 0.83em 0;
}
 .rich-text-editor h4 {
     font-size: 1em;
     margin: 1.12em 0;
}
 .rich-text-editor p {
     margin: 1em 0;
}
 .rich-text-editor ul, .rich-text-editor ol {
     margin: 1em 0;
     padding-left: 40px;
}

  `]
})
export class BlogCreateComponent implements OnInit {
  @ViewChild('contentEditor') contentEditor!: ElementRef;
  blogForm: FormGroup;
  isAuthenticated = false;
  isSubmitting = false;
  showSuccessModal = false;
  errorMessage: string | null = null;
  showImageHelperModal = false;

  constructor(
    private fb: FormBuilder,
    private changeDetectorRef: ChangeDetectorRef,
    private blogCreateService: BlogCreateService,
    private router: Router,
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

  isFormatActive(command: string): boolean {
    return document.queryCommandState(command);
  }

  get contentImages() {
    return this.blogForm.get('contentImages') as FormArray;
  }
  onChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
  
    if (selectElement && selectElement.value) {
      this.execCommand('formatBlock', selectElement.value);
    } else {
      console.error('Select element or value is null or undefined.');
    }
  }

  execCommand(command: string, value: string = '') {
    try {
      const contentEditor = this.contentEditor?.nativeElement;
  
      if (contentEditor) {
        // Ensure the editor has focus
        if (document.activeElement !== contentEditor) {
          contentEditor.focus();
        }

        // Execute the command
        document.execCommand(command, false, value);
  
        // Update form value
        const content = contentEditor.innerHTML;
        this.blogForm.patchValue({ content }, { emitEvent: false });

        // Force update of button states
        this.detectChanges();
      }
    } catch (error) {
      console.error('Error executing command:', command, error);
    }
  }

  private detectChanges() {
    this.changeDetectorRef.detectChanges();
  }
  

  onFontSizeChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.execCommand('fontSize', select.value);
  }

  onEditorInput(event: Event) {
    const content = (event.target as HTMLElement).innerHTML;
    // Update form without triggering the innerHTML binding
    this.blogForm.get('content')?.setValue(content, { emitEvent: false });
    this.detectChanges();
  }

  handleKeyDown(event: KeyboardEvent) {
    // Handle tab key for indentation
    if (event.key === 'Tab') {
      event.preventDefault();
      this.execCommand(event.shiftKey ? 'outdent' : 'indent');
    }
  }

  addContentImage() {
    this.contentImages.push(this.fb.control(''));
  }

  insertImage() {
    const url = prompt('Introduce la URL de la imagen:');
    if (url) {
      // Create a container for the image
      const img = document.createElement('img');
      img.src = url;
      img.className = 'align-center img-medium'; // Default to center-aligned, medium size
      img.style.maxWidth = '100%';
      
      // Insert the image at cursor position
      this.execCommand('insertHTML', img.outerHTML);
    }
  }

  // Add this method to toggle image size
  toggleImageSize(img: HTMLImageElement) {
    const sizes = ['img-small', 'img-medium', 'img-large'];
    const currentSize = sizes.find(size => img.classList.contains(size)) || 'img-medium';
    const currentIndex = sizes.indexOf(currentSize);
    const nextIndex = (currentIndex + 1) % sizes.length;
    
    // Remove current size class
    img.classList.remove(...sizes);
    // Add next size class
    img.classList.add(sizes[nextIndex]);
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
  insertLink() {
    const selection = window.getSelection();
    const selectedText = selection?.toString();
    
    let url = prompt('Introduce la URL del enlace:', 'https://');
    
    if (url) {
      // If no text is selected, ask for link text
      if (!selectedText || selectedText.trim() === '') {
        const text = prompt('Introduce el texto para el enlace:', '');
        if (text) {
          // Insert the new text and create the link
          const contentEditor = this.contentEditor?.nativeElement;
          if (contentEditor) {
            contentEditor.focus();
            document.execCommand('insertHTML', false, `<a href="${url}" target="_blank">${text}</a>`);
          }
        }
      } else {
        // Create link with selected text
        this.execCommand('createLink', url);
        // Get the newly created link and add target="_blank"
        const contentEditor = this.contentEditor?.nativeElement;
        const links = contentEditor.getElementsByTagName('a');
        if (links.length > 0) {
          const lastLink = links[links.length - 1];
          lastLink.setAttribute('target', '_blank');
        }
      }
    }
  }
}
