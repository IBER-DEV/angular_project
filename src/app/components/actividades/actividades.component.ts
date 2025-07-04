import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-actividades',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  template: `
    <div class="page-header">
      <div class="container">
        <h1 class="page-title">Planes de Acción</h1>
        <p class="page-subtitle">Gestión de actividades y seguimiento de implementación</p>
      </div>
    </div>

    <div class="container">
      <mat-card>
        <mat-card-header>
          <mat-icon mat-card-avatar>task_alt</mat-icon>
          <mat-card-title>Módulo en Desarrollo</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <p>Este módulo incluirá:</p>
          <ul>
            <li>Creación de planes de acción</li>
            <li>Asignación de actividades y responsables</li>
            <li>Seguimiento de progreso</li>
            <li>Indicadores de implementación</li>
          </ul>
        </mat-card-content>
      </mat-card>
    </div>
  `
})
export class ActividadesComponent {}