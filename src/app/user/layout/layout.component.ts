import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { DashboardNavigationComponent } from '../../shared/dashboard-navigation/dashboard-navigation.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, DashboardNavigationComponent, TranslateModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {

}
