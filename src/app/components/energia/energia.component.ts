import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { interval, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';

interface GrowattData {
  eTotal: number;
  pac: number;
  eToday: number;
}

@Component({
  selector: 'app-energia',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="energia-section">
      <div *ngIf="isLoading" class="loading-container">
        <div class="loader"></div>
      </div>
  
      <div *ngIf="!isLoading" class="content-container">
        <div class="cards-grid">
          <!-- Energy Generation Card -->
          <div class="card">
            <div class="card-figure">
              <i class="fas fa-bolt icon"></i>
            </div>
            <div class="card-body">
              <div class="card-content">
                <h2 class="card-title">Potencia total que generamos</h2>
                <div class="card-badge">
                  {{ growattData.eTotal }} Kw
                </div>
              </div>
            </div>
          </div>

          <!-- CO2 Reduction Card -->
          <div class="card">
            <div class="card-figure">
              <i class="fas fa-leaf icon"></i>
            </div>
            <div class="card-body">
              <div class="card-content">
                <h2 class="card-title">Reduccion de emisiones de CO2</h2>
                <div class="card-badge">
                  {{ (growattData.eTotal * 0.4).toFixed(2) }} Kg
                </div>
              </div>
            </div>
          </div>

          <!-- Daily Energy Card -->
          <div class="card">
            <div class="card-figure">
              <i class="fas fa-sun icon"></i>
            </div>
            <div class="card-body">
              <div class="card-content">
                <h2 class="card-title">Energía generada durante el día</h2>
                <div class="card-badge">
                  {{ growattData.eToday }}kW
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .energia-section {
      min-height: 100vh;
      padding: 2rem;
      background: var(--base-100, #ffffff);
    }

    .loading-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
    }

    .loader {
      width: 48px;
      height: 48px;
      border: 5px solid #FFF;
      border-bottom-color: #0c457a;
      border-radius: 50%;
      animation: rotation 1s linear infinite;
    }

    @keyframes rotation {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .content-container {
      padding-top: 8rem;
    }

    .cards-grid {
      display: grid;
      grid-template-columns: repeat(1, 1fr);
      gap: 1rem;
      padding: 1rem;
    }

    @media (min-width: 768px) {
      .cards-grid {
        grid-template-columns: repeat(3, 1fr);
      }
    }

    .card {
      background: var(--base-100, #ffffff);
      border-radius: 1rem;
      overflow: hidden;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 
                  0 2px 4px -1px rgba(0, 0, 0, 0.06);
      transition: transform 0.3s ease;
    }

    .card:hover {
      transform: translateY(-5px);
    }

    .card-figure {
      height: 200px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg,rgb(89, 40, 129) 0%, #0c457a 100%);
    }

    .icon {
      font-size: 4rem;
      color: white;
    }

    .card-body {
      background: var(--base-200, #f8f9fa);
      padding: 1.5rem;
    }

    .card-content {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 0.5rem;
    }

    .card-title {
      font-size: 1.25rem;
      font-weight: 600;
      margin: 0;
      color: #2c3e50;
    }

    .card-badge {
      background: #0c457a;
      color: white;
      padding: 0.75rem 1.5rem;
      border-radius: 0.5rem;
      font-weight: 600;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    @media (max-width: 768px) {
      .content-container {
        padding-top: 4rem;
      }

      .card-title {
        font-size: 1.1rem;
      }

      .card-badge {
        padding: 0.5rem 1rem;
      }
    }
  `]
})
export class EnergiaComponent implements OnInit, OnDestroy {
  growattData: GrowattData = {
    eTotal: 0,
    pac: 0,
    eToday: 0
  };
  isLoading: boolean = true;
  private dataSubscription?: Subscription;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchData();
    this.startDataPolling();
  }

  ngOnDestroy() {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }

  private fetchData() {
    this.http.get<GrowattData>('/api/growatt').subscribe({
      next: (data) => {
        this.growattData = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching Growatt data:', error);
        this.isLoading = false;
      }
    });
  }

  private startDataPolling() {
    this.dataSubscription = interval(60000) // Poll every minute
      .pipe(
        switchMap(() => this.http.get<GrowattData>('/api/growatt'))
      )
      .subscribe({
        next: (data) => {
          this.growattData = data;
        },
        error: (error) => {
          console.error('Error polling Growatt data:', error);
        }
      });
  }
}