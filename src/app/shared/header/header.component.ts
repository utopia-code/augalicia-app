import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faAddressBook, faCalendar, faCircleUser, faHeart, faUser } from '@fortawesome/free-regular-svg-icons';
import { faArrowRightFromBracket, faBars, faHouse, faXmark } from '@fortawesome/free-solid-svg-icons';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { HeaderMenusDTO } from '../../Models/header-menus.dto';
import { HeaderMenusService } from '../../Services/header-menus.service';
import { LocalStorageService } from '../../Services/local-storage.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule, FontAwesomeModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit, AfterViewInit {
  @Input() hasFullWidthImage: boolean = false;

  showStandardSection: boolean = false;
  showUserSection: boolean = false;
  showAdminSection: boolean = false;

  isMenuOpen: boolean = false;

  defaultLang = 'es';

  faHeart = faHeart;
  faCalendar = faCalendar;
  faCircleUser = faCircleUser;
  faArrowRightFromBracket = faArrowRightFromBracket;
  faUser = faUser;
  faHouse = faHouse;
  faAddressBook = faAddressBook;
  faBars = faBars;
  faXmark = faXmark;
  
  constructor(
    public translate: TranslateService,
    private headerMenusService: HeaderMenusService,
    private localStorageService: LocalStorageService,
    private router: Router,
    private cdRef: ChangeDetectorRef
  ) {
    translate.addLangs(['es', 'gl', 'pt', 'en', 'fr', 'de']);
    translate.setDefaultLang(this.defaultLang);
    translate.use(this.defaultLang);

    const userRole = this.localStorageService.get('user_role');

    const headerMenu: HeaderMenusDTO = {
      showStandardSection: userRole ? false : true,
      showUserSection: userRole === 'user',
      showAdminSection: userRole === 'admin'
    }

    this.headerMenusService.headerManagement.next(headerMenu);
  }

  ngOnInit(): void {
    this.headerMenusService.headerManagement.subscribe({
      next: (headerMenu: HeaderMenusDTO) => {
        if (headerMenu) {
          this.showStandardSection = headerMenu.showStandardSection;
          this.showUserSection = headerMenu.showUserSection;
          this.showAdminSection = headerMenu.showAdminSection;

          this.cdRef.detectChanges();
        }
      }
    })
  }

  ngAfterViewInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.closeMenu();
      }
    });
  }

  closeMenu(): void {
    if (typeof document !== 'undefined') {
      const navbar = document.getElementById('navbarNavDropdown');
      if (navbar) {
        navbar.classList.remove('show');
        this.isMenuOpen = false;
      }
    }
  }

  toggleMenu(): void {
    if (typeof document !== 'undefined') {
      const navbar = document.getElementById('navbarNavDropdown');
      if (navbar) {
        this.isMenuOpen = !this.isMenuOpen;
        if (this.isMenuOpen) {
          navbar.classList.add('show');
        } else {
          navbar.classList.remove('show');
        }
      }
    }
  }
  
  

  addScrolledClass(): void {
    const header = document.querySelector('nav');
    header?.classList.add('scrolled');
  }

  removeScrolledClass(): void {
    const header = document.querySelector('nav');
    header?.classList.remove('scrolled');
  }

  switchLanguage(language: string) {
    this.translate.use(language);
  }

  home(): void {
    this.router.navigateByUrl('home');
  }

  productsList(): void {
    this.router.navigateByUrl('products');
  }

  login(): void {
    this.router.navigateByUrl('login');
  }

  register(): void {
    this.router.navigateByUrl('register');
  }

  userProfile(): void {
    this.router.navigateByUrl('user/profile');
  }

  userFavourites(): void {
    this.router.navigateByUrl('user/favourites');
  }

  userBookings(): void {
    this.router.navigateByUrl('user/bookings');
  }

  adminProfile(): void {
    this.router.navigateByUrl('admin/profile');
  }

  adminProducts(): void {
    this.router.navigateByUrl('admin/products');
  }

  adminAppointments(): void {
    this.router.navigateByUrl('admin/appointments');
  }

  adminBookedAppointments(): void {
    this.router.navigateByUrl('admin/booked-appointments');
  }

  logout(): void {
    this.localStorageService.remove('access_token');
    this.localStorageService.remove('user_email');
    this.localStorageService.remove('user_id');
    this.localStorageService.remove('user_role');

    const headerMenu: HeaderMenusDTO = {
      showStandardSection: true,
      showUserSection: false,
      showAdminSection: false
    }

    this.headerMenusService.headerManagement.next(headerMenu);

    this.router.navigateByUrl('home');
  }
}
