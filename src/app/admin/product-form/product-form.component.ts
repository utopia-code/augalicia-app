import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, ReactiveFormsModule, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { forkJoin } from 'rxjs';
import {
  Accesibility,
  ComplementaryTechnique,
  Image,
  Notification,
  OpeningSeason,
  ProductDTO,
  Service,
  TermalTechnique,
  Treatment,
  TypeProduct,
  TypeTermalCentre,
  TypeWater
} from '../../Models/product.dto';
import { FeaturesService } from '../../Services/features.service';
import { FiltersService } from '../../Services/filters.service';
import { LocalStorageService } from '../../Services/local-storage.service';
import { ProductService } from '../../Services/product.service';

interface FilePreview {
  name: string;
  url: string;
}

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule, FontAwesomeModule],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss'
})
export class ProductFormComponent implements OnInit {
  @Input() productId: string | null = null;
  @Output() sentComplete = new EventEmitter<boolean>();
  @Output() formCancelled = new EventEmitter<void>();

  isUpdateMode: boolean;
  isOpenMode: boolean = false;
  isValidForm: boolean | null;
  errorMessage: string | null = null;

  typeProductList: TypeProduct[] = [];
  typeTermalCentreList: TypeTermalCentre[] = [];
  termalTechniquesList: TermalTechnique[] = [];
  typeWatersList: TypeWater[] = [];
  treatmentsList: Treatment[] = [];
  servicesList: Service[] = [];
  accesibilityList: Accesibility[] = [];
  complementaryTechniquesList: ComplementaryTechnique[] = [];
  openingSeasonList: OpeningSeason[] = [];
  imagesList: Image[] = [];

  product!: ProductDTO;

  name: UntypedFormControl;
  tel: UntypedFormControl;
  email: UntypedFormControl;
  web: UntypedFormControl;
  address: UntypedFormControl;
  cp: UntypedFormControl;
  location: UntypedFormControl;
  desc: UntypedFormControl;
  coordinates: UntypedFormControl;
  typeProduct: UntypedFormControl;
  typeTermalCentre: UntypedFormControl;
  ageRequirement: UntypedFormControl;
  temperature: UntypedFormControl;
  images: Image[] = []
  notifications: Notification[] = [];

  fileSelected: boolean = false;
  fileToUploadUrl: string = '';
  fileError: boolean = false;

  filePreviews: FilePreview[] = [];
  filesToUpload: File[] = [];

  notificationTypeList: string[] = [
    'alert',
    'info',
    'advice'
  ]
  notificationPositionList: string[] = [
    'top',
    'middle',
    'bottom'
  ]
  notificationType: UntypedFormControl;
  notificationPosition: UntypedFormControl;
  notificationDesc: UntypedFormControl;

  productForm: UntypedFormGroup;

  selectedTypeProduct: string = '';

