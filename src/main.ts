// src/main.ts
import { enableProdMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
//import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';

import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
  ]
}).catch(err => console.error(err));