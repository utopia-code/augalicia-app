import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-list-display',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './list-display.component.html',
  styleUrl: './list-display.component.scss'
})
export class ListDisplayComponent {
  @Input() title: string = '';
  @Input() langKey: string = '';
  @Input() items: any[] = [];
}
