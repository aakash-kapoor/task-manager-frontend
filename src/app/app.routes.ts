import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { DashboardComponent } from './features/dashboard/dashboard';
import { BoardDetailComponent } from './features/board-detail/board-detail';
import { Profile } from './features/profile/profile';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'board/:id', component: BoardDetailComponent },
    { path: 'profile', component: Profile },

    // 2. Default Route (Redirects to Login)
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    // 3. Catch-all for unknown URLs (also redirects to Login for now)
    { path: '**', redirectTo: 'login' }
];
