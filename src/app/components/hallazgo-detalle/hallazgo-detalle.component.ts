import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { HallazgosService } from '../../services/hallazgos.service';
import { Hallazgo } from '../../models/hallazgo.model';

@Component({
  selector: 'app-hallazgo-detalle',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule,
    MatListModule
  ],
  template: `
    <div class="page-header">
      <div class="container">
        <div class="header-content">
          <button mat-button (click)="volver()" class="back-button">
            <mat-icon>arrow_back</mat-icon>
            Volver
          </button>
          <div>
            <h1 class="page-title">Detalle del Hallazgo</h1>
            <p class="page-subtitle">Información completa del hallazgo #{{ hallazgo?.id }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="container" *ngIf="hallazgo; else loading">
      <div class="detalle-grid">
        <!-- Información Principal -->
        <mat-card class="info-principal">
          <mat-card-header>
            <mat-icon mat-card-avatar>info</mat-icon>
            <mat-card-title>{{ hallazgo.titulo }}</mat-card-title>
            <mat-card-subtitle>
              <span class="status-badge status-{{ hallazgo.estado.toLowerCase().replace(' ', '') }}">
                {{ hallazgo.estado }}
              </span>
            </mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <p class="descripcion">{{ hallazgo.descripcion }}</p>
            
            <div class="metadatos">
              <div class="metadato">
                <strong>Área:</strong>
                <mat-chip>{{ hallazgo.area }}</mat-chip>
              </div>
              <div class="metadato">
                <strong>Criticidad:</strong>
                <span class="status-badge criticidad-{{ hallazgo.criticidad.toLowerCase() }}">
                  {{ hallazgo.criticidad }}
                </span>
              </div>
              <div class="metadato">
                <strong>Responsable:</strong>
                <span>{{ hallazgo.responsable }}</span>
              </div>
              <div class="metadato">
                <strong>Fecha de Detección:</strong>
                <span>{{ hallazgo.fechaDeteccion | date:'dd/MM/yyyy HH:mm' }}</span>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- Acciones -->
        <mat-card class="acciones-card">
          <mat-card-header>
            <mat-icon mat-card-avatar>build</mat-icon>
            <mat-card-title>Acciones</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="acciones-buttons">
              <button mat-raised-button color="primary" (click)="editar()">
                <mat-icon>edit</mat-icon>
                Editar
              </button>
              <button mat-raised-button color="accent" (click)="cambiarEstado()">
                <mat-icon>update</mat-icon>
                Cambiar Estado
              </button>
              <button mat-raised-button color="warn" (click)="eliminar()">
                <mat-icon>delete</mat-icon>
                Eliminar
              </button>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- Información Adicional -->
        <mat-card class="info-adicional">
          <mat-card-header>
            <mat-icon mat-card-avatar>description</mat-icon>
            <mat-card-title>Información Adicional</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <mat-list>
              <mat-list-item>
                <mat-icon matListItemIcon>person</mat-icon>
                <div matListItemTitle>Reportado por</div>
                <div matListItemLine>{{ hallazgo.responsable }}</div>
              </mat-list-item>
              <mat-divider></mat-divider>
              <mat-list-item>
                <mat-icon matListItemIcon>schedule</mat-icon>
                <div matListItemTitle>Última actualización</div>
                <div matListItemLine>{{ hallazgo.fechaDeteccion | date:'dd/MM/yyyy HH:mm' }}</div>
              </mat-list-item>
              <mat-divider></mat-divider>
              <mat-list-item>
                <mat-icon matListItemIcon>category</mat-icon>
                <div matListItemTitle>Categoría</div>
                <div matListItemLine>{{ hallazgo.area }}</div>
              </mat-list-item>
            </mat-list>
          </mat-card-content>
        </mat-card>
      </div>
    </div>

    <ng-template #loading>
      <div class="container">
        <mat-card>
          <mat-card-content>
            <div class="loading">
              <mat-icon>hourglass_empty</mat-icon>
              <p>Cargando detalle del hallazgo...</p>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </ng-template>
  `,
  styles: [`
    .container {
      margin: 20px;
    }

    .page-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 24px 0;
      margin-bottom: 24px;
    }

    .header-content {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .back-button {
      color: white;
      border: 1px solid rgba(255, 255, 255, 0.3);
    }

    .page-title {
      margin: 0;
      font-size: 2rem;
      font-weight: 300;
    }

    .page-subtitle {
      margin: 4px 0 0 0;
      opacity: 0.9;
    }

    .detalle-grid {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 24px;
    }

    .info-principal {
      grid-column: 1 / -1;
    }

    .descripcion {
      font-size: 1.1rem;
      line-height: 1.6;
      color: var(--text-primary);
      margin-bottom: 24px;
    }

    .metadatos {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
    }

    .metadato {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .metadato strong {
      min-width: 100px;
      color: var(--text-secondary);
    }

    .acciones-buttons {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .acciones-buttons button {
      justify-content: flex-start;
      padding: 12px 16px;
    }

    .status-badge {
      padding: 4px 12px;
      border-radius: 16px;
      font-size: 0.875rem;
      font-weight: 500;
      text-transform: uppercase;
    }

    .status-abierto {
      background-color: #ffebee;
      color: #c62828;
    }

    .status-enproceso {
      background-color: #fff3e0;
      color: #ef6c00;
    }

    .status-cerrado {
      background-color: #e8f5e8;
      color: #2e7d32;
    }

    .criticidad-alta {
      background-color: #ffebee;
      color: #c62828;
    }

    .criticidad-media {
      background-color: #fff3e0;
      color: #ef6c00;
    }

    .criticidad-baja {
      background-color: #e8f5e8;
      color: #2e7d32;
    }

    .loading {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
      padding: 48px;
      color: var(--text-secondary);
    }

    .loading mat-icon {
      font-size: 3rem;
      width: 3rem;
      height: 3rem;
    }

    @media (max-width: 768px) {
      .detalle-grid {
        grid-template-columns: 1fr;
      }

      .metadatos {
        grid-template-columns: 1fr;
      }

      .header-content {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
      }
    }
  `]
})
export class HallazgoDetalleComponent implements OnInit {
  hallazgo: Hallazgo | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private hallazgosService: HallazgosService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.hallazgosService.obtenerPorId(id).subscribe(
        hallazgo => {
          this.hallazgo = hallazgo || null;
        },
        error => {
          console.error('Error al cargar el hallazgo:', error);
          // Redirigir a la lista si no se encuentra
          this.router.navigate(['/hallazgos']);
        }
      );
    }
  }

  volver(): void {
    this.router.navigate(['/hallazgos']);
  }

  editar(): void {
    if (this.hallazgo) {
      this.router.navigate(['/editar-hallazgo', this.hallazgo.id]);
    }
  }

  cambiarEstado(): void {
    // Implementar lógica para cambiar estado
    console.log('Cambiar estado del hallazgo:', this.hallazgo?.id);
  }

  eliminar(): void {
    if (this.hallazgo && confirm('¿Está seguro que desea eliminar este hallazgo?')) {
      this.hallazgosService.eliminar(this.hallazgo.id).subscribe(() => {
        this.router.navigate(['/hallazgos']);
      });
    }
  }
} 