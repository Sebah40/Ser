import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <footer class="footer">
      <div class="footer-container">
        <!-- Main footer content -->
        <div class="footer-grid">
          <!-- Company Info -->
          <div class="company-info">
            <h3>Soluciones en Energías Renovables</h3>
            <p>
              Transformando hogares y empresas con soluciones de energía solar sostenible.
            </p>
          </div>

          <!-- Quick Links -->
          <div class="quick-links">
            <h3>Enlaces Rápidos</h3>
            <ul>
              <li>
                <a href="#hero">Inicio</a>
              </li>
              <li>
                <a routerLink="/servicios">Servicios</a>
              </li>
              <li>
                <a href="#solutions">Soluciones</a>
              </li>
              <li>
                <a routerLink="/blog">Blog</a>
              </li>
              <li>
                <a href="#contacto">Contacto</a>
              </li>
            </ul>
          </div>

          <!-- Contact Info -->
          <div class="contact-info">
            <h3>Contacto</h3>
            <ul>
              <li>
                <i class="fas fa-map-marker-alt"></i>
                <span>Concordia, Entre Ríos</span>
              </li>
              <li>
                <i class="fas fa-envelope"></i>
                <a href="mailto:ingenieriaser@rigelec.com.ar">Correo</a>
              </li>
            </ul>
          </div>
        </div>

        <!-- Bottom bar -->
        <div class="footer-bottom">
          <p>© {{ currentYear }} SER. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background: linear-gradient(180deg,rgb(22, 51, 109) 0%,rgb(31, 33, 58) 100%);
      color: #ffffff;
      padding: 4rem 0;
      position: relative;
      overflow: hidden;
    }

    .footer::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
    }

    .footer-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1.5rem;
    }

    .footer-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 4rem;
      margin-bottom: 3rem;
    }

    h3 {
      color: #ffffff;
      font-size: 1.25rem;
      font-weight: 600;
      margin-bottom: 1.5rem;
      position: relative;
      padding-bottom: 0.75rem;
    }

    h3::after {
      content: '';
      position: absolute;
      left: 0;
      bottom: 0;
      width: 40px;
      height: 2px;
      background: #3b82f6;
      border-radius: 2px;
    }

    .company-info p {
      color: #9ca3af;
      line-height: 1.6;
      margin-bottom: 1.5rem;
    }

    .social-links {
      display: flex;
      gap: 1rem;
    }

    .social-link {
      background: rgba(255,255,255,0.1);
      color: #ffffff;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
    }

    .social-link:hover {
      background: #3b82f6;
      transform: translateY(-2px);
    }

    .quick-links ul {
      list-style: none;
      padding: 0;
    }

    .quick-links li {
      margin-bottom: 0.75rem;
    }

    .quick-links a {
      color: #9ca3af;
      text-decoration: none;
      transition: all 0.3s ease;
      display: inline-block;
      position: relative;
    }

    .quick-links a::after {
      content: '';
      position: absolute;
      width: 0;
      height: 1px;
      bottom: -2px;
      left: 0;
      background-color: #3b82f6;
      transition: width 0.3s ease;
    }

    .quick-links a:hover {
      color: #ffffff;
    }

    .quick-links a:hover::after {
      width: 100%;
    }

    .contact-info ul {
      list-style: none;
      padding: 0;
    }

    .contact-info li {
      display: flex;
      align-items: center;
      margin-bottom: 1rem;
      color: #9ca3af;
    }

    .contact-info i {
      margin-right: 0.75rem;
      color: #3b82f6;
      font-size: 1.1rem;
    }

    .contact-info a {
      color: #9ca3af;
      text-decoration: none;
      transition: color 0.3s ease;
    }

    .contact-info a:hover {
      color: #ffffff;
    }

    .footer-bottom {
      text-align: center;
      padding-top: 2rem;
      margin-top: 2rem;
      border-top: 1px solid rgba(255,255,255,0.1);
      color: #9ca3af;
    }

    @media (max-width: 768px) {
      .footer-grid {
        grid-template-columns: 1fr;
        gap: 2.5rem;
      }

      .footer {
        padding: 3rem 0;
      }
    }
  `]
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}