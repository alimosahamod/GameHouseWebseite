import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-getraenkekarte',
  imports: [],
  templateUrl: './getraenkekarte.component.html',
  styleUrl: './getraenkekarte.component.css'
})
export class GetraenkekarteComponent {
  constructor(private router: Router) {}

  navigateHome() {
    this.router.navigate(['/']);
  }
}
