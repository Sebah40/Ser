import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';  // <-- Import Router
import { BlogService } from '../../services/blog.service';
// Interfaces
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
      <!-- Back Button -->
      <button (click)="goBack()" class="back-button">
        <i class="fas fa-chevron-left"></i> Volver
      </button>

      <!-- Header -->
      <div class="blog-header">
        <h1>Obras realizadas</h1>
        <div class="divider"></div>
        <p class="subtitle">En desarrollo</p>

        <!-- Filter controls -->
        <div class="filter-controls">
          <div class="search-bar">
            <i class="fas fa-search"></i>
            <input 
              type="text" 
              placeholder="Buscar proyectos..."
              [(ngModel)]="searchTerm"
              (input)="filterPosts()"
            >
          </div>
          
          <div class="category-filters">
            <button 
              *ngFor="let cat of categories" 
              [class.active]="selectedCategory === cat"
              (click)="selectCategory(cat)"
              class="filter-btn"
            >
              {{ cat }}
            </button>
          </div>
        </div>
      </div>

      <!-- Featured Post -->
      <div class="featured-post" *ngIf="featuredPost">
        <div class="featured-image" [style.backgroundImage]="'url(' + featuredPost.imageUrl + ')'">
          <div class="featured-overlay">
            <div class="featured-content">
              <span class="post-category">
                <i class="fas fa-star"></i>
                Destacado
              </span>
              <h2>{{ featuredPost.title }}</h2>
              <p>{{ featuredPost.description }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Posts Grid -->
      <div class="posts-grid">
      <article *ngFor="let post of filteredPosts" class="post-card" [class.project-card]="post.category === 'project'">
  <div class="card-image" [style.backgroundImage]="'url(' + post.imageUrl + ')'" >
    <span class="post-category">{{ post.category | titlecase }}</span>
  </div>

  <div class="card-content">
    <div class="post-meta">
      <span class="date">
        <i class="far fa-calendar"></i>
        {{ post.date | date:'d MMM, yyyy' }}
      </span>
      <div class="tags">
        <span *ngFor="let tag of post.tags" class="tag">{{ tag }}</span>
      </div>
    </div>

    <h3>{{ post.title }}</h3>
    <p>{{ post.description }}</p>

    <!-- Project Stats -->
    <div *ngIf="post.stats" class="project-stats">
      <div class="stat">
        <i class="fas fa-solar-panel"></i>
        <span class="stat-value">{{ post.stats.powerOutput }}</span>
        <span class="stat-label">Potencia</span>
      </div>
      <div class="stat">
        <i class="fas fa-plug"></i>
        <span class="stat-value">{{ post.stats.panelsInstalled }}</span>
        <span class="stat-label">Paneles</span>
      </div>
      <div class="stat">
        <i class="fas fa-leaf"></i>
        <span class="stat-value">{{ post.stats.costSavings }}</span>
        <span class="stat-label">Ahorro</span>
      </div>
    </div>

    <!-- Delete button -->
    <button (click)="openDeleteModal(post.id)" class="delete-button">Eliminar</button>
  </div>
</article>

<!-- Modal for authentication code -->
<div *ngIf="showDeleteModal" class="modal">
  <div class="modal-content">
    <h2>Eliminar Post</h2>
    <input [(ngModel)]="authCode" type="text" placeholder="Código de autenticación" class="auth-code-input" />
    <button (click)="deletePost()">Confirmar Eliminación</button>
    <button (click)="closeDeleteModal()">Cancelar</button>
  </div>
</div>
      </div>

      <div class="create-post-container">
  <button class="create-post-btn" (click)="goToCreatePost()">
    <i class="fas fa-plus"></i> Crear Post
  </button>
</div>

      <!-- Load More -->
      <div class="load-more" *ngIf="hasMorePosts">
        <button (click)="loadMorePosts()" class="load-more-btn" [class.loading]="loading">
          {{ loading ? 'Cargando...' : 'Cargar Más' }}
          <i class="fas fa-spinner fa-spin" *ngIf="loading"></i>
        </button>
      </div>
    </section>
  `,
  styles: [`
    /* Variables */
    :host {
      --primary-color: #0c457a;
      --primary-light: #1a6eb8;
      --primary-dark: #093663;
      --accent-color: #4CAF50;
      --text-primary: #2c3e50;
      --text-secondary: #64748b;
      --background-light:rgb(255, 255, 255);
      --border-color: #e2e8f0;
    }

    .blog-section {
      max-width: 1400px;
      margin: 0 auto;
      padding: 4rem 2rem;
      background: var(--background-light);
    }
    .modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
}

.delete-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: var(--primary-dark);
  color: white;
  border: none;
  border-radius: 50px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem;
}
.back-button:hover {
  background: var(--primary-color);
  color: white;
  transform: translateX(-5px);
}

