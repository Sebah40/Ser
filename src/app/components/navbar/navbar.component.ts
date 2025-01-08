import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],

  template: `
    <nav class="navbar" [class.hidden]="isHidden">
      <div class="navbar-content">
        <div class="logo">
          <img src="./logo-color.svg" alt="Logo" class="logo-img" />
        </div>

        <div class="menu-toggle" (click)="toggleMenu()">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M3 12h18M3 6h18M3 18h18" />
          </svg>
        </div>

        <ul class="nav-links" [class.open]="menuOpen">
          <li><a href="/" class="nav-link">Inicio</a></li>
          <li><a href="#finder" class="nav-link">Contacto</a></li>
          <li><a href="/blog" class="nav-link">Obras realizadas</a></li> <!-- Added Blog button -->
          <li>
            <a
              href="https://tienda.rigelec.com.ar/?product_cat=8-kits-solares"
              target="_blank"
              class="store-button"
            >
              Tienda
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="store-icon"
              >
                <path
                  d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"
                ></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
            </a>
          </li>
        </ul>
      </div>
    </nav>
  `,

  styles: [
    `
      body {
        margin: 0;
        padding: 0;
      }

      .navbar {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 1000;
        transition: transform 0.3s ease, opacity 0.3s ease;
        padding: 1rem 0;
        background: rgba(208, 228, 235, 0.8);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
      }

      .navbar.hidden {
        transform: translateY(-100%);
        opacity: 0;
      }

      .navbar-content {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 2rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .logo-img {
        height: 40px;
        width: auto;
        transition: transform 0.3s ease;
      }

      .logo-img:hover {
        transform: scale(1.05);
      }

      .nav-links {
        display: flex;
        list-style-type: none;
        margin: 0;
        padding: 0;
        align-items: center;
        gap: 2rem;
      }

      .nav-link {
        text-decoration: none;
        color: rgb(255, 255, 255);
        font-size: 1rem;
        font-weight: 600;
        padding: 0.5rem 1rem;
        border-radius: 0.5rem;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        gap: 0.25rem;
      }

      .nav-link:hover {
        background: rgba(12, 69, 122, 0.1);
        transform: translateY(-1px);
      }

      .store-button {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        background: #4caf50;
        color: white;
        padding: 0.5rem 1.25rem;
        border-radius: 50px;
        text-decoration: none;
        font-weight: 600;
        font-size: 1rem;
        transition: all 0.3s ease;
        border: 2px solid transparent;
      }

      .store-button:hover {
        background: #45a049;
        transform: translateY(-2px);
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      }

      .store-icon {
        transition: transform 0.3s ease;
      }

      .store-button:hover .store-icon {
        transform: translateY(-1px);
      }

      .menu-toggle {
        display: none;
        cursor: pointer;
      }

      @media (max-width: 768px) {
        .menu-toggle {
          display: block;
        }

        .nav-links {
          display: none;
          flex-direction: column;
          width: 100%;
          background: rgba(208, 228, 235, 0.9);
          position: absolute;
          top: 80px;
          left: 0;
          padding: 1rem 0;
          gap: 1rem;
          align-items: center;
          transition: all 0.3s ease;
        }

        .nav-links.open {
          display: flex;
        }

        .nav-link {
          font-size: 1rem;
          padding: 0.5rem;
        }

        .store-button {
          padding: 0.5rem 1.25rem;
          font-size: 1rem;
        }
      }
    `
  ]
})
export class NavbarComponent {
  isHidden = false;
  lastScrollTop = 0;

  menuOpen = false;

  constructor() {
    window.addEventListener('scroll', this.onScroll.bind(this));
  }

  onScroll() {
    const scrollTop = window.scrollY;

    if (scrollTop > this.lastScrollTop && scrollTop > 50) {
      // Scrolling down, hide navbar
      this.isHidden = true;
    } else if (scrollTop < this.lastScrollTop) {
      // Scrolling up, show navbar
      this.isHidden = false;
    }

    this.lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // Prevent negative scroll
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen; // Toggle the visibility of the menu
  }
}
