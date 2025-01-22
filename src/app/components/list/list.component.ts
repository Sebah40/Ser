import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BlogService } from '../../services/blog.service';
import { NavbarComponent } from '../navbar/navbar.component';

interface Project {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  date: string;
  tags: string[];
  powerOutput?: string;
  panelsInstalled?: number;
  costSavings?: string;
}

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  template: `
    <section class="projects-section">
      <!-- Header -->
       <app-navbar></app-navbar>
       &nbsp;
      <header class="header">
        <h1>Nuestros Proyectos Realizados</h1>
        <p>Explora nuestra trayectoria en instalaciones solares</p>
      </header>

      <!-- Search -->
      <div class="search-container">
        <div class="search-wrapper">
          <input 
            type="text" 
            [(ngModel)]="searchTerm"
            (input)="filterProjects()"
            placeholder="Buscar por ubicación o tipo de instalación..."
            class="search-input"
          >
          <i class="fas fa-search search-icon"></i>
        </div>
      </div>

      <!-- Projects List -->
      <div class="projects-list">
        <div 
          *ngFor="let project of filteredProjects" 
          class="project-card"
          (click)="openProject(project)"
        >
          <div class="project-image" [style.backgroundImage]="'url(' + project.imageUrl + ')'">
            <div class="project-overlay">
              <div class="project-date">
                <i class="far fa-calendar"></i>
                {{ project.date | date:'dd/MM/yyyy' }}
              </div>
            </div>
          </div>

          <div class="project-content">
            <h3>{{ project.title }}</h3>
            <p>{{ project.description }}</p>

            <div class="project-stats">
              <div class="stat" *ngIf="project.powerOutput">
                <i class="fas fa-solar-panel"></i>
                <span class="stat-value">{{ project.powerOutput }} kW</span>
                <span class="stat-label">Potencia</span>
              </div>
              <div class="stat" *ngIf="project.panelsInstalled">
                <i class="fas fa-plug"></i>
                <span class="stat-value">{{ project.panelsInstalled }}</span>
                <span class="stat-label">Paneles</span>
              </div>
              <div class="stat" *ngIf="project.costSavings">
                <i class="fas fa-leaf"></i>
                <span class="stat-value">{{ project.costSavings }}%</span>
                <span class="stat-label">Generación</span>
              </div>
            </div>

            <div class="project-tags">
              <span *ngFor="let tag of project.tags" class="tag">{{ tag }}</span>
            </div>

            <button class="view-details">
              Ver Detalles <i class="fas fa-arrow-right"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Load More -->
      <div *ngIf="hasMoreProjects" class="load-more">
        <button 
          (click)="loadMoreProjects()" 
          class="load-button"
          [class.loading]="loading"
        >
          {{ loading ? 'Cargando...' : 'Ver más proyectos' }}
          <i *ngIf="loading" class="fas fa-spinner fa-spin"></i>
        </button>
      </div>
    </section>
  `,
  styles: [`
    /* Base Variables */
    :host {
      --primary: #0c457a;
      --primary-light: #1a6eb8;
      --primary-dark: #093358;
      --accent: #7fcbc8;
      --white: #ffffff;
      --text-primary: #1e293b;
      --text-secondary: #64748b;
      --shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.05);
      --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
      --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
      display: block;
      width: 100%;
    }
  
    /* Layout */
    .projects-section {
      min-height: 100vh;
      padding: 5rem 2rem;
      background: linear-gradient(
        135deg,
        var(--primary) 0%,
        var(--primary-light) 70%,
        var(--accent) 100%
      );
      color: var(--white);
    }
  
    /* Header Styles */
    .header {
      max-width: 800px;
      margin: 0 auto 4rem;
      text-align: center;
    }
  
    .header h1 {
      font-size: clamp(2rem, 5vw, 3rem);
      margin-bottom: 1rem;
      font-weight: 800;
      position: relative;
      display: inline-block;
    }
  
    .header h1::after {
      content: '';
      position: absolute;
      bottom: -0.5rem;
      left: 50%;
      transform: translateX(-50%);
      width: 100px;
      height: 4px;
      background: var(--accent);
      border-radius: 2px;
    }
  
    .header p {
      font-size: 1.2rem;
      opacity: 0.9;
    }
  
    /* Search Section */
    .search-container {
      max-width: 600px;
      margin: 0 auto 4rem;
      padding: 1.5rem;
      background: rgba(255, 255, 255, 0.1);
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
      font-size: 1rem;
      transition: all 0.3s ease;
    }
  
    .search-icon {
      position: absolute;
      left: 1rem;
      top: 50%;
      transform: translateY(-50%);
      color: var(--text-secondary);
    }
  
    /* Projects Grid */
    .projects-list {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 2rem;
      max-width: 1400px;
      margin: 0 auto;
    }
  
    /* Project Card */
    .project-card {
      background: var(--white);
      border-radius: 1rem;
      overflow: hidden;
      box-shadow: var(--shadow-lg);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
  
    .project-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.2);
    }
  
    .project-image {
      height: 240px;
      background-size: cover;
      background-position: center;
      position: relative;
    }
  
    .project-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(
        to bottom,
        transparent,
        rgba(0, 0, 0, 0.7)
      );
      display: flex;
      align-items: flex-start;
      justify-content: flex-end;
      padding: 1.5rem;
    }
  
    .project-date {
      background: var(--white);
      color: var(--primary);
      padding: 0.5rem 1rem;
      border-radius: 0.5rem;
      font-size: 0.875rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
  
    .project-content {
      padding: 2rem;
    }
  
    .project-content h3 {
      font-size: 1.5rem;
      color: var(--primary);
      margin-bottom: 1rem;
      font-weight: 600;
    }
  
    .project-content p {
      color: var(--text-secondary);
      line-height: 1.6;
      margin-bottom: 1.5rem;
    }
  
    /* Project Stats */
    .project-stats {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1rem;
      padding: 1.5rem;
      border-radius: 1rem;
      margin-bottom: 1.5rem;
    }
  
    .stat {
      text-align: center;
      padding: 1rem;
      background: rgb(3, 75, 134);
      border-radius: 0.5rem;
      color: var(--white);
    }
  
    .stat i {
      font-size: 1.25rem;
      margin-bottom: 0.5rem;
    }
  
    .stat-value {
      font-size: 1.25rem;
      font-weight: 700;
      margin-bottom: 0.25rem;
    }
  
    .stat-label {
      font-size: 0.875rem;
      opacity: 0.9;
    }
  
    /* Tags */
    .project-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-bottom: 1.5rem;
    }
  
    .tag {
      background: var(--primary);
      color: var(--white);
      padding: 0.5rem 1rem;
      border-radius: 2rem;
      font-size: 0.875rem;
    }
  
    /* Buttons */
    .view-details,
    .load-button {
      background: var(--primary);
      color: var(--white);
      padding: 1rem 2rem;
      border-radius: 0.5rem;
      border: none;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }
  
    .view-details {
      width: 100%;
    }
  
    .view-details:hover,
    .load-button:hover {
      background: var(--primary-light);
      transform: translateY(-2px);
    }
  
    .load-more {
      text-align: center;
      margin-top: 4rem;
    }
  
    /* Responsive Design */
    @media (max-width: 768px) {
      .projects-section {
        padding: 3rem 1rem;
      }
  
      .projects-list {
        grid-template-columns: 1fr;
      }
  
      .project-stats {
        grid-template-columns: 1fr;
      }
    }
  
    @media (max-width: 480px) {
      .header h1 {
        font-size: 1.75rem;
      }
  
      .project-image {
        height: 200px;
      }
  
      .project-content {
        padding: 1.5rem;
      }
    }
  `]
})
export class ListComponent implements OnInit {
  searchTerm: string = '';
  projects: Project[] = [];
  filteredProjects: Project[] = [];
  hasMoreProjects: boolean = true;
  loading: boolean = false;
  currentPage: number = 1;
  projectsPerPage: number = 6;

  constructor(
    private blogService: BlogService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadProjects();
  }

  loadProjects() {
    this.loading = true;
    this.blogService.getPosts().subscribe({
      next: (posts) => {
        // Filter only projects (not articles)
        this.projects = posts.filter(post => post.category === 'project');
        this.filterProjects();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading projects:', error);
        this.loading = false;
      }
    });
  }

  filterProjects() {
    let filtered = this.projects;

    if (this.searchTerm) {
      const search = this.searchTerm.toLowerCase();
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(search) ||
        project.description.toLowerCase().includes(search) ||
        project.tags.some(tag => tag.toLowerCase().includes(search))
      );
    }

    const startIndex = (this.currentPage - 1) * this.projectsPerPage;
    const endIndex = startIndex + this.projectsPerPage;
    this.filteredProjects = filtered.slice(startIndex, endIndex);
    this.hasMoreProjects = filtered.length > endIndex;
  }

  loadMoreProjects() {
    if (this.hasMoreProjects && !this.loading) {
      this.currentPage++;
      this.filterProjects();
    }
  }

  openProject(project: Project) {
    this.router.navigate(['/project', project.id]);
  }
}