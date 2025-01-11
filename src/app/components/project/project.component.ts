import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ActivatedRoute, Router } from '@angular/router';
import { BlogService } from '../../services/blog.service';

interface BlogPost {
  id: number;
  title: string;
  description: string;
  content: string;
  imageUrl: string;
  contentImages: string[];
  category: 'project' | 'article';
  date: string;
  tags: string[];
  stats?: {
    powerOutput?: string;
    panelsInstalled?: number;
    costSavings?: string;
  };
}

@Component({
  selector: 'app-project',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <article class="project-detail">
      <!-- Navigation -->
      <nav class="nav-bar">
        <button (click)="goBack()" class="nav-button">
          <i class="fas fa-arrow-left"></i> Volver
        </button>
      </nav>

      <!-- Loading State -->
      <div *ngIf="loading" class="loading-state">
        <i class="fas fa-spinner fa-spin"></i>
        <span>Cargando proyecto...</span>
      </div>

      <!-- Error State -->
      <div *ngIf="error" class="error-state">
        <i class="fas fa-exclamation-circle"></i>
        <p>{{ error }}</p>
        <button (click)="goBack()" class="back-button">Volver a proyectos</button>
      </div>

      <!-- Project Content -->
      <div *ngIf="project && !loading" class="project-content">
        <!-- Header -->
        <header class="project-header">
          <div class="header-content">
            <div class="meta">
              <span class="category">{{ project.category === 'project' ? 'Proyecto' : 'Artículo' }}</span>
              <span class="date">
                <i class="far fa-calendar"></i>
                {{ project.date | date:'dd MMMM, yyyy' }}
              </span>
            </div>
            <h1>{{ project.title }}</h1>
            <p class="description">{{ project.description }}</p>
            <div class="tags">
              <span *ngFor="let tag of project.tags" class="tag">{{ tag }}</span>
            </div>
          </div>
        </header>

        <!-- Featured Image -->
        <div 
          class="featured-image"
          [style.backgroundImage]="'url(' + project.imageUrl + ')'"
        ></div>

        <!-- Project Stats -->
        <div *ngIf="project.stats" class="stats-section">
          <div class="stat-card">
            <i class="fas fa-solar-panel"></i>
            <div class="stat-content">
              <span class="stat-value">{{ project.stats.powerOutput }}</span>
              <span class="stat-label">Potencia Instalada</span>
            </div>
          </div>
          
          <div class="stat-card">
            <i class="fas fa-plug"></i>
            <div class="stat-content">
              <span class="stat-value">{{ project.stats.panelsInstalled }}</span>
              <span class="stat-label">Paneles Instalados</span>
            </div>
          </div>
          
          <div class="stat-card">
            <i class="fas fa-leaf"></i>
            <div class="stat-content">
              <span class="stat-value">{{ project.stats.costSavings }}</span>
              <span class="stat-label">Ahorro Estimado</span>
            </div>
          </div>
        </div>

        <!-- Project Content -->
        <div class="content-section">
          <div [innerHTML]="project.content"></div>

          <!-- Content Images Gallery -->
          <div *ngIf="project.contentImages?.length" class="image-gallery">
  <h2>Galería del Proyecto</h2>
  <div class="gallery-grid">
    <div *ngFor="let imageUrl of project.contentImages" 
         class="gallery-item"
         (click)="openImage(imageUrl)">
      <img [src]="imageUrl" [alt]="project.title">
      <div class="image-overlay">
        <i class="fas fa-expand"></i>
      </div>
    </div>
  </div>
          </div>
        </div>
      </div>

      <!-- Image Modal -->
      <div *ngIf="selectedImage" class="image-modal" (click)="closeImage()">
        <button class="close-button">
          <i class="fas fa-times"></i>
        </button>
        <img [src]="selectedImage" [alt]="project?.title">
      </div>
    </article>
  `,
  styles: [`
    :host {
      --primary: #1a5f7a;
      --primary-light: #2c7a9c;
      --primary-dark: #134559;
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

    .project-detail {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }

    /* Navigation */
    .nav-bar {
      margin-bottom: 3rem;
    }

    .nav-button {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      background: white;
      color: var(--gray-700);
      border: 1px solid var(--gray-200);
      border-radius: var(--radius-lg);
      cursor: pointer;
      transition: all 0.2s;
    }

    .nav-button:hover {
      background: var(--gray-100);
      color: var(--primary);
      transform: translateX(-4px);
    }

    /* Loading State */
    .loading-state {
      text-align: center;
      padding: 4rem;
      color: var(--gray-600);
    }

    .loading-state i {
      font-size: 2rem;
      margin-bottom: 1rem;
    }

    /* Error State */
    .error-state {
      text-align: center;
      padding: 4rem;
      color: var(--gray-600);
    }

    /* Image Gallery Styles */
    .image-gallery {
      margin-top: 4rem;
      padding-top: 2rem;
      border-top: 1px solid var(--gray-200);
    }

    .image-gallery h2 {
      color: var(--gray-800);
      font-size: 1.875rem;
      margin-bottom: 2rem;
      text-align: center;
    }

    .gallery-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 2rem;
    }

    .gallery-item {
      position: relative;
      border-radius: var(--radius-lg);
      overflow: hidden;
      cursor: pointer;
      aspect-ratio: 4/3;
    }

    .gallery-item img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }

    .gallery-item:hover img {
      transform: scale(1.05);
    }

    .image-overlay {
      position: absolute;
      inset: 0;
      background: rgba(0, 0, 0, 0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .image-overlay i {
      color: white;
      font-size: 1.5rem;
    }

    .gallery-item:hover .image-overlay {
      opacity: 1;
    }

    /* Image Modal */
    .image-modal {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.9);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: 2rem;
    }

    .image-modal img {
      max-width: 100%;
      max-height: 90vh;
      object-fit: contain;
      border-radius: var(--radius-md);
    }

    .close-button {
      position: absolute;
      top: 2rem;
      right: 2rem;
      background: transparent;
      border: none;
      color: white;
      font-size: 2rem;
      cursor: pointer;
      padding: 0.5rem;
      transition: transform 0.2s ease;
    }

    .close-button:hover {
      transform: rotate(90deg);
    }

    @media (max-width: 768px) {
      .gallery-grid {
        grid-template-columns: 1fr;
      }

      .image-modal {
        padding: 1rem;
      }

      .close-button {
        top: 1rem;
        right: 1rem;
      }
    }

    .error-state i {
      font-size: 2rem;
      color: #ef4444;
      margin-bottom: 1rem;
    }

    .back-button {
      margin-top: 1.5rem;
      padding: 0.75rem 1.5rem;
      background: var(--primary);
      color: white;
      border: none;
      border-radius: var(--radius-lg);
      cursor: pointer;
      transition: all 0.2s;
    }

    .back-button:hover {
      background: var(--primary-light);
    }

    /* Project Header */
    .project-header {
      margin-bottom: 3rem;
      text-align: center;
      max-width: 800px;
      margin: 0 auto 3rem;
    }

    .meta {
      display: flex;
      justify-content: center;
      gap: 1.5rem;
      margin-bottom: 1.5rem;
    }

    .category {
      color: var(--primary);
      font-weight: 500;
    }

    .date {
      color: var(--gray-600);
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    h1 {
      font-size: 3rem;
      color: var(--gray-800);
      line-height: 1.2;
      margin-bottom: 1.5rem;
    }

    .description {
      font-size: 1.25rem;
      color: var(--gray-600);
      line-height: 1.6;
      margin-bottom: 1.5rem;
    }

    .tags {
      display: flex;
      gap: 0.75rem;
      justify-content: center;
      flex-wrap: wrap;
    }

    .tag {
      background: var(--gray-100);
      color: var(--gray-700);
      padding: 0.5rem 1rem;
      border-radius: var(--radius-md);
      font-size: 0.875rem;
    }

    /* Featured Image */
    .featured-image {
      height: 500px;
      background-size: cover;
      background-position: center;
      border-radius: var(--radius-lg);
      margin-bottom: 3rem;
    }

    /* Stats Section */
    .stats-section {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 2rem;
      margin-bottom: 3rem;
    }

    .stat-card {
      background: white;
      padding: 2rem;
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-md);
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }

    .stat-card i {
      font-size: 2rem;
      color: var(--primary);
    }

    .stat-content {
      display: flex;
      flex-direction: column;
    }

    .stat-value {
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--gray-800);
    }

    .stat-label {
      color: var(--gray-600);
      font-size: 0.875rem;
    }

    /* Content Section */
    .content-section {
      max-width: 800px;
      margin: 0 auto;
      color: var(--gray-700);
      line-height: 1.8;
    }

    .content-section :deep(h2) {
      font-size: 1.875rem;
      color: var(--gray-800);
      margin: 2rem 0 1rem;
    }

    .content-section :deep(p) {
      margin-bottom: 1.5rem;
    }

    .content-section :deep(img) {
      max-width: 100%;
      border-radius: var(--radius-md);
      margin: 2rem 0;
    }

    .content-section :deep(ul), 
    .content-section :deep(ol) {
      margin: 1.5rem 0;
      padding-left: 1.5rem;
    }

    .content-section :deep(li) {
      margin-bottom: 0.5rem;
    }

    @media (max-width: 768px) {
      .project-detail {
        padding: 1rem;
      }

      h1 {
        font-size: 2rem;
      }

      .featured-image {
        height: 300px;
      }

      .stats-section {
        grid-template-columns: 1fr;
      }

      .stat-card {
        padding: 1.5rem;
      }
    }
  `]
})
export class ProjectComponent implements OnInit {
  project: BlogPost | null = null;
  loading: boolean = true;
  error: string | null = null;
  adminMode: boolean = false;
  isAdmin: boolean = false;
  showDeleteModal: boolean = false;
  authCode: string = '';
  postToDeleteId: number | null = null;
  selectedImage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private blogService: BlogService
  ) {}

  ngOnInit() {
    this.isAdmin = true;
    this.route.params.subscribe(params => {
      const id = +params['id'];
      if (id) {
        this.loadPosts(id);
      } else {
        this.error = 'ID de proyecto no válido';
        this.loading = false;
      }
    });
  }

  loadPosts(targetId: number) {
    this.loading = true;
    this.error = null;
    
    this.blogService.getPosts().subscribe({
      next: (posts) => {
        const foundProject = posts.find(post => post.id === targetId);
        if (foundProject) {
          this.project = foundProject;
          this.loading = false;
        } else {
          this.error = 'Proyecto no encontrado';
          this.loading = false;
        }
      },
      error: (error) => {
        console.error('Error loading posts:', error);
        this.error = 'No se pudieron cargar los proyectos. Por favor, inténtelo de nuevo.';
        this.loading = false;
      }
    });
  }

  openImage(url: string) {
    this.selectedImage = url;
    // Prevent body scrolling when modal is open
    document.body.style.overflow = 'hidden';
  }
  closeImage() {
    this.selectedImage = null;
    // Restore body scrolling
    document.body.style.overflow = 'auto';
  }

  toggleAdminMode() {
    this.adminMode = !this.adminMode;
  }

  goBack() {
    this.router.navigate(['/blog']);
  }

  editProject(id: number) {
    this.router.navigate(['/edit-project', id]);
  }

  openDeleteModal(postId: number) {
    this.showDeleteModal = true;
    this.postToDeleteId = postId;
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
    this.authCode = '';
    this.postToDeleteId = null;
  }

  deletePost() {
    if (this.authCode && this.postToDeleteId !== null) {
      this.blogService.deletePost(this.postToDeleteId, this.authCode).subscribe({
        next: () => {
          this.closeDeleteModal();
          this.router.navigate(['/blog']); // Navigate back to blog after deletion
        },
        error: (error) => {
          console.error('Error deleting post:', error);
          alert('No se pudo eliminar el proyecto. Verifique el código de autenticación.');
        }
      });
    } else {
      alert('Por favor, ingrese un código de autenticación válido.');
    }
  }
}