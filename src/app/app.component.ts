import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { filter } from 'rxjs';
import { SharedService } from './Services/shared.service';
import { FooterComponent } from './shared/footer/footer.component';
import { HeaderComponent } from './shared/header/header.component';
import { ToastComponent } from './shared/toast/toast.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, 
    RouterOutlet, 
    TranslateModule, 
    HeaderComponent, 
    FooterComponent,
    FontAwesomeModule,
    ToastComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'AuGalicia';
  routeTitle: string = '';
  fullWidthImage: string = '';
  hasFullWidthImage: boolean = false;
  isHomeRoute: boolean = false;

  routeImages: { [key: string]: { image: string, title: string } } = {
    // '/home': 'http://localhost:3000/coast-7210473_1280.webp',
    // '/home': 'http://localhost:3000/drop-545377_1280.webp',
    // '/home': 'http://localhost:3000/surface-4373559_1280.webp', // si
    // '/home': 'http://localhost:3000/swimming-pool-9101047_1280.webp', // si
    // '/home': 'http://localhost:3000/underwater-4286600_1280.webp',
    // '/home': 'http://localhost:3000/water-424807_1280.webp',
    // '/home': 'http://localhost:3000/water-1867710_1280.webp',
    // '/home': 'http://localhost:3000/water-5245722_1280.webp'
    '/home': {
      image: 'http://localhost:3000/surface-4373559_1280.webp', 
      title: 'SLOGAN'
    },
  }

  @ViewChild(ToastComponent) toastComponent!: ToastComponent;
  @ViewChild(HeaderComponent) headerComponent!: HeaderComponent;

  constructor(
    private sharedService: SharedService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      const routeData = this.routeImages[event.urlAfterRedirects];

      this.isHomeRoute = event.urlAfterRedirects === '/home';

      if (routeData) {
        this.fullWidthImage = routeData.image;
        this.routeTitle = routeData.title;
        this.hasFullWidthImage = true;
      } else {
        this.fullWidthImage = '';
        this.routeTitle = '';
        this.hasFullWidthImage = false;
      }
    });
  }

  ngAfterViewInit(): void {
    this.sharedService.setAppComponent(this);

    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', this.onScroll.bind(this));
    }
  }

  showToast(message: string): void {
    this.toastComponent.toastMessage = message;
    this.toastComponent.showToast();
  }

  onScroll(): void {
    if (window.scrollY > 0) {
      this.headerComponent?.addScrolledClass();
    } else {
      this.headerComponent?.removeScrolledClass();
    }
  }

}
