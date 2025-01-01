import { CommonModule, Location } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCircleXmark, faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';
import { faBriefcaseMedical, faDroplet, faFilter, faHeartPulse, faHeart as faHeartSolid, faHouse, faShower, faSpa, faWater, faWheelchairMove, faXmark } from '@fortawesome/free-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { combineLatest, forkJoin, map, Observable, of } from 'rxjs';
import { FavouriteDTO } from '../../Models/favourite.dto';
import { Accesibility, ComplementaryTechnique, Image, ProductDTO, Service, TermalTechnique, Treatment, TypeTermalCentre, TypeWater } from '../../Models/product.dto';
import { TruncateWordsPipe } from '../../pipes/truncate-words.pipe';
import { AuthService } from '../../Services/auth.service';
import { FavouritesService } from '../../Services/favourites.service';
import { FiltersService } from '../../Services/filters.service';
import { LocalStorageService } from '../../Services/local-storage.service';
import { ProductService } from '../../Services/product.service';
import { SharedService } from '../../Services/shared.service';


@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    TruncateWordsPipe, 
    FontAwesomeModule,
    TranslateModule
  ],
  templateUrl: './products-list.component.html',
  styleUrl: './products-list.component.scss'
})
export class ProductsListComponent implements OnInit {
  products: ProductDTO[] = [];
  favourites: FavouriteDTO[] = [];

  faHeartRegular = faHeartRegular;
  faHeartSolid = faHeartSolid;
  faXmark = faXmark;
  faHouse = faHouse;
  faWater = faWater;
  faDroplet = faDroplet;
  faSpa = faSpa;
  faWheelchairMove = faWheelchairMove;
  faShower = faShower;
  faHeartPulse = faHeartPulse;
  faBriefcaseMedical = faBriefcaseMedical;
  faFilter = faFilter;
  faCircleXmark = faCircleXmark;

  typeTermalCentreList: TypeTermalCentre[] = [];
  termalTechniquesList: TermalTechnique[] = [];
  typeWatersList: TypeWater[] = [];
  treatmentsList: Treatment[] = [];
  servicesList: Service[] = [];
  accesibilityList: Accesibility[] = [];
  complementaryTechniquesList: ComplementaryTechnique[] = [];

  appliedFilters: { type: string; id: number; label: string }[] = [];
  filteredProducts: ProductDTO[] = [];
  filterType: string | null = null;
  showFilter: boolean = false;

  accordionSections: any[] = []

  errorMessage: string = '';

  constructor(
    private router: Router,
    private productService: ProductService,
    private favouritesService: FavouritesService,
    private localStorageService: LocalStorageService,
    private authService: AuthService,
    private filterService: FiltersService,
    private sharedService: SharedService,
    private activatedRoute: ActivatedRoute,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.initializeData();

    this.accordionSections = [
      { id: 'collapseOne', label: 'TERMAL_CENTRE', filterKey: 'TYPE_TERMAL_CENTRE', list: this.typeTermalCentreList, icon: faWater },
      { id: 'collapseTwo', filterKey: 'TYPE_WATER', list: this.typeWatersList, icon: faDroplet },
      { id: 'collapseThree', filterKey: 'TERMAL_TECHNIQUES', list: this.termalTechniquesList, icon: faShower },
      { id: 'collapseFour', filterKey: 'TREATMENTS', list: this.treatmentsList, icon: faBriefcaseMedical },
      { id: 'collapseFive', filterKey: 'SERVICES', list: this.servicesList, icon: faHouse },
      { id: 'collapseSix', filterKey: 'ACCESSIBILITY', list: this.accesibilityList, icon: faWheelchairMove },
      { id: 'collapseSeven', filterKey: 'COMPLEMENTARY_TECHNIQUES', list: this.complementaryTechniquesList, icon: faSpa },
    ].map((section, index) => ({
      ...section,
      class: index === 0 ? '' : 'collapsed',
      expanded: index === 0,
      classBody: index === 0 ? 'show' : '',
      filterKey: section.filterKey || section.label,
    }));

    this.activatedRoute.queryParams.subscribe((params) => {
      const type = params['type'];
      const ids = params['ids']?.split(',').map((id: string) => Number(id));
  
      if (type && ids) {
        this.loadMultipleFilters(type, ids);
      } else {
        this.getAllProducts();
      }
    });

  }