  faTrashCan = faTrashCan;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private productService: ProductService,
    private localStorageService: LocalStorageService,
    private filterService: FiltersService,
    private featuresService: FeaturesService
  ) {

    this.isValidForm = null;
    this.isUpdateMode = false;
    
    this.product = new ProductDTO('', '', '', '', '', '', '', '', '');

    this.name = new UntypedFormControl(this.product.name, [
      Validators.required
    ]);
    this.tel = new UntypedFormControl(this.product.tel, [
      Validators.required
    ]);
    this.email = new UntypedFormControl(this.product.email, [
      Validators.required
    ]);
    this.web = new UntypedFormControl(this.product.web, [
      Validators.required
    ]);
    this.address = new UntypedFormControl(this.product.address, [
      Validators.required
    ]);
    this.cp = new UntypedFormControl(this.product.cp, [
      Validators.required
    ]);
    this.location = new UntypedFormControl(this.product.location, [
      Validators.required
    ]);
    this.desc = new UntypedFormControl(this.product.desc, [
      Validators.required
    ]);
    this.coordinates = new UntypedFormControl(this.product.coordinates, [
      Validators.required
    ]);
    this.ageRequirement = new UntypedFormControl(0, []);
    this.temperature = new UntypedFormControl(0, []);
    this.typeProduct = new UntypedFormControl("", []);
    this.typeTermalCentre = new UntypedFormControl("", []);

    this.notificationType = new UntypedFormControl("", []);
    this.notificationPosition = new UntypedFormControl("", []);
    this.notificationDesc = new UntypedFormControl("", []);
  
    
    this.loadTypeProduct();
    this.loadTypeTermalCentre();
    this.loadNotifications()

    this.productForm = this.formBuilder.group({
      name: this.name,
      tel: this.tel,
      email: this.email,
      web: this.web,
      address: this.address,
      cp: this.cp,
      location: this.location,
      desc: this.desc,
      coordinates: this.coordinates,
      ageRequirement: this.ageRequirement,
      temperature: this.temperature,
      typeProduct: this.typeProduct,
      typeTermalCentre: this.typeTermalCentre,
      termalTechniques: this.formBuilder.array([]),
      typeWaters: this.formBuilder.array([]),
      treatments: this.formBuilder.array([]),
      services: this.formBuilder.array([]),
      accesibility: this.formBuilder.array([]),
      complementaryTechniques: this.formBuilder.array([]),
      openingSeason: this.formBuilder.array([]),
      notificationType: this.notificationType,
      notificationPosition: this.notificationPosition,
      notificationDesc: this.notificationDesc
    });
  }

  ngOnInit(): void {
    const userEmail = this.localStorageService.get('user_email');
    if (userEmail) {
      this.isOpenMode = true;

      console.log('isUpdateMode:', this.productId);
      if (this.productId) {
        this.isUpdateMode = true;

        this.loadImages();
        this.loadNotifications()

        this.productService.getProductByIdAndUser(this.productId).subscribe((product) => {
          this.product = product;
          this.productForm.patchValue({
            name: product.name,
            tel: product.tel,
            email: product.email,
            web: product.web,
            address: product.address,
            cp: product.cp,
            location: product.location,
            desc: product.desc,
            coordinates: product.coordinates,
            typeProduct: product.typeProduct?.name,
            typeTermalCentre: product.typeTermalCentre?.name,
            ageRequirement: product.ageRequirement,
            temperature: product.temperature,
          });

          if (product.typeProduct) {
            this.selectedTypeProduct = product.typeProduct.name;
          }

          console.log('Producto cargado:', product);
  
          this.loadAdditionalData();
        });
      } else {
        this.loadTermalTechniques();
        this.loadTypeWaters();
        this.loadTreatments();
        this.loadServices();
        this.loadAccesibility();
        this.loadComplementaryTechniques();
        this.loadOpeningSeason();
      }
    }
  }

  loadAdditionalData() {
    forkJoin({
      typeWaters: this.filterService.getAllTypeWaters(),
      termalTechniques: this.filterService.getAllTermalTechniques(),
      treatments: this.filterService.getAllTreatments(),
      services: this.filterService.getAllServices(),
      accesibility: this.filterService.getAllAccesibility(),
      complementaryTechniques: this.filterService.getAllComplementaryTechniques(),
      openingSeason: this.featuresService.getAllOpeningSeason(),
    }).subscribe({
      next: ({ typeWaters, termalTechniques, treatments, services, accesibility, complementaryTechniques, openingSeason }) => {
        console.log('Data received:', {
          typeWaters,
          termalTechniques,
          treatments,
          services,
          accesibility,
          complementaryTechniques,
          openingSeason
        });
  
        this.typeWatersList = typeWaters;
        this.termalTechniquesList = termalTechniques;
        this.treatmentsList = treatments;
        this.servicesList = services;
        this.accesibilityList = accesibility;
        this.complementaryTechniquesList = complementaryTechniques;
        this.openingSeasonList = openingSeason;
  
        this.initializeAllSelections();
      },
      error: (error) => {
        console.error('Error al cargar datos adicionales:', error);
      },
    });
  }

  initializeAllSelections() {
    this.initializeTermalTechniques(this.product.termalTechniques?.map((item) => item.name) ?? []);
    this.initializeTypeWaters(this.product.typeWaters?.map((item) => item.name) ?? []);
    this.initializeTreatments(this.product.treatments?.map((item) => item.name) ?? []);
    this.initializeServices(this.product.services?.map((item) => item.name) ?? []);
    this.initializeAccesibility(this.product.accesibility?.map((item) => item.name) ?? []);
    this.initializeComplementaryTechniques(this.product.complementaryTechniques?.map((item) => item.name) ?? []);
    this.initializeOpeningSeason(this.product.openingSeason?.map((item) => item.name) ?? []);
  }

  onTypeProductChange() {
    this.selectedTypeProduct = this.productForm.get('typeProduct')?.value;
  }

  onFilesChange(event: any) {
    const files = event.target.files;

    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        console.log('onFilesChange: ', file)

        if (!this.isValidFileType(file)) {
          console.error('Data type not allowed:', file.type);
          this.fileError = true;
          continue;
        }

        const reader = new FileReader();
        reader.onload = (e: ProgressEvent<FileReader>) => {
          if (e.target && e.target.result) {
            this.filePreviews.push({
              name: file.name,
              url: e.target.result as string
            });
          }
        };
        reader.readAsDataURL(file);

        this.uploadFile(file)
      }
    }
  }

  removePreview(index: number): void {
    if (this.product.images && this.product.images[index]) {

      const onlyPreviewProductImages = this.product.images.filter(image => !image.id);
      const fileName = onlyPreviewProductImages[index].name;
          
      this.featuresService.deletePreview(fileName).subscribe({
        next: (res) => {
          console.log(`Deleted image response: `, res);
          
          this.filePreviews.splice(index, 1);

          if (onlyPreviewProductImages) {
            onlyPreviewProductImages.splice(index, 1);
          }

          if (this.product.images) {
            this.product.images = this.product.images.filter(image => image.name !== fileName);
          }

        },
        error: (error) => {
          console.error('Error to delete image of serve:', error);
        }
      });
    
      
    } 
  }

  removeUploadedImage(index: number): void {
    if (this.imagesList && this.imagesList[index]) {
      const fileName = this.imagesList[index].name;

      if (this.productId) {
        this.featuresService.deleteImage(fileName, this.productId).subscribe({
          next: (res) => {
            console.log(`Deleted image response: `, res);
            console.log(`Deleted image ${fileName} from server.`);
            
            this.imagesList.splice(index, 1);
  
            if (this.product.images) {
              this.product.images = this.product.images.filter(image => image.name !== fileName);
            }

            console.log('imagesList: ', this.imagesList);
            console.log('product.images: ', this.product.images);
          },
          error: (error) => {
            console.error('Error to delete image of serve:', error);
          }
        });
      }
      
    } 
  }
  
  isValidFileType(file: File): boolean {
    const allowedTypes = ['image/webp', 'image/png', 'image/jpg', 'image/jpeg'];
    return allowedTypes.includes(file.type);
  }

  uploadFile(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    console.log('uploadFile formData: ', formData)

    this.featuresService.uploadImage(formData).subscribe({
      next: (res) => {
        console.log('Uploaded image: ', res);

        this.product.images = this.product.images || [];
        this.product.images.push({
          name: res.filename,
          url: res.url
        })

        console.log('uploadFile product images: ', this.product.images)
      },
      error: (error) => {
        console.error('Error uploading image:', error);
        this.fileError = true;
        this.fileSelected = false;
      }
    })
  }

  loadImages(): void {
    const userEmail = this.localStorageService.get('user_email');
    if (userEmail) {

      if (this.productId) {
        this.featuresService.getAllImagesByProduct(this.productId).subscribe({
          next: (images: Image[]) => {
            this.imagesList = images.map(image => {
              return {
                ...image,
                url: `http://localhost:3000${image.url.replace('/public', '')}`
              }
            });
            console.log('Images of product: ', this.imagesList)
          },
          error: (error: HttpErrorResponse) => {
            console.log(error);
          }
        })
      }
    }
  }

  addNotification(): void {
    if (this.notificationType.value 
      && this.notificationPosition.value
      && this.notificationDesc.value
    ) {
      const newNotification: Notification = {
        type: this.notificationType.value,
        position: this.notificationPosition.value,
        desc: this.notificationDesc.value
      }

      this.notifications.push(newNotification);
      console.log('Notifications: ', this.notifications);

      this.notificationType.reset('');
      this.notificationPosition.reset('');
      this.notificationDesc.reset('');
    }
  }

  removeNotification(index: number): void {
    if (this.notifications && this.notifications[index]) {
      const notification = this.notifications[index];
      
      if(this.productId) {
        this.featuresService.deleteNotification(String(notification.id), this.productId).subscribe({
          next: (res) => {
            console.log(`Deleted notification with id ${notification.id}`);
            console.log('Response delete notification: ', res)

            this.notifications.splice(index, 1);
          }
        })
      }
    }
  }

  loadNotifications() {
    const userEmail = this.localStorageService.get('user_email');
    if (userEmail) {
      if (this.productId) {
        this.featuresService.getAllNotificationsByProduct(this.productId).subscribe({
          next: (notifications: Notification[]) => {
            this.notifications = notifications;
            console.log('Notifications: ', this.notifications)
          },
          error: (error: HttpErrorResponse) => {
            console.log(error);
          }
        })
      }
    }
  }

  loadTypeProduct(): void {
    this.filterService.getAllTypeProducts().subscribe({
      next: (typeProducts: TypeProduct[]) => {
        this.typeProductList = typeProducts;
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
      }
    })
  }

  loadTypeTermalCentre(): void {
    this.filterService.getAllTypeTermalCentre().subscribe({
      next: (typeTermalCentre: TypeTermalCentre[]) => {
        this.typeTermalCentreList = typeTermalCentre;
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
      }
    })
  }

  loadTermalTechniques(callback?: () => void): void {
    this.filterService.getAllTermalTechniques().subscribe((termalTechniques: TermalTechnique[]) => {
      this.termalTechniquesList = termalTechniques;
      this.initializeTermalTechniques([]);
      if (callback) {
        callback();
      }
    });
  }

  initializeTermalTechniques(selectedTermalTechniques: string[]): void {
    const termalTechniquesArray = this.productForm.get('termalTechniques') as FormArray;
    termalTechniquesArray.clear();

    this.termalTechniquesList.forEach(termalTechnique => {
      const isSelected = selectedTermalTechniques.includes(termalTechnique.name);
      termalTechniquesArray.push(this.formBuilder.control(isSelected));
    });
  }

  loadTypeWaters(callback?: () => void): void {
    this.filterService.getAllTypeWaters().subscribe((typeWaters: TypeWater[]) => {
      this.typeWatersList = typeWaters;
      this.initializeTypeWaters([]);
      if (callback) {
        callback();
      }
    });
  }

  initializeTypeWaters(selectedTypeWaters: string[]): void {
    const typeWatersArray = this.productForm.get('typeWaters') as FormArray;
    typeWatersArray.clear();

    this.typeWatersList.forEach(typeWater => {
      const isSelected = selectedTypeWaters.includes(typeWater.name);
      typeWatersArray.push(this.formBuilder.control(isSelected));
    });
  }

  loadTreatments(callback?: () => void): void {
    this.filterService.getAllTreatments().subscribe((treatments: Treatment[]) => {
      this.treatmentsList = treatments;
      this.initializeTreatments([]);
      if (callback) {
        callback();
      }
    })
  }

  initializeTreatments(selectedTreatments: string[]): void {
    const treatmentsArray = this.productForm.get('treatments') as FormArray;
    treatmentsArray.clear();

    this.treatmentsList.forEach(treatment => {
      const isSelected = selectedTreatments.includes(treatment.name);
      treatmentsArray.push(this.formBuilder.control(isSelected));
    })
  }

  loadServices(callback?: () => void): void {
    this.filterService.getAllServices().subscribe((services: Service[]) => {
      this.servicesList = services;
      this.initializeServices([]);
      if (callback) {
        callback();
      }
    });
  }

  initializeServices(selectedServices: string[]): void {
    const servicesArray = this.productForm.get('services') as FormArray;
    servicesArray.clear();

    this.servicesList.forEach(service => {
      const isSelected = selectedServices.includes(service.name);
      servicesArray.push(this.formBuilder.control(isSelected));
    });
  }

  loadAccesibility(callback?: () => void): void {
    this.filterService.getAllAccesibility().subscribe((accesibility: Accesibility[]) => {
      this.accesibilityList = accesibility;
      this.initializeAccesibility([]);
      if (callback) {
        callback();
      }
    });
  }

  initializeAccesibility(selectedAccesibility: string[]): void {
    const accesibilityArray = this.productForm.get('accesibility') as FormArray;
    accesibilityArray.clear();

    this.accesibilityList.forEach(accesibility => {
      const isSelected = selectedAccesibility.includes(accesibility.name);
      accesibilityArray.push(this.formBuilder.control(isSelected));
    });
  }

  loadComplementaryTechniques(callback?: () => void): void {
    this.filterService.getAllComplementaryTechniques().subscribe((complementaryTechniques: ComplementaryTechnique[]) => {
      this.complementaryTechniquesList = complementaryTechniques;
      this.initializeComplementaryTechniques([]);
      if (callback) {
        callback();
      }
    });
  }

  initializeComplementaryTechniques(selectedComplementaryTechniques: string[]): void {
    const complementaryTechniquesArray = this.productForm.get('complementaryTechniques') as FormArray;
    complementaryTechniquesArray.clear();

    this.complementaryTechniquesList.forEach(complementaryTechnique => {
      const isSelected = selectedComplementaryTechniques.includes(complementaryTechnique.name);
      complementaryTechniquesArray.push(this.formBuilder.control(isSelected));
    });
  }
  loadOpeningSeason(callback?: () => void): void {
    const userEmail = this.localStorageService.get('user_email');
    if (userEmail) {
      this.featuresService.getAllOpeningSeason().subscribe((openingSeason: OpeningSeason[]) => {
        this.openingSeasonList = openingSeason;
        this.initializeOpeningSeason([]);
        if (callback) {
          callback();
        }
      });
    }
  }

  initializeOpeningSeason(selectedOpeningSeason: string[]): void {
    const openingSeasonArray = this.productForm.get('openingSeason') as FormArray;
    openingSeasonArray.clear();

    this.openingSeasonList.forEach(openingSeason => {
      const isSelected = selectedOpeningSeason.includes(openingSeason.name);
      openingSeasonArray.push(this.formBuilder.control(isSelected));
    });
  }

  saveProduct(): void {
    this.isValidForm = false;

    if (this.productForm.invalid) {
      return;
    }

    this.isValidForm = true;

    if(this.product.images) {
      this.images = this.product.images.filter(image => !image.id);
    }

    const formValue = this.productForm.value;

    const typeProduct = formValue.typeProduct || null;

    const productData: any = {
      name: formValue.name,
      tel: formValue.tel,
      email: formValue.email,
      web: formValue.web,
      address: formValue.address,
      cp: formValue.cp,
      location: formValue.location,
      desc: formValue.desc,
      coordinates: formValue.coordinates,
      typeProduct: typeProduct,
      images: this.images
    };

    if (typeProduct === 'TERMAL_WATER') {
      productData.typeTermalCentre = formValue.typeTermalCentre || null;
      productData.ageRequirement = formValue.ageRequirement || 0;
      productData.temperature = formValue.temperature || 0;

      const selectedTermalTechniques = formValue.termalTechniques
        .map((checked: boolean, index: number) => (checked ? this.termalTechniquesList[index].name : null))
        .filter((value: string | null) => value !== null);
      productData.termalTechniques = selectedTermalTechniques.length ? selectedTermalTechniques : null;

      const selectedTypeWaters = formValue.typeWaters
        .map((checked: boolean, index: number) => (checked ? this.typeWatersList[index].name : null))
        .filter((value: string | null) => value !== null);
      productData.typeWaters = selectedTypeWaters.length ? selectedTypeWaters : null;

      const selectedTreatments = formValue.treatments
          .map((checked: boolean, index: number) => (checked ? this.treatmentsList[index].name : null))
          .filter((value: string | null) => value !== null);
      productData.treatments = selectedTreatments.length ? selectedTreatments : null;

      const selectedServices = formValue.services
        .map((checked: boolean, index: number) => (checked ? this.servicesList[index].name : null))
        .filter((value: string | null) => value !== null);
      productData.services = selectedServices.length ? selectedServices : null;     

      const selectedAccesibility = formValue.accesibility
        .map((checked: boolean, index: number) => (checked ? this.accesibilityList[index].name : null))
        .filter((value: string | null) => value !== null);
      productData.accesibility = selectedAccesibility.length ? selectedAccesibility : null;

      const selectedComplementaryTechniques = formValue.complementaryTechniques
        .map((checked: boolean, index: number) => (checked ? this.complementaryTechniquesList[index].name : null))
        .filter((value: string | null) => value !== null);
      productData.complementaryTechniques = selectedComplementaryTechniques.length ? selectedComplementaryTechniques : null;

      const selectedOpeningSeason = formValue.openingSeason
        .map((checked: boolean, index: number) => (checked ? this.openingSeasonList[index].name : null))
        .filter((value: string | null) => value !== null);
      productData.openingSeason = selectedOpeningSeason.length ? selectedOpeningSeason : null;

      productData.notifications = this.notifications
      .filter(notification => !notification.id)
      .map(notification => ({
        type: notification.type,
        position: notification.position,
        desc: notification.desc
      }))
    }

    console.log('Product before save:', productData);

    if (this.isUpdateMode) {
      this.updateProduct(productData);
    } else {
      this.createProduct(productData);
    }
  }

  createProduct(productData: any): void {
    let responseOK: boolean = false;
    this.errorMessage = null;

    this.productService.createProduct(productData).subscribe({
      next: (createdProduct) => {
        console.log('Producto creado:', createdProduct);
        responseOK = true
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error al crear producto:', error);
        console.log(error.error.message)
        this.errorMessage = error.error.message
      },
      complete: () => {
        if (responseOK) {
          this.isOpenMode = false;
          this.sentComplete.emit(true);
        }
      }
    });
  }

  updateProduct(productData: any): void {
    let responseOK: boolean = false;
    this.errorMessage = null;

    if (this.productId) {

      console.log('productData update: ', productData)
      
      this.productService.updateProduct(this.productId, productData).subscribe({
        next: (updatedProduct) => {
          console.log('Producto actualizado:', updatedProduct);
          responseOK = true
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error al actualizar producto:', error);
          console.log(error.error.message)
          this.errorMessage = error.error.message
        },
        complete: () => {
          if (responseOK) {
            this.isOpenMode = false;
            this.sentComplete.emit(true);
          }
        }
      });
    }
  }

  cancelForm(): void {
    this.formCancelled.emit();
  }

}
