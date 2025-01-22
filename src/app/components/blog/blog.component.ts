import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { BlogService } from '../../services/blog.service';
import { NavbarComponent } from '../navbar/navbar.component';
import { ReactiveFormsModule } from '@angular/forms';

interface BlogPost {
  id: number;
  title: string;
  description: string;
  content: string;
  imageUrl: string;
  category: 'project' | 'article';
  date: string;
  tags: string[];
  powerOutput?: string;
  panelsInstalled?: number;
  costSavings?: string;
}

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    NavbarComponent,
    ReactiveFormsModule,
  ],
  template: `
    <app-navbar></app-navbar>
    &nbsp;
    <a
      href="https://wa.me/message/6OHMJMTGTRMWP1/?text=hola%2C%20quer%C3%ADa%20consultar%20sobre%3A%20"
      target="_blank"
      class="whatsapp-button"
    >
      <i class="fab fa-whatsapp"></i>
      <span>¿Tienes algún plan?</span>
    </a>
    <section class="blog-section">
      <!-- Navigation -->
      <nav class="nav-bar">
        <div class="nav-controls">
          <button
            *ngIf="isAdmin"
            (click)="toggleAdminMode()"
            class="nav-button"
            [class.active]="adminMode"
          >
            <i class="fas fa-lock"></i>
          </button>
        </div>
      </nav>
      <!-- Header -->
      <header class="header">
        <h1>Nuestros Proyectos</h1>
        <p>Descubre nuestras obras más recientes e innovadoras</p>
      </header>

      <!-- Filters -->
      <div class="filters">
        <div class="search-wrapper">
          <input
            type="text"
            [(ngModel)]="searchTerm"
            (input)="filterPosts()"
            placeholder="Buscar proyectos..."
            class="search-input"
          />
          <i class="fas fa-search search-icon"></i>
        </div>
      </div>

      <!-- Admin Controls -->
      <div *ngIf="adminMode" class="admin-controls">
        <button (click)="goToCreatePost()" class="admin-button">
          <i class="fas fa-plus"></i> Nuevo Proyecto
        </button>
      </div>

      <!-- Projects Grid -->
      <div class="projects-grid">
        <article
          *ngFor="let post of filteredPosts"
          class="project-card"
          (click)="openProject(post)"
        >
          <div
            class="card-image"
            [style.backgroundImage]="'url(' + post.imageUrl + ')'"
          >
            <div class="card-overlay">
              <span class="project-category">{{
                post.category === 'project' ? 'Proyectos' : 'Artículos'
              }}</span>
              <div *ngIf="adminMode" class="admin-actions">
                <button
                  (click)="openDeleteModal(post.id); $event.stopPropagation()"
                  class="icon-button delete"
                >
                  <i class="fas fa-trash"></i>
                </button>
                <button
                  (click)="goToEditPost(post.id); $event.stopPropagation()"
                  class="icon-button update"
                >
                  <i class="fas fa-pencil"></i>
                </button>
              </div>
            </div>
          </div>

          <div class="card-content">
            <div class="meta">
              <span class="date"
                ><i class="far fa-calendar"></i>
                {{ post.date | date : 'dd/MM/yyyy' }}</span
              >
              <div class="tags">
                <span *ngFor="let tag of post.tags.slice(0, 2)" class="tag">{{
                  tag
                }}</span>
              </div>
            </div>

            <h3>{{ post.title }}</h3>
            <p>{{ post.description }}</p>

            <!-- Project Stats - Only show for projects -->
            <div *ngIf="post.category === 'project'" class="stats">
              <div class="stat" *ngIf="post.powerOutput">
                <i class="fas fa-solar-panel"></i>
                <span class="stat-value">{{ post.powerOutput }} kW</span>
                <span class="stat-label">Potencia</span>
              </div>
              <div class="stat" *ngIf="post.panelsInstalled">
                <i class="fas fa-plug"></i>
                <span class="stat-value">{{ post.panelsInstalled }}</span>
                <span class="stat-label">Paneles</span>
              </div>
              <div class="stat" *ngIf="post.costSavings">
                <i class="fas fa-leaf"></i>
                <span class="stat-value">{{ post.costSavings }}%</span>
                <span class="stat-label">Generación</span>
              </div>
            </div>
          </div>
        </article>
      </div>

      <!-- Load More -->
      <div *ngIf="hasMorePosts" class="load-more">
        <button
          (click)="loadMorePosts()"
          class="load-button"
          [class.loading]="loading"
        >
          {{ loading ? 'Cargando...' : 'Ver más proyectos' }}
          <i *ngIf="loading" class="fas fa-spinner fa-spin"></i>
        </button>
      </div>

      <!-- Delete Modal -->
      <div *ngIf="showDeleteModal" class="modal">
        <div class="modal-content">
          <h2>Confirmar Eliminación</h2>
          <p>
            Por favor, ingrese el código de autenticación para eliminar este
            proyecto.
          </p>
          <input
            [(ngModel)]="authCode"
            type="password"
            placeholder="Código de autenticación"
            class="auth-input"
          />
          <div class="modal-actions">
            <button (click)="deletePost()" class="confirm-button">
              Confirmar
            </button>
            <button (click)="closeDeleteModal()" class="cancel-button">
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      :host {
        --primary: #0c457a;
        --primary-light: #1a6eb8;
        --primary-dark: #093358;
        --accent: #7fcbc8;
        --success: #22c55e;
        --danger: #ef4444;
        --gray-50: #f8fafc;
        --gray-100: #f1f5f9;
        --gray-200: #e2e8f0;
        --gray-300: #cbd5e1;
        --gray-400: #94a3b8;
        --gray-500: #64748b;
        --gray-600: #475569;
        --gray-700: #334155;
        --gray-800: #1e293b;
        --gray-900: #0f172a;
        display: block;
        width: 100%;
      }

      .modal-actions button {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.95rem;
  transition: all 0.2s ease;
  min-width: 120px;
}

.confirm-button {
  background-color: #dc3545;
  color: white;
  border: none;
  box-shadow: 0 2px 4px rgba(220, 53, 69, 0.2);
}

.confirm-button:hover {
  background-color: #c82333;
  transform: translateY(-1px);
  box-shadow: 0 4px 6px rgba(220, 53, 69, 0.25);
}

.cancel-button {
  background-color: #f8f9fa;
  color: #495057;
  border: 1px solid #dee2e6;
}

.cancel-button:hover {
  background-color: #e2e6ea;
  color: #212529;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

      .blog-section {
        margin-top: 2rem;
        min-height: 100vh;
        background: linear-gradient(
            45deg,
            rgba(12, 69, 122, 0.97) 0%,
            rgba(26, 110, 184, 0.95) 50%,
            rgba(127, 203, 200, 0.95) 100%
          ),
          url('/about.jpg') center center;
        background-attachment: fixed;
        background-size: cover;
        padding: 2rem;
        position: relative;
      }

      /* Navigation */
      .nav-bar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
      }

      .nav-button {
        background: rgba(255, 255, 255, 0.1);
        border: none;
        color: white;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.3s ease;
        backdrop-filter: blur(10px);
      }

      .nav-button:hover {
        background: rgba(255, 255, 255, 0.2);
        transform: translateY(-2px);
      }

      .nav-button.active {
        background: var(--primary-light);
        color: white;
      }

      /* Header */
      .header {
        text-align: center;
        color: white;
        margin-bottom: 3rem;
        position: relative;
      }

      .header h1 {
        font-size: 2.5rem;
        font-weight: 800;
        margin-bottom: 1rem;
      }

      .header p {
        font-size: 1.1rem;
        opacity: 0.9;
      }

      /* Search and Filters */
      .filters {
        max-width: 600px;
        margin: 0 auto 2rem;
        background: rgba(255, 255, 255, 0.1);
        padding: 1.5rem;
        border-radius: 1rem;
        backdrop-filter: blur(10px);
      }

      .search-wrapper {
        position: relative;
      }

      .search-input {
        width: 100%;
        padding: 1rem 1rem 1rem 3rem;
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 0.5rem;
        background: rgba(255, 255, 255, 0.95);
        color: var(--gray-800);
        transition: all 0.3s ease;
      }

      .search-icon {
        position: absolute;
        left: 1rem;
        top: 50%;
        transform: translateY(-50%);
        color: var(--gray-500);
      }

      /* Projects Grid */
      .projects-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
        gap: 2rem;
        margin-bottom: 3rem;
      }

      .project-card {
        background: rgba(255, 255, 255, 0.95);
        border-radius: 1rem;
        overflow: hidden;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        transition: all 0.3s ease;
        cursor: pointer;
      }

      .project-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
      }

      .card-image {
        height: 200px;
        background-size: cover;
        background-position: center;
        position: relative;
      }

      .card-overlay {
        position: absolute;
        inset: 0;
        background: linear-gradient(
          to bottom,
          rgba(12, 69, 122, 0.2),
          rgba(12, 69, 122, 0.8)
        );
        padding: 1rem;
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
      }

      .project-category {
        background: white;
        color: var(--primary);
        padding: 0.5rem 1rem;
        border-radius: 2rem;
        font-size: 0.875rem;
        font-weight: 500;
      }

      .card-content {
        padding: 1.5rem;
      }

      .meta {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
      }

      .date {
        color: var(--gray-600);
        font-size: 0.875rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .tags {
        display: flex;
        gap: 0.5rem;
      }

      .tag {
        background: var(--primary-light);
        color: white;
        padding: 0.25rem 0.75rem;
        border-radius: 1rem;
        font-size: 0.75rem;
      }

      .stats {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 0.5rem;
        padding: 0.75rem;
        background: #1976d2;
        border-radius: 0.5rem;
        margin-top: 1rem;
        color: white;
      }

      .stat {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
      }

      .stat i {
        font-size: 1rem;
        margin-bottom: 0.25rem;
      }

      .stat-value {
        font-size: 1rem;
        font-weight: 600;
        margin: 0;
      }

      .stat-label {
        font-size: 0.75rem;
        opacity: 0.9;
      }

      @media (max-width: 480px) {
        .stats {
          padding: 0.5rem;
          gap: 0.25rem;
        }

        .stat-value {
          font-size: 0.875rem;
        }

        .stat-label {
          font-size: 0.625rem;
        }
      }

      @media (max-width: 480px) {
        .stats {
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
          padding: 1rem;
        }
      }

      /* Admin Controls */
      .admin-controls {
        margin-bottom: 2rem;
        text-align: right;
      }

      .admin-button {
        background: var(--primary-light);
        color: white;
        padding: 0.75rem 1.5rem;
        border-radius: 0.5rem;
        border: none;
        cursor: pointer;
        transition: all 0.3s ease;
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
      }

      .icon-button {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
      }

      .icon-button.delete {
        background: var(--danger);
        color: white;
      }

      /* Load More */
      .load-more {
        text-align: center;
        margin-top: 3rem;
      }

      .load-button {
        background: rgba(255, 255, 255, 0.1);
        border: 2px solid white;
        color: white;
        padding: 1rem 2.5rem;
        border-radius: 2rem;
        cursor: pointer;
        transition: all 0.3s ease;
        backdrop-filter: blur(10px);
      }

      .load-button:hover {
        background: white;
        color: var(--primary);
      }

      /* Modal */
      .modal {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1rem;
        z-index: 50;
      }

      .modal-content {
        background: white;
        padding: 2rem;
        border-radius: 1rem;
        max-width: 400px;
        width: 100%;
      }

      .auth-input {
        width: 100%;
        padding: 0.75rem 1rem;
        border: 1px solid var(--gray-200);
        border-radius: 0.5rem;
        margin: 1rem 0;
      }

      .modal-actions {
        display: flex;
        gap: 1rem;
        margin-top: 1.5rem;
      }

      .confirm-button {
        background: var(--danger);
        color: white;
      }

      .cancel-button {
        background: var(--gray-200);
        color: var(--gray-800);
      }

      /* WhatsApp Button */
      .whatsapp-button {
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        background: #25d366;
        color: white;
        padding: 0.75rem 1.5rem;
        border-radius: 2rem;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        text-decoration: none;
        font-weight: 500;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        transition: all 0.3s ease;
        z-index: 1000;
      }

      .whatsapp-button:hover {
        transform: translateY(-3px);
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
      }

      /* Responsive */
      @media (max-width: 768px) {
        .blog-section {
          padding: 1rem;
        }

        .projects-grid {
          grid-template-columns: 1fr;
        }

        .stats {
          grid-template-columns: repeat(2, 1fr);
        }

        .whatsapp-button {
          bottom: 1rem;
          right: 1rem;
          padding: 0.5rem 1rem;
        }
      }
    `,
  ],
})
export class BlogComponent implements OnInit {
  searchTerm: string = '';
  selectedCategory: string = 'Todos';
  categories: string[] = ['Todos', 'Proyectos', 'Artículos'];
  posts: BlogPost[] = [];
  filteredPosts: BlogPost[] = [];
  hasMorePosts: boolean = true;
  loading: boolean = false;
  currentPage: number = 1;
  postsPerPage: number = 9;
  showDeleteModal: boolean = false;
  authCode: string = '';
  postToDeleteId: number | null = null;
  adminMode: boolean = false;
  isAdmin: boolean = false; // This should be set based on user authentication

