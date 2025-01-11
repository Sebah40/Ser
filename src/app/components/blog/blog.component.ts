import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { BlogService } from '../../services/blog.service';

interface BlogPost {
  id: number;
  title: string;
  description: string;
  content: string;
  imageUrl: string;
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
  selector: 'app-blog',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <section class="blog-section">
      <!-- Navigation -->
      <nav class="nav-bar">
        <button (click)="goBack()" class="nav-button">
          <i class="fas fa-arrow-left"></i>
        </button>
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
          >
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
          <div class="card-image" [style.backgroundImage]="'url(' + post.imageUrl + ')'">
            <div class="card-overlay">
              <span class="project-category">{{ post.category === 'project' ? 'Proyectos' : 'Artículos' }}</span>
              <div *ngIf="adminMode" class="admin-actions">
                <button 
                  (click)="openDeleteModal(post.id); $event.stopPropagation()" 
                  class="icon-button delete"
                >
                  <i class="fas fa-trash"></i>
                </button>
                
              </div>
            </div>
          </div>

          <div class="card-content">
            <div class="meta">
              <span class="date"><i class="far fa-calendar"></i> {{ post.date | date:'dd/MM/yyyy' }}</span>
              <div class="tags">
                <span *ngFor="let tag of post.tags.slice(0, 2)" class="tag">{{ tag }}</span>
              </div>
            </div>

            <h3>{{ post.title }}</h3>
            <p>{{ post.description }}</p>

            <div *ngIf="post.stats" class="stats">
              <div class="stat">
                <i class="fas fa-solar-panel"></i>
                <span>{{ post.stats.powerOutput }}</span>
              </div>
              <div class="stat">
                <i class="fas fa-plug"></i>
                <span>{{ post.stats.panelsInstalled }} paneles</span>
              </div>
              <div class="stat">
                <i class="fas fa-leaf"></i>
                <span>{{ post.stats.costSavings }} ahorro</span>
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
          <p>Por favor, ingrese el código de autenticación para eliminar este proyecto.</p>
          <input 
            [(ngModel)]="authCode" 
            type="password" 
            placeholder="Código de autenticación"
            class="auth-input"
          />
          <div class="modal-actions">
            <button (click)="deletePost()" class="confirm-button">Confirmar</button>
            <button (click)="closeDeleteModal()" class="cancel-button">Cancelar</button>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    :host {
      --primary: #1a5f7a;
      --primary-light: #2c7a9c;
      --primary-dark: #134559;
      --gray-100: #f3f4f6;
      --gray-200: #e5e7eb;
      --gray-300: #d1d5db;
      --gray-600: #4b5563;
      --gray-700: #374151;
      --gray-800: #1f2937;
      --danger: #dc2626;
      --success: #059669;
      --radius-lg: 1rem;
      --radius-md: 0.5rem;
      --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
      --shadow-md: 0 4px 6px -1px rgba(0,0,0,0.1);
      --shadow-lg: 0 10px 15px -3px rgba(0,0,0,0.1);
    }

    .blog-section {
      max-width: 1400px;
      margin: 0 auto;
      padding: 2rem;
    }

