import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-agb',
  imports: [],
  templateUrl: './agb.component.html',
  styleUrl: './agb.component.css'
})
export class AgbComponent {
  constructor(private router: Router) {}

  navigateHome() {
    this.router.navigate(['/']);
  }
}
