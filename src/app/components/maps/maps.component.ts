import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoogleMapsModule } from '@angular/google-maps';

@Component({
  selector: 'app-maps',
  standalone: true,
  imports: [CommonModule, GoogleMapsModule],
  template: `
    <section class="location-section">
      <div class="location-container">
        <!-- Header -->
        <div class="location-header">
          <h2>Nuestra Ubicación</h2>
        </div>

        <!-- Map Container -->
        <div class="map-wrapper">
          <div class="map-container">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3405.9586379728958!2d-58.022993999999954!3d-31.38770399999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95ade81140e0f053%3A0xa48bc2e791251ad2!2sS.E.R.%20Energ%C3%ADa%20Solar%20en%20Concordia%20%7C%20Ingenier%C3%ADa%20Proyectos%20e%20instalaci%C3%B3n%20de%20sistemas%20solares%20fotovoltaicos!5e0!3m2!1ses!2sar!4v1736870936031!5m2!1ses!2sar"
              style="border:0;"
              allowfullscreen=""
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade">
            </iframe>
          </div>
        </div>

        <!-- Location Info -->
        <div class="location-info">
          <div class="info-card">
            <div class="info-item">
              <i class="fas fa-map-marker-alt"></i>
              <div class="info-content">
                <h3>Dirección</h3>
                <p>Las Heras 331 1er piso</p>
                <p>E3200 Concordia, Entre Ríos</p>
              </div>
            </div>

            <div class="info-item">
              <i class="fas fa-clock"></i>
              <div class="info-content">
                <h3>Horario de Atención</h3>
                <p>Lunes a Viernes: 8:00 - 12:30 / 15:30 - 20:00</p>
                <p>Sábados: 8:00 - 12:30</p>
              </div>
            </div>

            <div class="info-item">
              <i class="fas fa-phone-alt"></i>
              <div class="info-content">
                <h3>Contacto</h3>
                <p>WhatsApp: +54 9 3454 15-1258</p>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="action-buttons">
            <a href="https://www.google.com/maps/place/S.E.R.+Energ%C3%ADa+Solar+en+Concordia+%7C+Ingenier%C3%ADa+Proyectos+e+instalaci%C3%B3n+de+sistemas+solares+fotovoltaicos/@-3.8037833,-129.1079498,3z/data=!3m1!5s0x95ade81140c39fc7:0x1c7a47747a05e5d8!4m10!1m2!2m1!1sser+soluciones+en+energias+renovables!3m6!1s0x95ade81140e0f053:0xa48bc2e791251ad2!8m2!3d-31.387704!4d-58.022994!15sCiVzZXIgc29sdWNpb25lcyBlbiBlbmVyZ2lhcyByZW5vdmFibGVzWiciJXNlciBzb2x1Y2lvbmVzIGVuIGVuZXJnaWFzIHJlbm92YWJsZXOSARVncmVlbl9lbmVyZ3lfc3VwcGxpZXLgAQA!16s%2Fg%2F11p5byh0l4?entry=ttu&g_ep=EgoyMDI1MDExMC4wIKXMDSoASAFQAw%3D%3D" target="_blank" class="action-button primary">
              <i class="fas fa-directions"></i>
              Cómo Llegar
            </a>
            <a href="tel:+54 9 3454 15-1258" class="action-button secondary">
              <i class="fas fa-phone"></i>
              Llamar
            </a>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
      --primary: #0c457a;
      --primary-light: #2563eb;
      --secondary: rgb(21, 166, 250);
      --text: #1e293b;
      --text-light: #64748b;
      --background: #ffffff;
      --surface: #f8fafc;
    }

    .location-section {
      min-height: 100vh;
      background: var(--background);
      padding: 4rem 2rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .location-container {
      max-width: 1200px;
      width: 100%;
      margin: 0 auto;
    }

    .location-header {
      text-align: center;
      margin-bottom: 3rem;
    }

    .location-header h2 {
      font-size: 2.5rem;
      color: var(--primary);
      margin-bottom: 1rem;
      font-weight: 700;
    }

    .location-header p {
      color: var(--text-light);
      font-size: 1.1rem;
    }

    .map-wrapper {
      position: relative;
      margin-bottom: 3rem;
    }

    .map-container {
      position: relative;
      width: 100%;
      height: 0;
      padding-bottom: 50%;
      border-radius: 1rem;
      overflow: hidden;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
                  0 10px 10px -5px rgba(0, 0, 0, 0.04);
    }

    .map-container iframe {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }

    .location-info {
      margin-top: 2rem;
    }

    .info-card {
      background: white;
      border-radius: 1rem;
      padding: 2rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
      margin-bottom: 2rem;
    }

    .info-item {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
    }

    .info-item i {
      font-size: 1.5rem;
      color: var(--primary);
      background: rgba(12, 69, 122, 0.1);
      padding: 1rem;
      border-radius: 0.75rem;
    }

    .info-content h3 {
      font-size: 1.1rem;
      color: var(--text);
      margin-bottom: 0.5rem;
      font-weight: 600;
    }

    .info-content p {
      color: var(--text-light);
      margin-bottom: 0.25rem;
    }

    .action-buttons {
      display: flex;
      gap: 1rem;
      justify-content: center;
      margin-top: 2rem;
    }

    .action-button {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 1rem 2rem;
      border-radius: 0.75rem;
      font-weight: 600;
      transition: all 0.3s ease;
      text-decoration: none;
    }

    .action-button.primary {
      background: var(--primary);
      color: white;
    }

    .action-button.primary:hover {
      background: var(--primary-light);
      transform: translateY(-2px);
      box-shadow: 0 10px 15px -3px rgba(12, 69, 122, 0.2);
    }

    .action-button.secondary {
      background: white;
      color: var(--primary);
      border: 2px solid var(--primary);
    }

    .action-button.secondary:hover {
      background: var(--surface);
      transform: translateY(-2px);
      box-shadow: 0 10px 15px -3px rgba(12, 69, 122, 0.1);
    }

    @media (max-width: 768px) {
      .location-section {
        padding: 2rem 1rem;
      }

      .location-header h2 {
        font-size: 2rem;
      }

      .map-container {
        padding-bottom: 75%; /* Taller aspect ratio for mobile*/
      }

      .info-card {
        grid-template-columns: 1fr;
        padding: 1.5rem;
      }

      .action-buttons {
        flex-direction: column;
      }

      .action-button {
        width: 100%;
        justify-content: center;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .action-button {
        transition: none;
      }
    }
  `]
})
export class MapsComponent {
  // Map configuration
  center: google.maps.LatLngLiteral = {
    lat: -31.387704,
    lng: -58.022994
  };
  zoom = 15;
  markerPosition = this.center;
  markerTitle = 'S.E.R. Energía Solar en Concordia';
  
  // Map options
  options: google.maps.MapOptions = {
    mapTypeId: 'roadmap',
    zoomControl: true,
    scrollwheel: true,
    disableDoubleClickZoom: true,
    maxZoom: 20,
    minZoom: 4,
    mapTypeControl: true,
    streetViewControl: true,
    fullscreenControl: true,
  };

  // Marker options
  markerOptions: google.maps.MarkerOptions = {
    draggable: false,
    animation: google.maps.Animation.DROP,
  };
}