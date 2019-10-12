import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  CanLoad,
  Route,
  Router,
  RouterStateSnapshot
} from '@angular/router';
import { Observable } from 'rxjs';
import { tap, take } from 'rxjs/operators';

import { AuthService } from '../core/services/auth.service';
import { LoginRoutingModule } from './login-routing.module';

@Injectable({ providedIn: LoginRoutingModule })
export class AuthGuard implements CanActivate, CanActivateChild, CanLoad {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.checkAuthState(state.url);
  }

  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.checkAuthState(state.url);
  }

  canLoad(route: Route): Observable<boolean> {
    // const url = window.location.pathname;
    const url = route.path;
    return this.checkAuthState(url).pipe(take(1));
  }

  private checkAuthState(url: string): Observable<boolean> {
    return this.authService.isAuthenticated.pipe(
      tap(isLoged => {
        if (!isLoged) {
          this.authService.redirectUrl = url;
          this.router.navigate(['/login']);
        }
      })
    );
  }
}
