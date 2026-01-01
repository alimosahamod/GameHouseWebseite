import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-oeffnungszeiten',
  imports: [],
  templateUrl: './oeffnungszeiten.component.html',
  styleUrl: './oeffnungszeiten.component.css'
})
export class OeffnungszeitenComponent {
  constructor(private router: Router) {}

  navigateHome() {
    this.router.navigate(['/']);
  }
}
