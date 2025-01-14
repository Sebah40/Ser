import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoogleMapsModule } from '@angular/google-maps';

@Component({
  selector: 'app-maps',
  standalone: true,
  imports: [CommonModule, GoogleMapsModule],
  template: `
    <google-map
      height="400px"
      width="100%"
      [center]="center"
      [zoom]="zoom"
      [options]="options">
      <map-marker
        [position]="markerPosition"
        [title]="markerTitle"
        [options]="markerOptions">
      </map-marker>
    </google-map>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
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