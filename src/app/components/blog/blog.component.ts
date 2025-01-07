import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
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
      <!-- Header -->
      <div class="blog-header">
        <h1>Obras realizadas</h1>
        <!-- <p class="subtitle">Descubre nuestros últimos trabajos y mantente informado sobre energía solar</p> -->
        <p class="subtitle">En desarrollo</p>

        <!-- Filter controls -->
        <div class="filter-controls">
          <div class="search-bar">
            <i class="fas fa-search"></i>
            <input 
              type="text" 
              placeholder="Buscar proyectos o artículos..."
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
              <span class="post-category">{{ featuredPost.category | titlecase }}</span>
              <h2>{{ featuredPost.title }}</h2>
              <p>{{ featuredPost.description }}</p>
              <button (click)="openPost(featuredPost.id)" class="read-more">
                Leer más <i class="fas fa-arrow-right"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Posts Grid -->
      <div class="posts-grid">
        <article 
          *ngFor="let post of filteredPosts" 
          class="post-card"
          [class.project-card]="post.category === 'project'"
        >
          <div class="card-image" [style.backgroundImage]="'url(' + post.imageUrl + ')'">
            <span class="post-category">{{ post.category | titlecase }}</span>
          </div>
          
          <div class="card-content">
            <div class="post-meta">
              <span class="date">{{ post.date | date:'mediumDate' }}</span>
              <div class="tags">
                <span *ngFor="let tag of post.tags" class="tag">{{ tag }}</span>
              </div>
            </div>

            <h3>{{ post.title }}</h3>
            <p>{{ post.description }}</p>

            <!-- Project Stats (if available) -->
            <div *ngIf="post.category === 'project' && post.stats" class="project-stats">
              <div class="stat">
                <i class="fas fa-bolt"></i>
                <span>{{ post.stats.powerOutput }}</span>
              </div>
              <div class="stat">
                <i class="fas fa-solar-panel"></i>
                <span>{{ post.stats.panelsInstalled }} paneles</span>
              </div>
              <div class="stat">
                <i class="fas fa-piggy-bank"></i>
                <span>{{ post.stats.costSavings }} ahorro</span>
              </div>
            </div>

            <button (click)="openPost(post.id)" class="read-more">
              {{ post.category === 'project' ? 'Ver Proyecto' : 'Leer Artículo' }}
            </button>
          </div>
        </article>
      </div>

      <!-- Load More -->
      <div class="load-more" *ngIf="hasMorePosts">
        <button (click)="loadMorePosts()" class="load-more-btn">
          Cargar Más
          <i class="fas fa-spinner" *ngIf="loading"></i>
        </button>
      </div>
    </section>
  `,
  styles: [`
    .blog-section {
      max-width: 1400px;
      margin: 0 auto;
      padding: 4rem 2rem;
    }

    .blog-header {
      text-align: center;
      margin-bottom: 3rem;
    }

    .blog-header h1 {
      font-size: 2.5rem;
      font-weight: 700;
      margin-bottom: 1rem;
      color: var(--text-primary, #333);
    }

    .subtitle {
      color: var(--text-secondary, #666);
      margin-bottom: 2rem;
    }

    .filter-controls {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      max-width: 800px;
      margin: 0 auto;
    }

    .search-bar {
      position: relative;
    }

    .search-bar input {
      width: 100%;
      padding: 1rem 1rem 1rem 3rem;
      border: 1px solid var(--border-color, #eee);
      border-radius: 8px;
      font-size: 1rem;
    }

    .search-bar i {
      position: absolute;
      left: 1rem;
      top: 50%;
      transform: translateY(-50%);
      color: var(--text-secondary, #666);
    }

    .category-filters {
      display: flex;
      gap: 0.5rem;
      justify-content: center;
      flex-wrap: wrap;
    }

    .filter-btn {
      padding: 0.5rem 1rem;
      border: 1px solid var(--border-color, #eee);
      border-radius: 20px;
      background: none;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .filter-btn.active {
      background: var(--primary-color, #4CAF50);
      color: white;
      border-color: transparent;
    }

    .featured-post {
      margin: 3rem 0;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    }

    .featured-image {
      height: 500px;
      background-size: cover;
      background-position: center;
    }

    .featured-overlay {
      height: 100%;
      background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
      display: flex;
      align-items: flex-end;
      padding: 3rem;
    }

    .featured-content {
      color: white;
      max-width: 600px;
    }

    .featured-content h2 {
      font-size: 2rem;
      margin: 1rem 0;
    }

    .posts-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 2rem;
      margin: 3rem 0;
    }

    .post-card {
      border-radius: 12px;
      overflow: hidden;
      background: white;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
      transition: transform 0.3s ease;
    }

    .post-card:hover {
      transform: translateY(-5px);
    }

    .card-image {
      height: 200px;
      background-size: cover;
      background-position: center;
      position: relative;
    }

    .post-category {
      position: absolute;
      top: 1rem;
      left: 1rem;
      background: var(--primary-color, #4CAF50);
      color: white;
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.875rem;
    }

    .card-content {
      padding: 1.5rem;
    }

    .post-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
      font-size: 0.875rem;
      color: var(--text-secondary, #666);
    }

    .tags {
      display: flex;
      gap: 0.5rem;
    }

    .tag {
      background: var(--background-secondary, #f5f5f5);
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.75rem;
    }

    .project-stats {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1rem;
      margin: 1.5rem 0;
      padding: 1rem;
      background: var(--background-secondary, #f5f5f5);
      border-radius: 8px;
    }

    .stat {
      text-align: center;
      font-size: 0.875rem;
    }

    .stat i {
      display: block;
      font-size: 1.25rem;
      color: var(--primary-color, #4CAF50);
      margin-bottom: 0.5rem;
    }

    .read-more {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      background: var(--primary-color, #4CAF50);
      color: white;
      border: none;
      border-radius: 25px;
      cursor: pointer;
      transition: background 0.3s ease;
    }

    .read-more:hover {
      background: var(--primary-dark, #45a049);
    }

    .load-more {
      text-align: center;
      margin-top: 3rem;
    }

    .load-more-btn {
      padding: 1rem 2rem;
      background: none;
      border: 2px solid var(--primary-color, #4CAF50);
      color: var(--primary-color, #4CAF50);
      border-radius: 25px;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .load-more-btn:hover {
      background: var(--primary-color, #4CAF50);
      color: white;
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

  constructor(private blogService: BlogService) {}

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
        post.description.toLowerCase().includes(search)
      );
    }

    if (this.selectedCategory !== 'Todos') {
      filtered = filtered.filter(post =>
        post.category.toLowerCase() === this.selectedCategory.toLowerCase()
      );
    }

    this.filteredPosts = filtered;
  }

  selectCategory(category: string) {
    this.selectedCategory = category;
    this.filterPosts();
  }

  loadMorePosts() {
    this.currentPage++;
    // Implement pagination logic here
  }

  openPost(id: number) {
    // Implement navigation to post detail
  }
}