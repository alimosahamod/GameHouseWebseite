import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-galerie',
  imports: [],
  templateUrl: './galerie.component.html',
  styleUrl: './galerie.component.css'
})
export class GalerieComponent {
  constructor(private router: Router) {}

  navigateHome() {
    this.router.navigate(['/']);
  }
}
