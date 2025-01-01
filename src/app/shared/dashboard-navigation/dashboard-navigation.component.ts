import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-dashboard-navigation',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  templateUrl: './dashboard-navigation.component.html',
  styleUrl: './dashboard-navigation.component.scss'
})
export class DashboardNavigationComponent {
  @Input() links!: Array<{ labelKey: string; route: string }>;
}
