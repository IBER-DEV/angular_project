import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatGridListModule } from "@angular/material/grid-list";
import { Observable } from "rxjs";
import { HallazgosService } from "../../services/hallazgos.service";
import { EstadisticasHallazgos } from "../../models/hallazgo.model";
import { HallazgoFormComponent } from '../../components/hallazgo-form/hallazgo-form.component';
import { MatDialog, MatDialogModule } from "@angular/material/dialog";

@Component({
  selector: "app-dashboard",
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatGridListModule,
    MatDialogModule,
  ],
  template: `
    <div class="page-header">
      <div class="container">
        <h1 class="page-title">Dashboard de Hallazgos</h1>
        <p class="page-subtitle">Resumen ejecutivo y métricas clave</p>
      </div>
    </div>

    <div class="container ">
      <div class="card-container kpi-cards-container" *ngIf="estadisticas$ | async as stats">
        <!-- Tarjetas de estadísticas principales -->
        <mat-card class="stats-card">
          <mat-card-header>
            <mat-icon mat-card-avatar>assessment</mat-icon>
            <mat-card-title>Total de Hallazgos</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="stat-number">{{ stats.total }}</div>
            <div class="stat-label">Registros totales</div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stats-card">
          <mat-card-header>
            <mat-icon mat-card-avatar style="color: #F44336;">error</mat-icon>
            <mat-card-title>Abiertos</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="stat-number text-error">{{ stats.abiertos }}</div>
            <div class="stat-label">Requieren atención</div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stats-card">
          <mat-card-header>
            <mat-icon mat-card-avatar style="color: #FF9800;"
              >schedule</mat-icon
            >
            <mat-card-title>En Proceso</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="stat-number text-warning">{{ stats.enProceso }}</div>
            <div class="stat-label">En gestión</div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stats-card">
          <mat-card-header>
            <mat-icon mat-card-avatar style="color: #4CAF50;"
              >check_circle</mat-icon
            >
            <mat-card-title>Cerrados</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="stat-number text-success">{{ stats.cerrados }}</div>
            <div class="stat-label">Completados</div>
          </mat-card-content>
        </mat-card>

        <!-- Tarjeta de criticidad -->
        <mat-card class="stats-card criticidad-card">
          <mat-card-header>
            <mat-icon mat-card-avatar>priority_high</mat-icon>
            <mat-card-title>Por Criticidad</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="criticidad-item">
              <span class="criticidad-label alta">Alta:</span>
              <span class="criticidad-value">{{
                stats.porCriticidad.alta
              }}</span>
            </div>
            <div class="criticidad-item">
              <span class="criticidad-label media">Media:</span>
              <span class="criticidad-value">{{
                stats.porCriticidad.media
              }}</span>
            </div>
            <div class="criticidad-item">
              <span class="criticidad-label baja">Baja:</span>
              <span class="criticidad-value">{{
                stats.porCriticidad.baja
              }}</span>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- Tarjeta de distribución por área -->
        <mat-card class="stats-card area-card">
          <mat-card-header>
            <mat-icon mat-card-avatar>business</mat-icon>
            <mat-card-title>Por Área</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="area-list">
              <div
                class="area-item"
                *ngFor="let area of getAreas(stats.porArea)"
              >
                <span class="area-name">{{ area.nombre }}:</span>
                <span class="area-count">{{ area.cantidad }}</span>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <!-- Sección de acciones rápidas -->
      <mat-card class="actions-card">
        <mat-card-header>
          <mat-icon mat-card-avatar>flash_on</mat-icon>
          <mat-card-title>Acciones Rápidas</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="actions-grid">
            <button mat-raised-button color="primary" class="action-btn" (click)="abrirFormulario()">
              <mat-icon>add</mat-icon>
              Nuevo Hallazgo
            </button>
            <button mat-raised-button color="accent" class="action-btn">
              <mat-icon>search</mat-icon>
              Buscar Hallazgos
            </button>
            <button mat-raised-button class="action-btn">
              <mat-icon>analytics</mat-icon>
              Generar Reporte
            </button>
            <button mat-raised-button class="action-btn">
              <mat-icon>settings</mat-icon>
              Configuración
            </button>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [
    `
      .stat-number {
        font-size: 2.5rem;
        font-weight: 700;
        margin: 16px 0 8px 0;
        color: var(--primary-color);
      }

      .stat-label {
        color: var(--text-secondary);
        font-size: 0.875rem;
      }
      .kpi-cards-container{
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 24px;
      margin-bottom: 24px;
      }
      .stats-card {
        transition: all 0.3s ease;
      }

      .text-error {
        color: #f44336;
      }
      .text-warning {
        color: #ff9800;
      }
      .text-success {
        color: #4caf50;
      }

      .criticidad-card .mat-card-content {
        padding-top: 16px;
      }

      .criticidad-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;
      }

      .criticidad-label {
        font-weight: 500;
        padding: 4px 8px;
        border-radius: 12px;
        font-size: 0.875rem;
      }

      .criticidad-label.alta {
        background-color: #ffebee;
        color: #c62828;
      }

      .criticidad-label.media {
        background-color: #fff3e0;
        color: #f57c00;
      }

      .criticidad-label.baja {
        background-color: #e8f5e8;
        color: #2e7d32;
      }

      .criticidad-value {
        font-weight: 600;
        font-size: 1.25rem;
      }

      .area-list {
        max-height: 200px;
        overflow-y: auto;
      }

      .area-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 0;
        border-bottom: 1px solid #e0e0e0;
      }

      .area-item:last-child {
        border-bottom: none;
      }

      .area-name {
        font-weight: 500;
      }

      .area-count {
        font-weight: 600;
        color: var(--primary-color);
      }

      .actions-card {
        margin-top: 32px;
      }

      .actions-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 16px;
        margin-top: 16px;
      }

      .action-btn {
        height: 48px;
      }

      @media (max-width: 768px) {
        .actions-grid {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class DashboardComponent implements OnInit {
  estadisticas$!: Observable<EstadisticasHallazgos>;



  constructor(private hallazgosService: HallazgosService, private dialog: MatDialog) {}

  abrirFormulario(): void {
    this.dialog.open(HallazgoFormComponent, {
      width: '800px',
      maxWidth: '95vw',
      autoFocus: true,
      disableClose: false,
    });
  }

  ngOnInit(): void {
    this.estadisticas$ = this.hallazgosService.obtenerEstadisticas();
  }

  getAreas(porArea: {
    [key: string]: number;
  }): { nombre: string; cantidad: number }[] {
    return Object.entries(porArea).map(([nombre, cantidad]) => ({
      nombre,
      cantidad,
    }));
  }
}
