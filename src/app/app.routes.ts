import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';

export const routes: Routes = [
    { 
    path: 'login', 
    component: LoginComponent 
  },
  
  // 2. Default Route (Redirects to Login)
  { 
    path: '', 
    redirectTo: 'login', 
    pathMatch: 'full' 
  },

  // 3. Catch-all for unknown URLs (also redirects to Login for now)
  { 
    path: '**', 
    redirectTo: 'login' 
  }
];
