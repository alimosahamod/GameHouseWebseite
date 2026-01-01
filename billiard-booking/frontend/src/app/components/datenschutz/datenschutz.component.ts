import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-datenschutz',
  imports: [],
  templateUrl: './datenschutz.component.html',
  styleUrl: './datenschutz.component.css'
})
export class DatenschutzComponent {
  constructor(private router: Router) {}

  navigateHome() {
    this.router.navigate(['/']);
  }
}
