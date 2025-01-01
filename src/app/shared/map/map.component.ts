import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, Input, OnChanges, SimpleChanges } from '@angular/core';


@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss'
})
export class MapComponent implements AfterViewInit, OnChanges {
  @Input() coordinates!: { 
    lat: number, 
    lng: number, 
    type: string, 
    name: string, 
    address: string,
    cp: string,
    location: string
  };
  @Input() nearbyCoordinates: { 
    lat: number, 
    lng: number, 
    type: string, 
    name: string, 
    address: string,
    cp: string,
    location: string
  }[] = [];

  private map: any;
  isBrowser: boolean = false;
  mapInitialized: boolean = false;

  private zoomLevel = 12;

  constructor(private cdr: ChangeDetectorRef) {}

  async ngAfterViewInit(): Promise<void> {
    if (typeof window === 'undefined') return;

    if (this.mapInitialized) return;

    const { default: L } = await import('leaflet');
    this.initMap(L);
    this.mapInitialized = true;
    this.cdr.detectChanges();
  }

  async ngOnChanges(changes: SimpleChanges): Promise<void> {
    if (typeof window === 'undefined') return;
    
    if (changes['nearbyCoordinates'] && this.nearbyCoordinates.length > 0) {
      const { default: L } = await import('leaflet');
      this.updateMapMarkers(L);
    }
  }


  private initMap(L: any): void {
    this.map = L.map('map').setView(
      [this.coordinates.lat, this.coordinates.lng],
      this.zoomLevel
    );

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.map);

    this.addMainMarker(L);
  }

  private addMainMarker(L:any): void {
    if (!this.map) return;

    const brandIcon = this.createColoredIcon(L, 'var(--bs-primary)');

    L.marker([this.coordinates.lat, this.coordinates.lng], { icon: brandIcon })
      .addTo(this.map)
      .bindPopup(`
        <div>
          <strong>${this.coordinates.name}</strong>
          <p>${this.coordinates.address}<br>${this.coordinates.cp}<br>${this.coordinates.location}</p>
        </div>
      `);
  }

  private updateMapMarkers(L:any): void {
    if (!this.map || this.nearbyCoordinates.length === 0) return;

    const productTypeColors: { [key: string]: string } = {
      ACCOMODATION: 'rgb(0, 106, 151)',
      RESTAURANT: 'rgb(153,0,0)',
      CULTURE: 'rgb(193, 44, 139)',
      ACTIVITIES: 'rgb(0,102,0)',
      BAR: 'rgb(222, 200, 0)',
    };

    this.nearbyCoordinates.forEach(product => {
      const color = productTypeColors[product.type] || 'gray';
      const icon = this.createColoredIcon(L , color);

      const marker = L.marker([product.lat, product.lng], { icon })
        .addTo(this.map!)
        .bindPopup(`
          <div>
            <strong>${product.name}</strong>
            <p>${product.address}<br>${product.cp}<br>${product.location}</p>
          </div>
        `);

      marker.on('click', () => marker.openPopup());
    });
  }

  private createColoredIcon(L: any, color: string): L.DivIcon {

    const svgIcon = `
        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="${color}">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 3.75 5 11 7 13 2-2 7-9.25 7-13 0-3.87-3.13-7-7-7zM12 11.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
        </svg>
      `;
    
    return L.divIcon({
      className: 'custom-icon',
      html: svgIcon,
      iconSize: [30, 41],
      iconAnchor: [12, 41],
      popupAnchor: [3, -37],
    });
  }
}
