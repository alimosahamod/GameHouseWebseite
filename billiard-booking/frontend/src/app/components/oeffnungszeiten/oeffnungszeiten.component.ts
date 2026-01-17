import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-oeffnungszeiten',
  imports: [CommonModule],
  templateUrl: './oeffnungszeiten.component.html',
  styleUrl: './oeffnungszeiten.component.css'
})
export class OeffnungszeitenComponent {
  menuOpen = signal<boolean>(false);

  constructor(private router: Router) {}

  toggleMenu() {
    this.menuOpen.set(!this.menuOpen());
  }

  closeMenu() {
    this.menuOpen.set(false);
  }

  navigateToPage(page: string) {
    this.closeMenu();
    this.router.navigate([`/${page}`]);
  }

  navigateHome() {
    this.closeMenu();
    this.router.navigate(['/']);
  }
}
