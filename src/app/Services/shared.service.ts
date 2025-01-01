import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private appComponent: any;

  constructor() { }

  setAppComponent(appComponent: any): void {
    this.appComponent = appComponent;
  }

  showToast(message: string): void {
    if (this.appComponent) {
      this.appComponent.showToast(message);
    } else {
      console.error('AppComponent not initialised in ToastService.');
    }
  }
}
