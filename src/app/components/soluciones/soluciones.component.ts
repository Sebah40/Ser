import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-soluciones',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="solutions-container">
      <div
        class="solution-panel"
        (mouseenter)="activePanel = 'offgrid'"
        (mouseleave)="activePanel = null"
      >
        <div
          class="background-image"
          style="background-image: url('/Off grid.jpg')"
        ></div>
        <div class="overlay" [class.active]="activePanel === 'offgrid'">
          <h2 class="title">Off Grid</h2>
          <div class="button-group" [class.show]="activePanel === 'offgrid'">
            <button class="info-button" (click)="openSolution('offgrid')">
              Ver más
            </button>
            <a
              href="https://tienda.rigelec.com.ar/?product_cat=b-aislados"
              target="_blank"
              class="store-button"
            >
              Rigelec Store
            </a>
          </div>
        </div>
      </div>

      <div
        class="solution-panel"
        (mouseenter)="activePanel = 'ongrid'"
        (mouseleave)="activePanel = null"
      >
        <div
          class="background-image"
          style="background-image: url('/On grid.jpg')"
        ></div>
        <div class="overlay" [class.active]="activePanel === 'ongrid'">
          <h2 class="title">On Grid</h2>
          <div class="button-group" [class.show]="activePanel === 'ongrid'">
            <button class="info-button" (click)="openSolution('ongrid')">
              Ver más
            </button>
            <a
              href="https://tienda.rigelec.com.ar/?product_cat=a-ahorro"
              target="_blank"
              class="store-button"
            >
              Rigelec Store
            </a>
          </div>
        </div>
      </div>

      <div
        class="solution-panel"
        (mouseenter)="activePanel = 'bombeo'"
        (mouseleave)="activePanel = null"
      >
        <div
          class="background-image"
          style="background-image: url('/bombeo.jpg')"
        ></div>
        <div class="overlay" [class.active]="activePanel === 'bombeo'">
          <h2 class="title">Bombeo Solar</h2>
          <div class="button-group" [class.show]="activePanel === 'bombeo'">
            <button class="info-button" (click)="openSolution('bombeo')">
              Ver más
            </button>
            <a
              href="https://tienda.rigelec.com.ar/?product_cat=e-bombeo"
              target="_blank"
              class="store-button"
            >
              Rigelec Store
            </a>
          </div>
        </div>
      </div>
    </section>
    <!-- Modal -->
    <div class="modal" *ngIf="selectedSolution">
      <div class="modal-content">
        <h2>{{ modalTitle }}</h2>
        <iframe
          *ngIf="pdfUrl"
          [src]="pdfUrl"
          width="100%"
          height="500px"
          frameborder="0"
        ></iframe>
        <button (click)="closeModal()">Cerrar</button>
      </div>
    </div>
  `,
  styles: [
    `
      .solutions-container {
        display: flex;
        height: 100vh;
        width: 100%;
        overflow: hidden;
      }

      .solution-panel {
        position: relative;
        flex: 1;
        overflow: hidden;
        transition: flex 0.6s cubic-bezier(0.4, 0, 0.2, 1);
      }

      .solution-panel:hover {
        flex: 1.5;
      }

      .background-image {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-size: cover;
        background-position: center;
        transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
      }

      .button-group {
        position: absolute;
        bottom: 40px;
        display: flex;
        flex-direction: column;
        gap: 1rem;
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.4s ease;
      }

      .button-group.show {
        opacity: 1;
        transform: translateY(0);
      }

      .info-button,
      .store-button {
        padding: 0.8rem 2rem;
        border-radius: 50px;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        text-align: center;
        min-width: 200px;
      }

      .info-button {
        background-color: transparent;
        border: 2px solid white;
        color: white;
      }

      .info-button:hover {
        background-color: white;
        color: black;
      }

      .store-button {
        background-color: #ffd700;
        color: black;
        border: none;
        text-decoration: none;
        display: inline-block;
      }

      .store-button:hover {
        background-color: #ffed4a;
        transform: translateY(-2px);
      }

      .solution-panel:hover .background-image {
        transform: scale(1.1);
      }

      .overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(
          to bottom,
          rgba(0, 0, 0, 0.3) 0%,
          rgba(0, 0, 0, 0.6) 100%
        );
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        transition: background 0.4s ease;
      }

      .overlay.active {
        background: linear-gradient(
          to bottom,
          rgba(0, 0, 0, 0.4) 0%,
          rgba(0, 0, 0, 0.8) 100%
        );
      }

      .title {
        color: white;
        font-size: 2.5rem;
        font-weight: 700;
        text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
        margin: 0;
        transition: transform 0.4s ease;
      }

      .solution-panel:hover .title {
        transform: translateY(-30px);
      }

      .ver-mas {
        position: absolute;
        bottom: 40px;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        color: white;
        font-size: 1.2rem;
        font-weight: 600;
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.4s ease;
      }

      .ver-mas.show {
        opacity: 1;
        transform: translateY(0);
      }

      .ver-mas svg {
        transition: transform 0.3s ease;
      }

      .ver-mas:hover svg {
        transform: translateX(5px);
      }

      .modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
      }

      .modal-content {
        background: white;
        padding: 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        width: 95vw;
        height: 95vh;
        display: flex;
        flex-direction: column;
        position: relative;
      }

      .modal-content h2 {
        margin: 0 0 1rem 0;
        font-size: 1.5rem;
      }

      .modal-content iframe {
        flex: 1;
        width: 100%;
        height: calc(100% - 80px);
        border: none;
        margin-bottom: 1rem;
      }

      .modal-content button {
        background-color: #007bff;
        color: white;
        border: none;
        padding: 0.75rem 1.5rem;
        border-radius: 4px;
        cursor: pointer;
        font-size: 1rem;
        position: absolute;
        right: 1.5rem;
        top: 1.5rem;
        transition: background-color 0.3s ease;
      }

      .modal-content button:hover {
        background-color: #0056b3;
      }

      @media (max-width: 768px) {
        .solutions-container {
          flex-direction: column;
        }

        .solution-panel {
          height: 33.333vh;
        }

        .solution-panel:hover {
          flex: 2;
        }

        .title {
          font-size: 2rem;
        }

        .modal-content {
          width: 100vw;
          height: 100vh;
          border-radius: 0;
        }

        .modal-content button {
          padding: 0.5rem 1rem;
        }
      }
    `,
  ],
})
export class SolucionesComponent {
  activePanel: string | null = null;
  selectedSolution: string | null = null;
  modalTitle: string = '';
  pdfUrl: SafeResourceUrl | null = null;

  constructor(private sanitizer: DomSanitizer) {}

  openSolution(solution: string) {
    this.selectedSolution = solution;
    switch (solution) {
      case 'offgrid':
        this.modalTitle = 'Off Grid';
        this.pdfUrl =
          this.sanitizer.bypassSecurityTrustResourceUrl('/pdfs/off-grid.pdf');
        break;
      case 'ongrid':
        this.modalTitle = 'On Grid';
        this.pdfUrl =
          this.sanitizer.bypassSecurityTrustResourceUrl('/pdfs/on-grid.pdf');
        break;
      case 'bombeo':
        this.modalTitle = 'Bombeo Solar';
        this.pdfUrl =
          this.sanitizer.bypassSecurityTrustResourceUrl('/pdfs/bombeo.pdf');
        break;
      default:
        this.modalTitle = '';
        this.pdfUrl = null;
    }
  }

  closeModal() {
    this.selectedSolution = null;
    this.pdfUrl = null;
  }
}
