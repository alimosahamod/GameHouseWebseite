import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-preise',
  imports: [],
  templateUrl: './preise.component.html',
  styleUrl: './preise.component.css'
})
export class PreiseComponent {
  constructor(private router: Router) {}

  navigateHome() {
    this.router.navigate(['/']);
  }
}