  toogleFilterContainer(): void {
    this.showFilter = !this.showFilter;
  }

  loadMultipleFilters(type: string, ids: number[]): void {
    const requests = ids.map((id) => {
      switch (type) {
        case 'type-termal-centre':
          return this.productService.getAllProductsByTypeTermalCentre(id);
        case 'type-water':
          return this.productService.getAllProductsByTypeWater(id);
        case 'treatment':
          return this.productService.getAllProductsByTreatment(id);
        case 'services':
          return this.productService.getAllProductsByService(id);
        default:
          return [];
      }
    });

    forkJoin(requests).subscribe((responses) => {
      this.products = this.setImageUrl(responses.flat());
      // this.clearUrl();
    });
  }

  initializeData(): void {
    this.loadTypeTermalCentre();
    this.loadTermalTechniques();
    this.loadTypeWaters();
    this.loadTreatments();
    this.loadServices();
    this.loadComplementaryTechniques();
    this.loadAccesibility(); 
    this.getAllProducts();
    this.loadFavourites();
  }

  loadData<T>(serviceCall: Observable<T[]>, targetArray: T[]): void {
    serviceCall.subscribe({
      next: (data: T[]) => targetArray.push(...data),
      error: (error: HttpErrorResponse) => console.error(error.error.message),
    });
  }

  clearUrl(): void {
    this.location.replaceState('/products');
  }

  loadTypeTermalCentre(): void {
    this.loadData(this.filterService.getAllTypeTermalCentre(), this.typeTermalCentreList);
  }

  loadTermalTechniques(): void {
    this.loadData(this.filterService.getAllTermalTechniques(), this.termalTechniquesList);
  }

  loadTypeWaters(): void {
    this.loadData(this.filterService.getAllTypeWaters(), this.typeWatersList);
  }

  loadTreatments(): void {
    this.loadData(this.filterService.getAllTreatments(), this.treatmentsList);
  }

  loadServices(): void {
    this.loadData(this.filterService.getAllServices(), this.servicesList);
  }

  loadComplementaryTechniques(): void {
    this.loadData(this.filterService.getAllComplementaryTechniques(), this.complementaryTechniquesList);
  }

  loadAccesibility(): void {
    this.loadData(this.filterService.getAllAccesibility(), this.accesibilityList);
  }

  applyFilter(filterType: string, id: number, label: string): void {
    this.getProductsByFilter(filterType, id).subscribe({
      next: (products: ProductDTO[]) => {
        if (products.length === 0) {
          this.errorMessage = 'FILTERS.ERROR.EMPTY_LIST';
          this.sharedService.showToast(this.errorMessage);
          return;
        }
        
        const existingFilter = this.appliedFilters.find(filter => filter.type === filterType);
        if (existingFilter) {
          existingFilter.id = id;
          existingFilter.label = label;
        } else {
          this.appliedFilters.push({ type: filterType, id, label });
        }
  
        this.filterProducts();
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage = error.error.message;
        this.sharedService.showToast(this.errorMessage);
      }
    });
  }

  filterProducts(): void {
    const filters$ = this.appliedFilters.map(filter =>
      this.getProductsByFilter(filter.type, filter.id)
    );
  
    combineLatest(filters$).pipe(
      map((results) =>
        results.reduce((intersection, products) =>
          intersection.filter(product =>
            products.some(newProduct => newProduct.id === product.id)
          ), results[0] || [])
      )
    ).subscribe({
      next: (products: ProductDTO[]) => {
        this.products = this.setImageUrl(products);
        if (products.length === 0) {
          this.errorMessage = 'FILTERS.ERROR.EMPTY_LIST';
          this.sharedService.showToast(this.errorMessage);
        }
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage = error.error.message;
        this.sharedService.showToast(this.errorMessage);
      }
    });
  }
  
