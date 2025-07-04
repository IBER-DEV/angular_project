import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  template: `
    <div class="page-header">
      <div class="container">
        <h1 class="page-title">Reportes y Analytics</h1>
        <p class="page-subtitle">Generación de reportes ejecutivos y análisis de datos</p>
      </div>
    </div>

    <div class="container">
      <mat-card>
        <mat-card-header>
          <mat-icon mat-card-avatar>analytics</mat-icon>
          <mat-card-title>Módulo en Desarrollo</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <p>Este módulo incluirá:</p>
          <ul>
            <li>Reportes ejecutivos personalizables</li>
            <li>Gráficos y visualizaciones avanzadas</li>
            <li>Exportación en múltiples formatos</li>
            <li>Análisis de tendencias y KPIs</li>
          </ul>
        </mat-card-content>
      </mat-card>
    </div>
  `
})
export class ReportesComponent {}