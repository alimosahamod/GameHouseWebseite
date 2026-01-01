import { Routes } from '@angular/router';
import { LandingComponent } from './components/landing/landing.component';
import { BookingComponent } from './components/booking/booking.component';
import { AdminLoginComponent } from './components/admin-login/admin-login.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { PreiseComponent } from './components/preise/preise.component';
import { GetraenkekarteComponent } from './components/getraenkekarte/getraenkekarte.component';
import { OeffnungszeitenComponent } from './components/oeffnungszeiten/oeffnungszeiten.component';
import { GalerieComponent } from './components/galerie/galerie.component';
import { ImpressumComponent } from './components/impressum/impressum.component';
import { DatenschutzComponent } from './components/datenschutz/datenschutz.component';
import { AgbComponent } from './components/agb/agb.component';
import { KontaktComponent } from './components/kontakt/kontakt.component';
import { JobsComponent } from './components/jobs/jobs.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'booking', component: BookingComponent },
  { path: 'preise', component: PreiseComponent },
  { path: 'getraenkekarte', component: GetraenkekarteComponent },
  { path: 'oeffnungszeiten', component: OeffnungszeitenComponent },
  { path: 'galerie', component: GalerieComponent },
  { path: 'impressum', component: ImpressumComponent },
  { path: 'datenschutz', component: DatenschutzComponent },
  { path: 'agb', component: AgbComponent },
  { path: 'kontakt', component: KontaktComponent },
  { path: 'jobs', component: JobsComponent },
  { path: 'admin/login', component: AdminLoginComponent },
  { path: 'admin/dashboard', component: AdminDashboardComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '' }
];
