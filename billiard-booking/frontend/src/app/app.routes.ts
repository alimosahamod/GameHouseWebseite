import { Routes } from '@angular/router';
import { LandingComponent } from './components/landing/landing.component';
import { EventsComponent } from './components/events/events';
import { PreiseComponent } from './components/preise/preise.component';
import { GetraenkekarteComponent } from './components/getraenkekarte/getraenkekarte.component';
import { OeffnungszeitenComponent } from './components/oeffnungszeiten/oeffnungszeiten.component';
import { GalerieComponent } from './components/galerie/galerie.component';
import { ImpressumComponent } from './components/impressum/impressum.component';
import { DatenschutzComponent } from './components/datenschutz/datenschutz.component';
import { AgbComponent } from './components/agb/agb.component';
import { KontaktComponent } from './components/kontakt/kontakt.component';
import { JobsComponent } from './components/jobs/jobs.component';

export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'events', component: EventsComponent },
  { path: 'preise', component: PreiseComponent },
  { path: 'getraenkekarte', component: GetraenkekarteComponent },
  { path: 'oeffnungszeiten', component: OeffnungszeitenComponent },
  { path: 'galerie', component: GalerieComponent },
  { path: 'impressum', component: ImpressumComponent },
  { path: 'datenschutz', component: DatenschutzComponent },
  { path: 'agb', component: AgbComponent },
  { path: 'kontakt', component: KontaktComponent },
  { path: 'jobs', component: JobsComponent },
  { path: '**', redirectTo: '' }
];
