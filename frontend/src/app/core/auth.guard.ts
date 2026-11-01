import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AppState } from './app-state.service';
export const authGuard=()=>inject(AppState).authenticated()?true:inject(Router).createUrlTree(['/login']);
