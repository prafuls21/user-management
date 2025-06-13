// src/app/core/guards/auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): Observable<boolean | UrlTree> {
    // Simulate auth check
    return of(true).pipe(
      delay(100),
      map(isAuthenticated => isAuthenticated || this.router.createUrlTree(['/login']))
    );
  }
}