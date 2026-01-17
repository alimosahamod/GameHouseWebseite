import { Component, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing',
  imports: [CommonModule],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent {
  menuOpen = signal<boolean>(false);
  heroOpacity = signal<number>(1);

  // NEU: Signale für die Parallax-Verschiebung der 3 Spalten
  col1Transform = signal<string>('translateY(0px)');
  col2Transform = signal<string>('translateY(0px)');
  col3Transform = signal<string>('translateY(0px)');

  constructor(private router: Router) {}

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollPosition = window.scrollY;

    // --- Bestehende Hero Logic (unverändert) ---
    const heroFadeStart = 0;
    const heroFadeEnd = 400;
    let heroOpacity = 1;
    if (scrollPosition > heroFadeStart) {
      heroOpacity = 1 - (scrollPosition - heroFadeStart) / (heroFadeEnd - heroFadeStart);
      heroOpacity = Math.max(0, Math.min(1, heroOpacity));
    }
    this.heroOpacity.set(heroOpacity);

    // --- NEU: Collage Parallax Logic ---
    // Spalte 1: Bewegt sich nach oben
    this.col1Transform.set(`translateY(-${scrollPosition * 0.1}px)`);

    // Spalte 2: Bewegt sich nach unten (Gegenbewegung)
    this.col2Transform.set(`translateY(${scrollPosition * 0.1}px)`);

    // Spalte 3: Bewegt sich schneller nach oben
    this.col3Transform.set(`translateY(-${scrollPosition * 0.15}px)`);
  }

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
}