/* Delete Button */
.delete-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: var(--primary-dark);
  color: white;
  border: none;
  border-radius: 50px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem;
}
.delete-button:hover {
  background: #b23b3b;
  transform: translateX(-5px);
}
.auth-code-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-size: 1rem;
  margin-bottom: 1.5rem;
  transition: all 0.3s ease;
}
.auth-code-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(12, 69, 122, 0.1);
}

.modal-content button {
  padding: 0.75rem 1.5rem;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 50px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem;
}

.modal-content button:hover {
  background: var(--primary-light);
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .modal-content {
    padding: 1.5rem;
  }

  .auth-code-input {
    font-size: 0.9rem;
  }

  .modal-content button {
    padding: 0.5rem 1.25rem;
  }

  .modal-content h2 {
    font-size: 1.5rem;
  }
}

    /* Back Button */
    .back-button {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      background: white;
      color: var(--primary-color);
      border: 1px solid var(--border-color);
      border-radius: 50px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;
      margin-bottom: 2rem;
    }

    .back-button:hover {
      background: var(--primary-color);
      color: white;
      transform: translateX(-5px);
    }

    /* Header */
    .blog-header {
      text-align: center;
      margin-bottom: 4rem;
    }

    .blog-header h1 {
      font-size: 2.75rem;
      font-weight: 700;
      color: var(--primary-color);
      margin-bottom: 1rem;
    }

    .create-post-container {
  display: flex;
  justify-content: flex-end;
  margin: 2rem 0;
}

.create-post-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1.75rem;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 50px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.create-post-btn:hover {
  background: var(--primary-light);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(12, 69, 122, 0.2);
}

.create-post-btn i {
  font-size: 1rem;
}

