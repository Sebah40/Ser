import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule

@Component({
  selector: 'app-soluciones',
  standalone: true,
  imports: [CommonModule], // Add CommonModule to imports
  template: `
    <section class="solutions-container">
      <div
        class="solution-panel"
        (mouseenter)="activePanel = 'offgrid'"
        (mouseleave)="activePanel = null"
        (click)="openSolution('offgrid')"
      >
        <div
          class="background-image"
          style="background-image: url('/Off grid.jpg')"
        ></div>
        <div class="overlay" [class.active]="activePanel === 'offgrid'">
          <h2 class="title">Off Grid</h2>
          <div class="ver-mas" [class.show]="activePanel === 'offgrid'">
            <span>Ver más</span>
          </div>
        </div>
      </div>

      <div
        class="solution-panel"
        (mouseenter)="activePanel = 'ongrid'"
        (mouseleave)="activePanel = null"
        (click)="openSolution('ongrid')"
      >
        <div
          class="background-image"
          style="background-image: url('/On grid.jpg')"
        ></div>
        <div class="overlay" [class.active]="activePanel === 'ongrid'">
          <h2 class="title">On Grid</h2>
          <div class="ver-mas" [class.show]="activePanel === 'ongrid'">
            <span>Ver más</span>
          </div>
        </div>
      </div>

      <div
        class="solution-panel"
        (mouseenter)="activePanel = 'bombeo'"
        (mouseleave)="activePanel = null"
        (click)="openSolution('bombeo')"
      >
        <div
          class="background-image"
          style="background-image: url('./bombeo.jpg')"
        ></div>
        <div class="overlay" [class.active]="activePanel === 'bombeo'">
          <h2 class="title">Bombeo Solar</h2>
          <div class="ver-mas" [class.show]="activePanel === 'bombeo'">
            <span>Ver más</span>
          </div>
        </div>
      </div>
    </section>
    <!-- Modal -->
    <div class="modal" *ngIf="selectedSolution">
      <div class="modal-content">
        <h2>{{ modalTitle }}</h2>
        <p>{{ modalText }}</p>
        <button (click)="closeModal()">Cerrar</button>
      </div>
    </div>
  `,
  styles: [
    `
      /* Your existing styles here */
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
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
      }

      .modal-content {
        background: white;
        padding: 2rem;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        max-width: 500px;
        text-align: center;
      }

      .modal-content h2 {
        margin-bottom: 1rem;
      }

      .modal-content button {
        background-color: #007bff;
        color: white;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 4px;
        cursor: pointer;
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
      }
    `,
  ],
})
export class SolucionesComponent {
  activePanel: string | null = null;
  selectedSolution: string | null = null;
  modalTitle: string = '';
  modalText: string = '';

  openSolution(solution: string) {
    this.selectedSolution = solution;
    switch (solution) {
      case 'offgrid':
        this.modalTitle = 'Off Grid';
        this.modalText =
          'Las soluciones Off Grid están diseñadas para lugares remotos sin acceso a la red eléctrica. Proveen energía utilizando paneles solares y baterías.';
        break;
      case 'ongrid':
        this.modalTitle = 'On Grid';
        this.modalText =
          'Las soluciones On Grid están conectadas a la red eléctrica. Permiten reducir costos energéticos y vender excedentes de energía.';
        break;
      case 'bombeo':
        this.modalTitle = 'Bombeo Solar';
        this.modalText =
          'El bombeo solar es ideal para el suministro de agua en áreas rurales, utilizando energía solar para bombear agua de pozos o ríos.';
        break;
      default:
        this.modalTitle = '';
        this.modalText = '';
    }
  }

  closeModal() {
    this.selectedSolution = null;
  }
}
