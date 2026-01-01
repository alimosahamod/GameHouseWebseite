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

  constructor(private router: Router) {}

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollPosition = window.scrollY;
    
    // Hero Image: Fade out von 0 bis 600px
    const heroFadeStart = 0;
    const heroFadeEnd = 600;
    let heroOpacity = 1;
    if (scrollPosition > heroFadeStart) {
      heroOpacity = 1 - (scrollPosition - heroFadeStart) / (heroFadeEnd - heroFadeStart);
      heroOpacity = Math.max(0, Math.min(1, heroOpacity));
    }
    this.heroOpacity.set(heroOpacity);

    // Fade-in effect for images
    this.checkImageVisibility();
  }

  private checkImageVisibility() {
    const imageWrappers = document.querySelectorAll('.image-wrapper');
    const windowHeight = window.innerHeight;
    
    imageWrappers.forEach((wrapper) => {
      const rect = wrapper.getBoundingClientRect();
      if (rect.top < windowHeight * 0.8) {
        wrapper.classList.add('fade-in');
      }
    });
  }

  toggleMenu() {
    this.menuOpen.set(!this.menuOpen());
  }

  closeMenu() {
    this.menuOpen.set(false);
  }

  navigateToBooking() {
    this.closeMenu();
    this.router.navigate(['/booking']);
  }

  navigateToPage(page: string) {
    this.closeMenu();
    this.router.navigate([`/${page}`]);
  }
}