@media (max-width: 768px) {
  .create-post-container {
    justify-content: center;
  }
}

    .divider {
      width: 60px;
      height: 4px;
      background: var(--primary-color);
      margin: 1rem auto;
      border-radius: 2px;
    }

    .subtitle {
      color: var(--text-secondary);
      font-size: 1.1rem;
      margin-bottom: 2.5rem;
    }

    /* Filter Controls */
    .filter-controls {
      max-width: 800px;
      margin: 0 auto;
      background: white;
      padding: 2rem;
      border-radius: 16px;
      box-shadow: 0 4px 20px rgba(12, 69, 122, 0.1);
    }

    .search-bar {
      position: relative;
      margin-bottom: 1.5rem;
    }

    .search-bar input {
      width: 100%;
      padding: 1rem 1rem 1rem 3rem;
      border: 1px solid var(--border-color);
      border-radius: 50px;
      font-size: 1rem;
      transition: all 0.3s ease;
    }

    .search-bar input:focus {
      outline: none;
      border-color: var(--primary-color);
      box-shadow: 0 0 0 3px rgba(12, 69, 122, 0.1);
    }

    .search-bar i {
      position: absolute;
      left: 1.2rem;
      top: 50%;
      transform: translateY(-50%);
      color: var(--primary-color);
    }

    .category-filters {
      display: flex;
      gap: 0.75rem;
      justify-content: center;
      flex-wrap: wrap;
    }

    .filter-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.25rem;
      border: 1px solid var(--border-color);
      border-radius: 50px;
      background: white;
      color: var(--text-primary);
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .filter-btn i {
      color: var(--primary-color);
    }

    .filter-btn.active {
      background: var(--primary-color);
      color: white;
      border-color: transparent;
    }

    .filter-btn.active i {
      color: white;
    }

    /* Featured Post */
    .featured-post {
      margin: 4rem 0;
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 4px 30px rgba(12, 69, 122, 0.15);
    }

    .featured-image {
      height: 600px;
      background-size: cover;
      background-position: center;
    }

    .featured-overlay {
      height: 100%;
      background: linear-gradient(to top, rgba(12, 69, 122, 0.9), transparent);
      display: flex;
      align-items: flex-end;
      padding: 4rem;
    }

    .featured-content {
      color: white;
      max-width: 800px;
    }

    .featured-content h2 {
      font-size: 2.5rem;
      margin: 1rem 0;
      line-height: 1.2;
    }

    /* Posts Grid */
    .posts-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 2rem;
      margin: 3rem 0;
    }

    .post-card {
      border-radius: 16px;
      overflow: hidden;
      background: white;
      box-shadow: 0 4px 20px rgba(12, 69, 122, 0.08);
      transition: all 0.3s ease;
    }

    .post-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 30px rgba(12, 69, 122, 0.12);
    }

    .card-image {
      height: 240px;
      background-size: cover;
      background-position: center;
      position: relative;
    }

    .post-category {
      position: absolute;
      top: 1rem;
      left: 1rem;
      background: var(--primary-color);
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 50px;
      font-size: 0.875rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .card-content {
      padding: 2rem;
    }

    .post-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
      color: var(--text-secondary);
    }

    .date {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .tags {
      display: flex;
      gap: 0.5rem;
    }

    .tag {
      background: var(--background-light);
      padding: 0.25rem 0.75rem;
      border-radius: 50px;
      font-size: 0.75rem;
    }

    h3 {
      font-size: 1.5rem;
      color: var(--primary-color);
      margin-bottom: 1rem;
      line-height: 1.3;
    }

    /* Project Stats */
    .project-stats {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.5rem;
      margin: 2rem 0;
      padding: 1.5rem;
      background: var(--background-light);
      border-radius: 12px;
    }

    .stat {
      text-align: center;
    }

    .stat i {
      font-size: 1.5rem;
      color: var(--primary-color);
      margin-bottom: 0.5rem;
    }

    .stat-value {
      display: block;
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--primary-color);
      margin-bottom: 0.25rem;
    }

    .stat-label {
      font-size: 0.875rem;
      color: var(--text-secondary);
    }

    /* Buttons */
    .read-more {
      display: inline-flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.875rem 1.75rem;
      background: var(--primary-color);
      color: white;
      border: none;
      border-radius: 50px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .read-more:hover {
      background: var(--primary-light);
      transform: translateX(5px);
    }

    .load-more {
      text-align: center;
      margin-top: 4rem;
    }

    .load-more-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.75rem;
      padding: 1rem 2.5rem;
      background: transparent;
      color: var(--primary-color);
      border: 2px solid var(--primary-color);
      border-radius: 50px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .load-more-btn:hover {
      background: var(--primary-color);
      color: white;
    }

    .load-more-btn.loading {
      background: var(--primary-light);
      color: white;
      border-color: transparent;
    }

    /* Responsive Design */
    @media (max-width: 992px) {
      .posts-grid {
        grid-template-columns: repeat(2, 1fr);
      }

      .featured-image {
        height: 500px;
      }
    }

    @media (max-width: 768px) {
      .blog-section {
        padding: 2rem 1rem;
      }

      .featured-image {
        height: 300px;
      }

      .featured-overlay {
        padding: 1.5rem;
      }

      .featured-content h2 {
        font-size: 1.5rem;
      }

      .posts-grid {
        grid-template-columns: 1fr;
      }

      .project-stats {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class BlogComponent implements OnInit {
  searchTerm: string = '';
  selectedCategory: string = 'Todos';
  categories: string[] = ['Todos', 'Proyectos', 'Artículos'];
  featuredPost: BlogPost | null = null;
  posts: BlogPost[] = [];
  filteredPosts: BlogPost[] = [];
  hasMorePosts: boolean = true;
  loading: boolean = false;
  currentPage: number = 1;
  postsPerPage: number = 10; // Number of posts per page for pagination
  showDeleteModal = false;
  authCode = ''; // Store the authCode here
  postToDeleteId: number | null = null; // Store post ID for deletion

  constructor(private blogService: BlogService, private router: Router) {}

  ngOnInit() {
    this.loadPosts();
  }

  loadPosts() {
    this.loading = true;
    this.blogService.getPosts().subscribe({
      next: (posts) => {
        this.posts = posts;
        this.featuredPost = posts[0]; // Assuming first post is featured
        this.filterPosts();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error cargando posts:', error);
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
        post.description.toLowerCase().includes(search)
      );
    }

    if (this.selectedCategory !== 'Todos') {
      filtered = filtered.filter(post =>
        post.category.toLowerCase() === this.selectedCategory.toLowerCase()
      );
    }

    // Pagination logic: Only show the posts for the current page
    const startIndex = (this.currentPage - 1) * this.postsPerPage;
    const endIndex = startIndex + this.postsPerPage;
    this.filteredPosts = filtered.slice(startIndex, endIndex);

    // Check if there are more posts to load
    this.hasMorePosts = filtered.length > endIndex;
  }

  selectCategory(category: string) {
    this.selectedCategory = category;
    this.currentPage = 1; // Reset to the first page when category changes
    this.filterPosts();
  }

  goBack() {
    this.router.navigate(['/']); // Navigate to the root (home) page
  }

  goToCreatePost() {
    this.router.navigate(['/crearblog']);
  }

  loadMorePosts() {
    if (this.hasMorePosts && !this.loading) {
      this.loading = true;
      this.currentPage++;
      this.filterPosts();  // Re-filter and load the next set of posts
      this.loading = false;
    }
  }
  openDeleteModal(postId: number) {
    this.showDeleteModal = true;
    this.postToDeleteId = postId;
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
    this.authCode = '';  // Reset the authCode input
  }

  deletePost() {
    if (this.authCode && this.postToDeleteId !== null) {
      this.blogService.deletePost(this.postToDeleteId, this.authCode).subscribe({
        next: () => {
          // Successfully deleted the post
          this.filteredPosts = this.filteredPosts.filter(post => post.id !== this.postToDeleteId);
          this.closeDeleteModal();  // Close modal
        },
        error: (err) => {
          console.error('Failed to delete post:', err);
          alert('No se pudo eliminar el post. Verifique el código de autenticación.');
        },
      });
    } else {
      alert('Por favor, ingrese un código de autenticación válido.');
    }
  }
}