import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCircle as faCircleEmpty } from '@fortawesome/free-regular-svg-icons';
import { faCalendarDays, faCircle, faHeartPulse, faMountainSun, faPersonSwimming, faSpa, faWater } from '@fortawesome/free-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, FontAwesomeModule, TranslateModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  faPersonSwimming = faPersonSwimming;
  faWater = faWater;
  faCalendarDays = faCalendarDays;
  faSpa = faSpa;
  faHeartPulse = faHeartPulse;
  faMountainSun = faMountainSun;
  faCircle = faCircle;
  faCircleEmpty = faCircleEmpty;

  filterCards: any[] = [];
  infoCards: any[] = [];

  headTable: any[] = [];
  rowsTable: any[] = [];

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.filterCards = [
      { linkType: 'type-termal-centre', linkId: '3,4', img: 'swimming-pool-9101047_1280_600', title: 'HOME.THERME' },
      { linkType: 'type-termal-centre', linkId: '1', img: 'funny-underwater-family-legs-swimming-poo_600', title: 'HOME.SPA' },
      { linkType: 'type-termal-centre', linkId: '2', img: 'towel-2608095_1280_600', title: 'HOME.SPA_HOTEL' },
      { linkType: 'service', linkId: '13', img: 'pexels-cottonbro-7235060_600', title: 'IMSERSO' },
    ]

    this.infoCards = [
      { icon: faWater, title: 'OFFER' },
      { icon: faCalendarDays, title: 'PLAN' },
      { icon: faSpa, title: 'BEAUTY' },
      { icon: faHeartPulse, title: 'HEALTHY' },
      { icon: faPersonSwimming, title: 'SPORT' },
      { icon: faMountainSun, title: 'NATURE' }
    ]

    this.headTable = [
      { label: 'SULFUROUS',  isClickable: true, filterId: '1' },
      { label: 'SODIUM',  isClickable: true, filterId: '2' },
      { label: 'BICARBONATE',  isClickable: true, filterId: '3' },
      { label: 'FLUORIDATED',  isClickable: true, filterId: '4' },
      { label: 'RADIOACTIVE',  isClickable: true, filterId: '5' },
      { label: 'CHLORIDE',  isClickable: true, filterId: '6' },
      { label: 'SULFATE',  isClickable: false, filterId: '' },
      { label: 'CARBONATED',  isClickable: true, filterId: '8' },
      { label: 'FERRUGINOUS',  isClickable: false, filterId: '' },
      { label: 'OLIGOMETALLIC',  isClickable: false, filterId: '' },
      { label: 'HYPERTHERMAL',  isClickable: true, filterId: '11' },
    ]

    this.rowsTable = [
      this.createRow('RHEUMATISM', '1', [true, false, false, false, true, false, false, false, false, false, false]),
      this.createRow('DERMATOLOGICAL', '2', [true, false, false, false, false, false, false, false, false, false, false]),
      this.createRow('DIGESTIVE', '3', [false, true, true, false, false, true, true, false, false, false, false]),
      this.createRow('PSYCHOLOGICAL', '4', [false, false, false, false, false, false, false, true, false, false, true]),
      this.createRow('CARDIOVASCULAR', '5', [false, false, true, false, false, true, false, true, false, false, false]),
      this.createRow('RENAL', '6', [false, true, true, false, false, false, true, false, false, false, false]),
      this.createRow('HEPATIC', '7', [false, false, false, false, false, false, false, false, false, false, false]),
      this.createRow('ENDOCRINE', '8', [false, true, false, false, false, false, true, false, true, false, false]),
      this.createRow('OSTEOARTHRITIS', '11', [true, false, false, true, false, false, false, false, false, false, false]),
      this.createRow('ARTHRITIS', '12', [true, false, false, false, true, false, false, false, false, false, false]),
      this.createRow('NERVOUS_SYSTEM', '13', [true, false, false, false, true, false, false, false, true, true, false]),
      this.createRow('MUSCULOSKELETAL_SYSTEM', '14', [false, false, false, true, true, false, false, false, false, false, true]),
      this.createRow('RESPIRATORY_SYSTEM', '15', [true, false, false, false, false, true, false, true, false, true, true]),
      this.createRow('ALLERGIES', '16', [false, false, false, false, false, false, false, false, false, true, false])
    ]
  }

  createRow(label: string, filterId: string | null, iconStatus: boolean[]): any {
    return {
      label,
      filterId,
      data: iconStatus.map(status => ({
        isActive: status,
      })),
    };
  }

  showProductsByFilters(type: string, ids: string): void {
    this.router.navigate(['/products'], { queryParams: { type: type, ids: ids } });
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.initBlobAnimation();
    }
  }

  initBlobAnimation(): void {
    const canvas = document.querySelector('.blobs-canvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      console.error('Error: No se pudo obtener el contexto 2D del lienzo.');
      return;
    }

    const blobs: any[] = [];

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });

    canvas.style.filter = 'url(#goo)';

    class Blob {
      x: number;
      y: number;
      radius: number;
      color: string;
      dx: number;
      dy: number;
      pathData: string;
      size: number;
      rotation: number;
      rotationSpeed: number;
      rotationOffset: number;
      ctx: CanvasRenderingContext2D;

      constructor(ctx: CanvasRenderingContext2D) {
        this.ctx = ctx;
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.radius = Math.random() * 60 + 8;
        this.color = this.getRandomColor();
        this.dx = (Math.random() - 0.5) * 1;
        this.dy = (Math.random() - 0.5) * 1;
        this.pathData = this.createRandomPath();
        this.size = Math.random() * 0.2 + 0.05;
        this.rotation = Math.random() * Math.PI * 2; 
        this.rotationSpeed = (Math.random() - 0.5) * 0.005;
        this.rotationOffset = Math.random() * Math.PI * 2;
      }

      getRandomColor() {
        const colors = [
          'rgba(136, 187, 206, .3)',
          'rgba(72, 158, 177, .15)',
          'rgba(245, 249, 250, 1)',
          'rgba(226, 229, 231, 1',
          'rgba(222, 233, 239, 1)',
          'rgba(240, 240, 237, 1)',
          'rgba(207, 230, 241, 1)',
          'rgba(249, 251, 252, 1)',
        ];
        return colors[Math.floor(Math.random() * colors.length)];
      }

      getDarkerColor(color: string) {
        const rgb = color.match(/\d+/g);
        if (rgb && rgb.length === 3) {
          
          const r = Math.max(parseInt(rgb[0]) - 90, 0);
          const g = Math.max(parseInt(rgb[1]) - 90, 0);
          const b = Math.max(parseInt(rgb[2]) - 90, 0);
          return `rgb(${r}, ${g}, ${b})`;
        }
        return color;
      }

      createRandomPath() {
        const randomShape = [
          "M410.6 78.8c36 52.5 36.1 126 19.2 194C412.9 340.7 379 403 330 421.9c-49 19-113.1-5.3-178.6-34C85.8 359.2 18.7 326.1 3.5 276.4-11.7 226.7 25 160.3 71.7 105.3 118.3 50.3 174.8 6.8 239 .7c64.1-6 135.7 25.5 171.6 78.1z",
          "M381.4 86.5c43.5 48 77.5 110.3 68.8 168.7-8.6 58.4-59.9 113-114.8 126.7-54.9 13.6-113.4-13.7-176.6-40.6-63.1-27-130.7-53.5-151.5-102.8-20.9-49.2 5.1-121.1 50.3-169.5C102.8 20.7 167.1-3.9 225.9.5c58.8 4.5 111.9 38.1 155.5 86z",
          "M291.8 55.3c30.4 39.9 30.7 102 17 160.4-13.8 58.3-41.6 112.9-84 130.9s-99.3-.6-137-30C50.2 287.1 32 246.9 17 200.5 2.1 154.1-9.6 101.4 11.5 63.6 32.6 25.8 86.6 2.8 143.8.2c57.2-2.6 117.6 15.2 148 55.1z",
          "M389.3 42c39.8 40.8 47.5 116.3 21.3 165.4-26.1 49.1-86 71.8-145.9 104.3-59.8 32.5-119.6 74.8-168.9 63.4C46.5 363.7 7.6 298.5 1 235.7-5.5 173 20.3 112.5 59.8 71.9 99.3 31.2 152.4 10.2 215 2.8 277.5-4.7 349.5 1.2 389.3 42z",
          "M271.9 50.3c30.6 29.3 51.3 75.5 46.6 123.9-4.6 48.4-34.6 99-86.5 136.3s-125.6 61.4-168.3 35.3S9.4 243.5 3.4 177.3C-2.7 111.2-3.1 55.2 24 26.7 51.1-1.9 105.9-2.9 153.4 2.8c47.6 5.8 88 18.2 118.5 47.5z",
          "M275.9 63.1c30.7 37.3 50.9 84.2 43 126.9-7.9 42.7-44.1 81.2-93 112.1C177 332.9 115.2 356 70.9 337 26.5 317.9-.4 256.7 0 204.6c.4-52 28-95 59.7-132.5C91.4 34.5 127.1 2.3 165.5.1c38.5-2.2 79.7 25.7 110.4 63z",
          "M286.9 54.2c42.7 34.9 89.4 85.3 84.2 130.4-5.2 45.1-62.1 84.7-118 102.3S142.3 300 94.8 278C47.2 256 6.9 216.6.8 173.9S22.7 85.2 56 52.4C89.4 19.6 127.9.1 166.6 0s77.6 19.2 120.3 54.2z",
          "M320.8 58.4c47.1 38.8 97.8 95 90.8 143s-71.7 87.7-138.3 117.2c-66.5 29.5-134.7 48.7-186.4 26.5C35.3 322.9.3 259.3 0 203.3-.3 147.4 34.1 99.2 71 62.8 107.9 26.3 147.2 1.7 188.7.1c41.4-1.7 84.9 19.6 132.1 58.3z",
          "M309.9 70.6c37.8 52.7 39.8 128.7 15.4 184.1-24.3 55.4-75 90.1-125.4 107.4-50.4 17.4-100.4 17.4-136.2-3.3-35.7-20.7-57.2-62-62.4-102.1-5.2-40.2 5.8-79 29.1-128.3C53.6 79.1 89.1 19.3 143.7 4.1 198.3-11.2 272 18 309.9 70.6z",
           "M260.2 41.4c20 29.2 14.6 74.5 7.2 124.4-7.3 49.9-16.6 104.5-49.2 126-32.5 21.6-88.4 10.2-132-15.2s-75-64.7-83.6-107.8C-6.1 125.7 8 79 36.3 47.8 64.5 16.7 107 1.3 150.9.1c43.9-1.1 89.3 12 109.3 41.3z",
           "M363.8 52.4c42.8 41.3 68 108.8 47.9 153.5-20.1 44.8-85.6 66.7-143 87.4-57.4 20.8-106.8 40.3-156.7 28.7C62 310.4 11.5 267.7 1.8 217.7c-9.7-49.9 21.5-107 61.5-147.6C103.2 29.5 152 5.3 206.4.8c54.5-4.6 114.7 10.4 157.4 51.6z",
           "M369.4 109.2c43.2 55.3 71.5 121.4 53.4 167.3-18.2 45.8-82.8 71.4-140.5 91.7-57.8 20.4-108.7 35.4-152.9 20.3C85.1 373.4 47.6 328.3 23.2 267c-24.5-61.2-35.8-138.6-2.5-191.7C54.1 22.2 132-6.6 200 1.3c68 7.9 126.1 52.5 169.4 107.9z"
        ];
        return randomShape[Math.floor(Math.random() * randomShape.length)];
     }

      draw() {
        this.ctx.save()
   
        this.ctx.translate(this.x, this.y);
        this.ctx.scale(this.size, this.size);
        
        this.ctx.rotate(this.rotation);
        
        const path = new Path2D(this.pathData);
        
        this.ctx.fillStyle = this.color;
        const borderColor = this.getDarkerColor(this.color);
        this.ctx.lineWidth = 10;
        this.ctx.strokeStyle = borderColor;
        this.ctx.stroke(path)
        this.ctx.fill(path);
        
        this.ctx.restore();
      }

      update() {
        this.x += this.dx;
        this.y += this.dy;

        if (this.x - this.radius < 0 || this.x + this.radius > canvas.width) {
          this.dx *= -1;
        }
        if (this.y - this.radius < 0 || this.y + this.radius > canvas.height) {
          this.dy *= -1;
        }
        
        this.rotation += this.rotationSpeed;
        this.rotation += Math.sin(Date.now() * 0.001 + this.rotationOffset) * 0.005;

        this.draw();
      }
    }

    function init() {
      for (let i = 0; i < 20; i++) {
        blobs.push(new Blob(ctx!));
      }
    }

    function animate() {
      if (!ctx) {
        console.error('2D context is not available');
        return;
      }

      requestAnimationFrame(animate);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.filter = 'url(#goo)';
      blobs.forEach(blob => blob.update());
    }

    init();
    animate();
  }
}
