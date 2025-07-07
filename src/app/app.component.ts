import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule, Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { Auth } from './services/auth';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule
  ],
  template: `
    <!-- Mostrar solo el router-outlet para login -->
    <router-outlet *ngIf="isLoginPage()"></router-outlet>
    
    <!-- Mostrar el layout completo para otras páginas -->
    <mat-sidenav-container class="sidenav-container" *ngIf="!isLoginPage()">
      <!-- Sidebar -->
      <mat-sidenav #drawer class="sidenav" fixedInViewport mode="side" [opened]="sidenavOpened">
        <div class="sidenav-header">
          <h2>HallazgosApp</h2>
          <p>Gestión Empresarial</p>
        </div>
        
        <mat-nav-list >
          <mat-list-item routerLink="/dashboard" routerLinkActive="active-link">
            <mat-icon matListItemIcon>dashboard</mat-icon>
            <span matListItemTitle>Dashboard</span>
          </mat-list-item>
          
          <mat-list-item routerLink="/hallazgos" routerLinkActive="active-link">
            <mat-icon matListItemIcon>list_alt</mat-icon>
            <span matListItemTitle>Gestión de Hallazgos</span>
          </mat-list-item>
          
          <!-- <mat-list-item routerLink="/nuevo-hallazgo" routerLinkActive="active-link">
            <mat-icon matListItemIcon>add_circle</mat-icon>
            <span matListItemTitle>Nuevo Hallazgo</span>
          </mat-list-item> -->
          
          <mat-list-item routerLink="/clasificacion" routerLinkActive="active-link">
            <mat-icon matListItemIcon>category</mat-icon>
            <span matListItemTitle>Clasificación</span>
          </mat-list-item>
          
          <mat-list-item routerLink="/analisis-causas" routerLinkActive="active-link">
            <mat-icon matListItemIcon>psychology</mat-icon>
            <span matListItemTitle>Análisis de Causas</span>
          </mat-list-item>
          
          <!-- <mat-list-item routerLink="/actividades" routerLinkActive="active-link">
            <mat-icon matListItemIcon>task_alt</mat-icon>
            <span matListItemTitle>Planes de Acción</span>
          </mat-list-item> -->
          
          <mat-divider></mat-divider>
          
          <!-- <mat-list-item routerLink="/reportes" routerLinkActive="active-link">
            <mat-icon matListItemIcon>analytics</mat-icon>
            <span matListItemTitle>Reportes</span>
          </mat-list-item> -->
          
          <mat-list-item routerLink="/auditoria" routerLinkActive="active-link">
            <mat-icon matListItemIcon>history</mat-icon>
            <span matListItemTitle>Auditoría</span>
          </mat-list-item>
        </mat-nav-list>
      </mat-sidenav>

      <!-- Main content -->
      <mat-sidenav-content>
        <!-- Toolbar -->
        <mat-toolbar color="primary" class="main-toolbar">
          <button mat-icon-button (click)="toggleSidenav()" aria-label="Toggle sidenav">
            <mat-icon>{{ sidenavOpened ? 'menu_open' : 'menu' }}</mat-icon>
          </button>
          
          <span class="toolbar-title">Sistema de Gestión de Hallazgos</span>
          
          <span class="spacer"></span>
          
          <button mat-icon-button [matMenuTriggerFor]="userMenu" aria-label="User menu">
            <mat-icon>account_circle</mat-icon>
          </button>
          <span class="user-info" *ngIf="getCurrentUser()">
            {{ getCurrentUser()?.first_name }} {{ getCurrentUser()?.last_name }}
          </span>
        </mat-toolbar>

        <!-- Router outlet -->
        <main class="main-content">
          <router-outlet></router-outlet>
        </main>
            <mat-menu #userMenu="matMenu">
          <div class="user-menu-header" *ngIf="getCurrentUser()">
            <div class="user-avatar">
              <mat-icon>account_circle</mat-icon>
            </div>
            <div class="user-details">
              <div class="user-name">{{ getCurrentUser()?.first_name }} {{ getCurrentUser()?.last_name }}</div>
              <div class="user-email">{{ getCurrentUser()?.email }}</div>
            </div>
          </div>
          <mat-divider></mat-divider>
          <button mat-menu-item>
            <mat-icon>person</mat-icon>
            <span>Mi Perfil</span>
          </button>
          <button mat-menu-item>
            <mat-icon>settings</mat-icon>
            <span>Configuración</span>
          </button>
          <mat-divider></mat-divider>
          <button mat-menu-item (click)="logout()">
            <mat-icon>logout</mat-icon>
            <span>Cerrar sesión</span>
          </button>
        </mat-menu>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    .sidenav-container {
      height: 100vh;
    }

    .sidenav {
      width: 280px;
      border-right: 1px solid #E0E0E0;
      background-color: #1e1e1e;
      color: var(--text-color);
    }

    .sidenav-header {
      padding: 24px 16px;
      background: linear-gradient(135deg, var(--primary-color), #1565C0);
      color: white;
      text-align: center;
    }

    .sidenav-header h2 {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 500;
    }

    .sidenav-header p {
      margin: 4px 0 0 0;
      font-size: 0.875rem;
      opacity: 0.9;
    }



    .main-toolbar {
      position: sticky;
      top: 0;
      z-index: 100;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  
    }

    .toolbar-title {
      font-size: 1.25rem;
      font-weight: 500;
    }

    .spacer {
      flex: 1 1 auto;
    }

    .user-info {
      margin-left: 8px;
      font-size: 0.875rem;
      opacity: 0.9;
    }

    .user-menu-header {
      padding: 16px;
      display: flex;
      align-items: center;
      gap: 12px;
      background-color: #f5f5f5;
    }

    .user-avatar {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background-color: #e0e0e0;
    }

    .user-avatar mat-icon {
      font-size: 24px;
      color: #666;
    }

    .user-details {
      flex: 1;
    }

    .user-name {
      font-weight: 500;
      color: #333;
      font-size: 0.875rem;
    }

    .user-email {
      color: #666;
      font-size: 0.75rem;
      margin-top: 2px;
    }

    .main-content {
      min-height: calc(100vh - 64px);
      background-color: var(--background-color);
      color: var(--text-color);
    }

    .mat-mdc-list-item.active-link {
      background-color: rgba(25, 118, 210, 0.1);
      color: var(--primary-color);
    }

    .mat-mdc-list-item.active-link .mat-icon {
      color: var(--primary-color);
    }

    .mat-mdc-list-item {
      margin: 4px 8px;
      border-radius: 8px;
      transition: all 0.2s ease;
      color: white !important;
    }

    .mat-mdc-list-item span {
      color: white !important;
    }


    .mat-mdc-list-item:hover {
      background-color: #252E39;
    }


 
    @media (max-width: 768px) {
      .sidenav {
        width: 100%;
      }
      
      .toolbar-title {
        font-size: 1rem;
      }
    }
  `]
})
export class AppComponent {
  private router = inject(Router);
  private auth = inject(Auth);
  
  sidenavOpened = true;

  isLoginPage(): boolean {
    return this.router.url === '/login';
  }

  toggleSidenav(): void {
    this.sidenavOpened = !this.sidenavOpened;
  }
  setTheme(): void {
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
  }

  logout(): void {
    this.auth.logout();
  }

  getCurrentUser(): any {
    return this.auth.getCurrentUser();
  }
}