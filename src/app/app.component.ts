// src/app/app.component.ts
import { Component, effect, inject, signal } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { ThemePalette } from '@angular/material/core';
import { LoadingService } from './core/services/loading.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatProgressSpinnerModule, RouterModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'User Management Dashboard';
  loadingService = inject(LoadingService);
  darkMode = signal(false);
  palette = signal<ThemePalette>('primary');

  constructor() {
    effect(() => {
      document.body.classList.toggle('dark-theme', this.darkMode());
      this.palette.set(this.darkMode() ? 'accent' : 'primary');
    });
  }

  toggleDarkMode() {
    this.darkMode.update(mode => !mode);
  }
}