  constructor(private blogService: BlogService, private router: Router) {}

  ngOnInit() {
    this.loadPosts();
    this.isAdmin = true;
  }

  toggleAdminMode() {
    this.adminMode = !this.adminMode;
  }

  loadPosts() {
    this.loading = true;
    this.blogService.getPosts().subscribe({
      next: (posts) => {
        this.posts = posts;
        this.filterPosts();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading posts:', error);
        this.loading = false;
      },
    });
  }

  filterPosts() {
    let filtered = this.posts;

    if (this.searchTerm) {
      const search = this.searchTerm.toLowerCase();
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(search) ||
          post.description.toLowerCase().includes(search) ||
          post.tags.some((tag) => tag.toLowerCase().includes(search))
      );
    }

    if (this.selectedCategory !== 'Todos') {
      filtered = filtered.filter(
        (post) =>
          post.category.toLowerCase() === this.selectedCategory.toLowerCase()
      );
    }

    const startIndex = (this.currentPage - 1) * this.postsPerPage;
    const endIndex = startIndex + this.postsPerPage;
    this.filteredPosts = filtered.slice(startIndex, endIndex);
    this.hasMorePosts = filtered.length > endIndex;
  }

  selectCategory(category: string) {
    this.selectedCategory = category;
    this.currentPage = 1;
    this.filterPosts();
  }

  loadMorePosts() {
    if (this.hasMorePosts && !this.loading) {
      this.currentPage++;
      this.filterPosts();
    }
  }

  openProject(post: BlogPost) {
    this.router.navigate(['/project', post.id]);
  }

  editProject(id: number) {
    this.router.navigate(['/edit-project', id]);
  }

  goBack() {
    this.router.navigate(['/']);
  }

  goToCreatePost() {
    this.router.navigate(['/crearblog']);
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
      this.blogService
        .deletePost(this.postToDeleteId, this.authCode)
        .subscribe({
          next: () => {
            this.posts = this.posts.filter(
              (post) => post.id !== this.postToDeleteId
            );
            this.filterPosts();
            this.closeDeleteModal();
          },
          error: (error) => {
            console.error('Error deleting post:', error);
            alert(
              'Failed to delete post. Please check your authentication code.'
            );
          },
        });
    }
  }

  goToEditPost(id: number) {
    this.router.navigate([`/crearblog/${id}`]);
  }
}
