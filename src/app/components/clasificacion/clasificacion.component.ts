import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HallazgosService } from '../../services/hallazgos.service';
import { Hallazgo } from '../../models/hallazgo.model';

@Component({
  selector: 'app-clasificacion',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    MatTabsModule,
    MatChipsModule
  ],
  template: `
    <div class="page-header">
      <div class="container" style="margin: 20px;">
        <h1 class="page-title">Clasificación de Hallazgos</h1>
        <p class="page-subtitle">Sistema dual de categorización por tipo y fecha</p>
      </div>
    </div>

    <div class="container" style="margin: 20px;">
      <mat-tab-group>
        <!-- Tab 1: Clasificación por Tipo -->
        <mat-tab label="Clasificación por Tipo">
          <div class="tab-content">
            <mat-card class="filtro-card" appearance="outlined">
              <mat-card-header>
                <mat-icon mat-card-avatar>category</mat-icon>
                <mat-card-title>Filtros por Tipo</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <div class="filtros-grid">
                  <mat-form-field appearance="outline">
                    <mat-label>Tipo de Hallazgo</mat-label>
                    <mat-select [(ngModel)]="filtroTipo" (ngModelChange)="aplicarFiltroTipo()">
                      <mat-option value="">Todos los tipos</mat-option>
                      <mat-option value="Operativo">Operativo</mat-option>
                      <mat-option value="Seguridad">Seguridad</mat-option>
                      <mat-option value="Calidad">Calidad</mat-option>
                      <mat-option value="Documentación">Documentación</mat-option>
                      <mat-option value="No Conformidad Mayor">No Conformidad Mayor</mat-option>
                      <mat-option value="No Conformidad Menor">No Conformidad Menor</mat-option>
                    </mat-select>
                  </mat-form-field>
                </div>
              </mat-card-content>
            </mat-card>

            <!-- Estadísticas por tipo -->
            <div class="stats-container">
              <mat-card class="stat-card" appearance="outlined" *ngFor="let tipo of tiposEstadisticas$ | async">
                <mat-card-content>
                  <div class="stat-header">
                    <mat-icon [style.color]="getTipoColor(tipo.nombre)">{{ getTipoIcon(tipo.nombre) }}</mat-icon>
                    <h3>{{ tipo.nombre }}</h3>
                  </div>
                  <div class="stat-number">{{ tipo.cantidad }}</div>
                  <div class="stat-detail">
                    <div class="detail-item">
                      <span>Abiertos: {{ tipo.abiertos }}</span>
                    </div>
                    <div class="detail-item">
                      <span>En Proceso: {{ tipo.enProceso }}</span>
                    </div>
                    <div class="detail-item">
                      <span>Cerrados: {{ tipo.cerrados }}</span>
                    </div>
                  </div>
                </mat-card-content>
              </mat-card>
            </div>
          </div>
        </mat-tab>

        <!-- Tab 2: Clasificación por Fecha -->
        <mat-tab label="Clasificación por Fecha">
          <div class="tab-content">
            <mat-card class="filtro-card" appearance="outlined">
              <mat-card-header>
                <mat-icon mat-card-avatar>date_range</mat-icon>
                <mat-card-title>Filtros por Fecha</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <div class="filtros-grid">
                  <mat-form-field appearance="outline">
                    <mat-label>Rango Predefinido</mat-label>
                    <mat-select [(ngModel)]="rangoPredefinido" (ngModelChange)="aplicarRangoPredefinido()">
                      <mat-option value="hoy">Hoy</mat-option>
                      <mat-option value="semana">Esta semana</mat-option>
                      <mat-option value="mes">Este mes</mat-option>
                      <mat-option value="trimestre">Este trimestre</mat-option>
                      <mat-option value="año">Este año</mat-option>
                      <mat-option value="personalizado">Personalizado</mat-option>
                    </mat-select>
                  </mat-form-field>

                  <mat-form-field appearance="outline" *ngIf="rangoPredefinido === 'personalizado'">
                    <mat-label>Fecha desde</mat-label>
                    <input matInput [matDatepicker]="fechaDesdePicker" [(ngModel)]="fechaDesde" (ngModelChange)="aplicarFiltroFecha()">
                    <mat-datepicker-toggle matIconSuffix [for]="fechaDesdePicker"></mat-datepicker-toggle>
                    <mat-datepicker #fechaDesdePicker></mat-datepicker>
                  </mat-form-field>

                  <mat-form-field appearance="outline" *ngIf="rangoPredefinido === 'personalizado'">
                    <mat-label>Fecha hasta</mat-label>
                    <input matInput [matDatepicker]="fechaHastaPicker" [(ngModel)]="fechaHasta" (ngModelChange)="aplicarFiltroFecha()">
                    <mat-datepicker-toggle matIconSuffix [for]="fechaHastaPicker"></mat-datepicker-toggle>
                    <mat-datepicker #fechaHastaPicker></mat-datepicker>
                  </mat-form-field>
                </div>
              </mat-card-content>
            </mat-card>

            <!-- Timeline de hallazgos -->
            <mat-card class="timeline-card" appearance="outlined">
              <mat-card-header>
                <mat-icon mat-card-avatar>timeline</mat-icon>
                <mat-card-title>Timeline de Hallazgos</mat-card-title>
                <mat-card-subtitle>{{ (hallazgosFecha$ | async)?.length || 0 }} hallazgos en el período seleccionado</mat-card-subtitle>
              </mat-card-header>
              <mat-card-content>
                <div class="timeline-container">
                  <div class="timeline-item" *ngFor="let hallazgo of hallazgosFecha$ | async">
                    <div class="timeline-dot" [ngClass]="'criticidad-' + hallazgo.criticidad.toLowerCase()"></div>
                    <div class="timeline-content">
                      <div class="timeline-header">
                        <h4>{{ hallazgo.titulo }}</h4>
                        <span class="timeline-date">{{ hallazgo.fechaDeteccion | date:'dd/MM/yyyy' }}</span>
                      </div>
                      <div class="timeline-details">
                        <mat-chip>{{ hallazgo.area }}</mat-chip>
                        <mat-chip>{{ hallazgo.tipo }}</mat-chip>
                        <span class="status-badge status-{{ hallazgo.estado.toLowerCase().replace(' ', '') }}">
                          {{ hallazgo.estado }}
                        </span>
                      </div>
                      <p class="timeline-description">{{ hallazgo.descripcion | slice:0:100 }}...</p>
                    </div>
                  </div>
                </div>
              </mat-card-content>
            </mat-card>
          </div>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [`
    .tab-content {
      padding: 24px 0;
    }

    .filtro-card {
      margin-bottom: 24px;
    }

    .filtros-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 16px;
    }

    .stats-container {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 24px;
      margin-bottom: 24px;
    }

    .stat-card {
      transition: all 0.3s ease;
    }

    .stat-card:hover {
      box-shadow: 0 4px 16px rgba(0,0,0,0.15);
      transform: translateY(-2px);
    }

    .stat-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 16px;
    }

    .stat-header h3 {
      margin: 0;
      font-size: 1.25rem;
      font-weight: 500;
    }

    .stat-number {
      font-size: 2.5rem;
      font-weight: 700;
      color: var(--primary-color);
      margin-bottom: 16px;
    }

    .stat-detail {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .detail-item {
      font-size: 0.875rem;
      color: var(--text-secondary);
    }

    .timeline-card {
      margin-top: 24px;
    }

    .timeline-container {
      max-height: 600px;
      overflow-y: auto;
    }

    .timeline-item {
      display: flex;
      align-items: flex-start;
      gap: 16px;
      margin-bottom: 24px;
      position: relative;
    }

    .timeline-item:not(:last-child)::after {
      content: '';
      position: absolute;
      left: 8px;
      top: 24px;
      width: 2px;
      height: calc(100% + 8px);
      background-color: #E0E0E0;
    }

    .timeline-dot {
      width: 16px;
      height: 16px;
      border-radius: 50%;
      flex-shrink: 0;
      margin-top: 4px;
    }

    .timeline-dot.criticidad-alta {
      background-color: #F44336;
    }

    .timeline-dot.criticidad-media {
      background-color: #FF9800;
    }

    .timeline-dot.criticidad-baja {
      background-color: #4CAF50;
    }

    .timeline-content {
      flex-grow: 1;
      background-color: #F5F5F5;
      padding: 16px;
      border-radius: 8px;
    }

    .timeline-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 12px;
    }

    .timeline-header h4 {
      margin: 0;
      font-size: 1.1rem;
      font-weight: 500;
    }

    .timeline-date {
      font-size: 0.875rem;
      color: var(--text-secondary);
    }

    .timeline-details {
      display: flex;
      gap: 8px;
      align-items: center;
      margin-bottom: 12px;
      flex-wrap: wrap;
    }

    .timeline-description {
      margin: 0;
      font-size: 0.875rem;
      line-height: 1.5;
      color: var(--text-secondary);
    }

    .matriz-card {
      margin-top: 24px;
    }

    .matriz-container {
      overflow-x: auto;
    }

    .matriz-tabla {
      display: grid;
      grid-template-columns: 200px repeat(4, 120px);
      gap: 1px;
      background-color: #E0E0E0;
      border-radius: 8px;
      overflow: hidden;
    }

    .matriz-cell {
      background-color: white;
      padding: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
    }

    .header-cell {
      background-color: var(--primary-color);
      color: white;
      font-weight: 500;
    }

    .tipo-cell {
      background-color: #F5F5F5;
      font-weight: 500;
      justify-content: flex-start;
    }

    .data-cell {
      font-weight: 600;
    }

    .data-cell.total {
      background-color: #E3F2FD;
      color: var(--primary-color);
    }

    @media (max-width: 768px) {
      .stats-container {
        grid-template-columns: 1fr;
      }
      
      .filtros-grid {
        grid-template-columns: 1fr;
      }
      
      .matriz-tabla {
        grid-template-columns: 150px repeat(4, 100px);
      }
    }
  `]
})
export class ClasificacionComponent implements OnInit {
  filtroTipo = '';
  rangoPredefinido = 'mes';
  fechaDesde: Date | null = null;
  fechaHasta: Date | null = null;

  tiposEstadisticas$!: Observable<any[]>;
  hallazgosFecha$!: Observable<Hallazgo[]>;
  tiposUnicos = ['Operativo', 'Seguridad', 'Calidad', 'Documentación', 'No Conformidad Mayor', 'No Conformidad Menor'];

  private hallazgosData: Hallazgo[] = [];

  constructor(private hallazgosService: HallazgosService) {}

  ngOnInit(): void {
    this.aplicarRangoPredefinido();
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.hallazgosService.obtenerTodos().subscribe(hallazgos => {
      this.hallazgosData = hallazgos;
      this.actualizarEstadisticasTipo();
      this.aplicarFiltroFecha();
    });
  }

  aplicarFiltroTipo(): void {
    this.actualizarEstadisticasTipo();
  }

  aplicarRangoPredefinido(): void {
    const hoy = new Date();
    
    switch (this.rangoPredefinido) {
      case 'hoy':
        this.fechaDesde = new Date(hoy);
        this.fechaHasta = new Date(hoy);
        break;
      case 'semana':
        this.fechaDesde = new Date(hoy.getTime() - 7 * 24 * 60 * 60 * 1000);
        this.fechaHasta = new Date(hoy);
        break;
      case 'mes':
        this.fechaDesde = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
        this.fechaHasta = new Date(hoy);
        break;
      case 'trimestre':
        const trimestre = Math.floor(hoy.getMonth() / 3);
        this.fechaDesde = new Date(hoy.getFullYear(), trimestre * 3, 1);
        this.fechaHasta = new Date(hoy);
        break;
      case 'año':
        this.fechaDesde = new Date(hoy.getFullYear(), 0, 1);
        this.fechaHasta = new Date(hoy);
        break;
      default:
        // Personalizado - no cambiar las fechas
        break;
    }
    
    if (this.rangoPredefinido !== 'personalizado') {
      this.aplicarFiltroFecha();
    }
  }

  aplicarFiltroFecha(): void {
    if (!this.hallazgosData.length) return;

    this.hallazgosFecha$ = new Observable(observer => {
      let hallazgosFiltrados = [...this.hallazgosData];

      if (this.fechaDesde) {
        hallazgosFiltrados = hallazgosFiltrados.filter(h => h.fechaDeteccion >= this.fechaDesde!);
      }

      if (this.fechaHasta) {
        hallazgosFiltrados = hallazgosFiltrados.filter(h => h.fechaDeteccion <= this.fechaHasta!);
      }

      // Ordenar por fecha descendente
      hallazgosFiltrados.sort((a, b) => b.fechaDeteccion.getTime() - a.fechaDeteccion.getTime());

      observer.next(hallazgosFiltrados);
      observer.complete();
    });
  }

  private actualizarEstadisticasTipo(): void {
    this.tiposEstadisticas$ = new Observable(observer => {
      let hallazgosFiltrados = [...this.hallazgosData];

      if (this.filtroTipo) {
        hallazgosFiltrados = hallazgosFiltrados.filter(h => h.tipo === this.filtroTipo);
      }

      const estadisticas = this.tiposUnicos.map(tipo => {
        const hallazgosTipo = hallazgosFiltrados.filter(h => h.tipo === tipo);
        return {
          nombre: tipo,
          cantidad: hallazgosTipo.length,
          abiertos: hallazgosTipo.filter(h => h.estado === 'Abierto').length,
          enProceso: hallazgosTipo.filter(h => h.estado === 'En Proceso').length,
          cerrados: hallazgosTipo.filter(h => h.estado === 'Cerrado').length
        };
      }).filter(stat => this.filtroTipo === '' || stat.nombre === this.filtroTipo);

      observer.next(estadisticas);
      observer.complete();
    });
  }

  getTipoColor(tipo: string): string {
    const colores: { [key: string]: string } = {
      'Operativo': '#2196F3',
      'Seguridad': '#F44336',
      'Calidad': '#4CAF50',
      'Documentación': '#FF9800',
      'No Conformidad Mayor': '#9C27B0',
      'No Conformidad Menor': '#607D8B'
    };
    return colores[tipo] || '#666666';
  }

  getTipoIcon(tipo: string): string {
    const iconos: { [key: string]: string } = {
      'Operativo': 'settings',
      'Seguridad': 'security',
      'Calidad': 'verified',
      'Documentación': 'description',
      'No Conformidad Mayor': 'error',
      'No Conformidad Menor': 'warning'
    };
    return iconos[tipo] || 'category';
  }

  getMatrizData(tipo: string, dias: number): number {
    if (!this.hallazgosData.length) return 0;

    const hoy = new Date();
    let hallazgosFiltrados = this.hallazgosData.filter(h => h.tipo === tipo);

    if (dias > 0) {
      const fechaLimite = new Date(hoy.getTime() - dias * 24 * 60 * 60 * 1000);
      hallazgosFiltrados = hallazgosFiltrados.filter(h => h.fechaDeteccion >= fechaLimite);
    }

    return hallazgosFiltrados.length;
  }
}