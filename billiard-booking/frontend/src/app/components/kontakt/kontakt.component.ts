import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-kontakt',
  imports: [],
  templateUrl: './kontakt.component.html',
  styleUrl: './kontakt.component.css'
})
export class KontaktComponent {
  constructor(private router: Router) {}

  navigateHome() {
    this.router.navigate(['/']);
  }
}