    /* Navigation */
    .nav-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 3rem;
    }

    .nav-button {
      background: white;
      border: 1px solid var(--gray-200);
      padding: 0.75rem;
      border-radius: 50%;
      color: var(--gray-600);
      cursor: pointer;
      transition: all 0.2s;
    }

    .nav-button:hover {
      background: var(--gray-100);
      color: var(--primary);
    }

    .nav-button.active {
      background: var(--primary);
      color: white;
      border-color: var(--primary);
    }

    /* Header */
    .header {
      text-align: center;
      margin-bottom: 4rem;
    }

    .header h1 {
      font-size: 2.5rem;
      color: var(--gray-800);
      margin-bottom: 1rem;
    }

    .header p {
      color: var(--gray-600);
      font-size: 1.125rem;
    }

    /* Filters */
    .filters {
      margin-bottom: 3rem;
    }

    .search-wrapper {
      position: relative;
      max-width: 600px;
      margin: 0 auto 2rem;
    }

    .search-input {
      width: 100%;
      padding: 1rem 1rem 1rem 3rem;
      border: 1px solid var(--gray-200);
      border-radius: var(--radius-lg);
      font-size: 1rem;
      transition: all 0.2s;
    }

    .search-input:focus {
      outline: none;
      border-color: var(--primary);
      box-shadow: 0 0 0 3px rgba(26, 95, 122, 0.1);
    }

    .search-icon {
      position: absolute;
      left: 1rem;
      top: 50%;
      transform: translateY(-50%);
      color: var(--gray-600);
    }

    .tags-filter {
      display: flex;
      gap: 0.75rem;
      justify-content: center;
      flex-wrap: wrap;
    }

    .tag-button {
      padding: 0.75rem 1.5rem;
      border: 1px solid var(--gray-200);
      border-radius: var(--radius-lg);
      background: white;
      color: var(--gray-700);
      cursor: pointer;
      transition: all 0.2s;
    }

    .tag-button:hover {
      background: var(--gray-100);
    }

    .tag-button.active {
      background: var(--primary);
      color: white;
      border-color: var(--primary);
    }

    /* Admin Controls */
    .admin-controls {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 2rem;
    }

    .admin-button {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      background: var(--primary);
      color: white;
      border: none;
      border-radius: var(--radius-lg);
      cursor: pointer;
      transition: all 0.2s;
    }

    .admin-button:hover {
      background: var(--primary-light);
    }

    /* Projects Grid */
    .projects-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 2rem;
      margin-bottom: 4rem;
    }

    .project-card {
      background: white;
      border-radius: var(--radius-lg);
      overflow: hidden;
      box-shadow: var(--shadow-md);
      cursor: pointer;
      transition: all 0.3s;
    }

    .project-card:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow-lg);
    }

    .card-image {
      height: 240px;
      background-size: cover;
      background-position: center;
      position: relative;
    }

    .card-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.4));
      padding: 1rem;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }

    .project-category {
      background: rgba(255,255,255,0.9);
      color: var(--primary);
      padding: 0.5rem 1rem;
      border-radius: var(--radius-md);
      font-size: 0.875rem;
      font-weight: 500;
    }

    .admin-actions {
      display: flex;
      gap: 0.5rem;
    }

    .icon-button {
      width: 2.5rem;
      height: 2.5rem;
      border-radius: 50%;
      border: none;
      cursor: pointer;
      display: grid;
      place-items: center;
      transition: all 0.2s;
    }

    .icon-button.delete {
      background: var(--danger);
      color: white;
    }

    .icon-button.edit {
      background: var(--success);
      color: white;
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
      background: var(--gray-100);
      color: var(--gray-700);
      padding: 0.25rem 0.75rem;
      border-radius: var(--radius-md);
      font-size: 0.75rem;
    }

    h3 {
      color: var(--gray-800);
      font-size: 1.25rem;
      margin-bottom: 0.75rem;
      line-height: 1.4;
    }

    p {
      color: var(--gray-600);
      line-height: 1.6;
      margin-bottom: 1.5rem;
    }

    .stats {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1rem;
      padding: 1rem;
      background: var(--gray-100);
      border-radius: var(--radius-md);
    }

    .stat {
      text-align: center;
      color: var(--gray-700);
    }

    .stat i {
      color: var(--primary);
      margin-bottom: 0.5rem;
    }

    .stat span {
      font-size: 0.875rem;
      display: block;
    }

    /* Load More */
    .load-more {
      text-align: center;
      margin-top: 3rem;
    }

    .load-button {
      display: inline-flex;
      align-items: center;
      gap: 0.75rem;
      padding: 1rem 2rem;
      background: white;
      border: 2px solid var(--primary);
      color: var(--primary);
      border-radius: var(--radius-lg);
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
    }

    .load-button:hover {
      background: var(--primary);
      color: white;
    }

    .load-button.loading {
      opacity: 0.7;
      cursor: not-allowed;
    }

    /* Modal */
    .modal {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.5);
      display: grid;
      place-items: center;
      padding: 1rem;
      z-index: 50;
    }

    .modal-content {
      background: white;
      padding: 2rem;
      border-radius: var(--radius-lg);
      max-width: 400px;
      width: 100%;
    }

    .modal-content h2 {
      color: var(--gray-800);
      margin-bottom: 1rem;
    }

    .modal-content p {
      color: var(--gray-600);
      margin-bottom: 1.5rem;
    }

    .auth-input {
      width: 100%;
      padding: 0.75rem 1rem;
      border: 1px solid var(--gray-200);
      border-radius: var(--radius-md);
      margin-bottom: 1.5rem;
    }

    .auth-input:focus {
      outline: none;
      border-color: var(--primary);
      box-shadow: 0 0 0 3px rgba(26, 95, 122, 0.1);
    }

    .modal-actions {
      display: flex;
      gap: 1rem;
    }

    .modal-actions button {
      flex: 1;
      padding: 0.75rem;
      border-radius: var(--radius-md);
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
    }

    .confirm-button {
      background: var(--primary);
      color: white;
      border: none;
    }

    .confirm-button:hover {
      background: var(--primary-light);
    }

    .cancel-button {
      background: white;
      color: var(--gray-700);
      border: 1px solid var(--gray-200);
    }

    .cancel-button:hover {
      background: var(--gray-100);
    }

    @media (max-width: 768px) {
      .blog-section {
        padding: 1rem;
      }

      .header h1 {
        font-size: 2rem;
      }

      .projects-grid {
        grid-template-columns: 1fr;
      }

      .stats {
        grid-template-columns: 1fr;
      }

      .modal-content {
        padding: 1.5rem;
      }
    }
  `]
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

  constructor(
    private blogService: BlogService, 
    private router: Router
  ) {}

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
      }
    });
  }

  filterPosts() {
    let filtered = this.posts;

    if (this.searchTerm) {
      const search = this.searchTerm.toLowerCase();
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(search) ||
        post.description.toLowerCase().includes(search) ||
        post.tags.some(tag => tag.toLowerCase().includes(search))
      );
    }

    if (this.selectedCategory !== 'Todos') {
      filtered = filtered.filter(post =>
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
      this.blogService.deletePost(this.postToDeleteId, this.authCode).subscribe({
        next: () => {
          this.posts = this.posts.filter(post => post.id !== this.postToDeleteId);
          this.filterPosts();
          this.closeDeleteModal();
        },
        error: (error) => {
          console.error('Error deleting post:', error);
          alert('Failed to delete post. Please check your authentication code.');
        }
      });
    }
  }
}