  getProductsByFilter(filterType: string, id: number): Observable<ProductDTO[]> {
    switch (filterType) {
      case 'TYPE_TERMAL_CENTRE':
        return this.productService.getAllProductsByTypeTermalCentre(id);
      case 'TERMAL_TECHNIQUES':
        return this.productService.getAllProductsByTermalTechnique(id);
      case 'TYPE_WATER':
        return this.productService.getAllProductsByTypeWater(id);
      case 'TREATMENTS':
        return this.productService.getAllProductsByTreatment(id);
      case 'SERVICES':
        return this.productService.getAllProductsByService(id);
      case 'ACCESSIBILITY':
        return this.productService.getAllProductsByAccesibility(id);
      case 'COMPLEMENTARY_TECHNIQUES':
        return this.productService.getAllProductsByComplementaryTechnique(id);
      default:
        return of([]);
    }
  }

  removeFilter(filterType: string): void {
    this.appliedFilters = this.appliedFilters.filter(filter => filter.type !== filterType);

    this.filterProducts();
  }

  isFilterActive(filterType: string, itemId: number): boolean {
    return this.appliedFilters.some(filter => filter.id === itemId && filter.type === filterType);
  }

  getMainImage(images: Image[] | undefined): Image | undefined {
    return images?.find(image => image.url.endsWith('01.webp'));
  }

  private setImageUrl(products: ProductDTO[]): ProductDTO[] {
    return products.map(product => {
      if (product.images && product.images.length > 0) {
        product.images.forEach(image => {
          if (!image.url.startsWith('http://localhost:3000')) {
            image.url = `http://localhost:3000${image.url.replace('/public', '')}`;
          }
        });
      }
      return product;
    })
  }
  
  private getAllProducts(): void {
    this.productService.getProducts().subscribe(
      (products: ProductDTO[]) => {
        this.products = this.setImageUrl(products);
        console.log('this.products: ', this.products)
      },
      (error: HttpErrorResponse) => {
        console.log(error.error.message);
      }
    )
  }

  getProductById(id: number | undefined): void {
    this.router.navigateByUrl(`products/${id}`);
  }


  loadFavourites(): void {
    if (this.authService.isUser()) {
      this.favouritesService.getAllFavourites().subscribe({
        next: (favourites) => {
          this.favourites = favourites;
          console.log('Favourites: ', this.favourites)
        },
        error: (error: HttpErrorResponse) => console.error('Error al cargar favoritos:', error)
      })
    }
  }

  isFavourite(productId:number | undefined): boolean {
    return this.favourites.some(favourite => favourite.productId === productId);
  }

  toggleFavourite(product: ProductDTO): void {
    if (!this.authService.isUser()) {
      console.warn('FILTERS.ERROR.AUTH');
      this.errorMessage = 'FILTERS.ERROR.AUTH';
      this.sharedService.showToast(this.errorMessage);
      return;
    }

    const productId = product.id;

    if (productId) {
      const existingFavourite = this.favourites.find(
        (favourite) => favourite.productId === productId
      );
      
      if (existingFavourite) {
        this.favouritesService.deleteFromFavourites(productId).subscribe({
          next: () => {
            this.favourites = this.favourites.filter(
              (favourite) => favourite.productId !== productId
            );
          },
          error: (error) => console.error(error)
        })
      } else {
        const userEmail = this.localStorageService.get('user_email');
        
        if (userEmail) {
          const newFavourite: FavouriteDTO = {
            productId: productId,
            userEmail: userEmail
          };
    
          this.favouritesService.addToFavourites(newFavourite).subscribe({
            next: (favourite) => {
              this.favourites.push(favourite)
            },
            error: (error) => console.error(error)
          })
        }
      }
    }
  }
 }
 