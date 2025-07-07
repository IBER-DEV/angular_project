import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { MatTableModule } from "@angular/material/table";
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatChipsModule } from "@angular/material/chips";
import { MatCardModule } from "@angular/material/card";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from "@angular/material/core";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { Observable, BehaviorSubject, combineLatest } from "rxjs";
import { map, startWith } from "rxjs/operators";
import { HallazgosService } from "../../services/hallazgos.service";
import { Hallazgo, FiltroHallazgos } from "../../models/hallazgo.model";
import { HallazgoDialog } from "../../hallazgo-dialog/hallazgo-dialog";

@Component({
  selector: "app-hallazgos-lista",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatCardModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule,
    MatTableModule,
    MatPaginatorModule
],
  template: `
    <div class="page-header">
      <div class="container">
        <h1 class="page-title">Gestión de Hallazgos</h1>
        <p class="page-subtitle">Lista completa con filtros avanzados</p>
      </div>
    </div>

    <div class="container">
      <!-- Panel de filtros -->
      <mat-card class="filtros-card" appearance="outlined">
        <mat-card-header>
          <mat-icon mat-card-avatar>filter_list</mat-icon>
          <mat-card-title>Filtros de Búsqueda</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="filtros-grid">
            <mat-form-field appearance="outline">
              <mat-label>Buscar</mat-label>
              <mat-icon matPrefix>search</mat-icon>
              <input
                matInput
                [(ngModel)]="filtros.texto"
                (ngModelChange)="aplicarFiltros()"
                placeholder="Título, descripción o responsable"
              />
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Área</mat-label>
              <mat-select
                [(ngModel)]="filtros.area"
                (ngModelChange)="aplicarFiltros()"
              >
                <mat-option value="">Todas las áreas</mat-option>
                <mat-option value="Producción">Producción</mat-option>
                <mat-option value="Calidad">Calidad</mat-option>
                <mat-option value="Seguridad">Seguridad</mat-option>
                <mat-option value="Mantenimiento">Mantenimiento</mat-option>
                <mat-option value="Administración">Administración</mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Criticidad</mat-label>
              <mat-select
                [(ngModel)]="filtros.criticidad"
                (ngModelChange)="aplicarFiltros()"
              >
                <mat-option value="">Todas</mat-option>
                <mat-option value="Alta">Alta</mat-option>
                <mat-option value="Media">Media</mat-option>
                <mat-option value="Baja">Baja</mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Estado</mat-label>
              <mat-select
                [(ngModel)]="filtros.estado"
                (ngModelChange)="aplicarFiltros()"
              >
                <mat-option value="">Todos</mat-option>
                <mat-option value="Abierto">Abierto</mat-option>
                <mat-option value="En Proceso">En Proceso</mat-option>
                <mat-option value="Cerrado">Cerrado</mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Fecha desde</mat-label>
              <input
                matInput
                [matDatepicker]="fechaDesdePicker"
                [(ngModel)]="filtros.fechaDesde"
                (ngModelChange)="aplicarFiltros()"
              />
              <mat-datepicker-toggle
                matIconSuffix
                [for]="fechaDesdePicker"
              ></mat-datepicker-toggle>
              <mat-datepicker #fechaDesdePicker></mat-datepicker>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Fecha hasta</mat-label>
              <input
                matInput
                [matDatepicker]="fechaHastaPicker"
                [(ngModel)]="filtros.fechaHasta"
                (ngModelChange)="aplicarFiltros()"
              />
              <mat-datepicker-toggle
                matIconSuffix
                [for]="fechaHastaPicker"
              ></mat-datepicker-toggle>
              <mat-datepicker #fechaHastaPicker></mat-datepicker>
            </mat-form-field>
          </div>

          <div class="filtros-acciones">
            <button mat-button (click)="limpiarFiltros()">
              <mat-icon>clear</mat-icon>
              Limpiar Filtros
            </button>
            <button mat-raised-button color="primary" (click)="nuevoHallazgo()">
              <mat-icon>add</mat-icon>
              Nuevo Hallazgo
            </button>
          </div>
        </mat-card-content>
      </mat-card>

      <!-- Tabla de hallazgos -->
      <mat-card class="tabla-card" appearance="outlined">
        <mat-card-content>
          <div class="tabla-header">
            <h3>
              Resultados ({{ (hallazgosFiltrados$ | async)?.length || 0 }})
            </h3>
          </div>

          <div class="tabla-container">
            <table
              mat-table
              [dataSource]="dataSource"
              class="hallazgos-table"
            >
              <!-- Columna ID -->
              <ng-container matColumnDef="id">
                <th mat-header-cell *matHeaderCellDef>ID</th>
                <td mat-cell *matCellDef="let hallazgo">{{ hallazgo.id }}</td>
              </ng-container>

              <!-- Columna Título -->
              <ng-container matColumnDef="titulo">
                <th mat-header-cell *matHeaderCellDef>Título</th>
                <td mat-cell *matCellDef="let hallazgo">
                  <div class="titulo-cell">
                    <strong>{{ hallazgo.titulo }}</strong>
                    <small
                      >{{ hallazgo.descripcion | slice : 0 : 50
                      }}{{
                        hallazgo.descripcion.length > 50 ? "..." : ""
                      }}</small
                    >
                  </div>
                </td>
              </ng-container>

              <!-- Columna Área -->
              <ng-container matColumnDef="area">
                <th mat-header-cell *matHeaderCellDef>Área</th>
                <td mat-cell *matCellDef="let hallazgo">
                  <mat-chip>{{ hallazgo.area }}</mat-chip>
                </td>
              </ng-container>

              <!-- Columna Criticidad -->
              <ng-container matColumnDef="criticidad">
                <th mat-header-cell *matHeaderCellDef>Criticidad</th>
                <td mat-cell *matCellDef="let hallazgo">
                  <span
                    class="status-badge criticidad-{{
                      hallazgo.criticidad.toLowerCase()
                    }}"
                  >
                    {{ hallazgo.criticidad }}
                  </span>
                </td>
              </ng-container>

              <!-- Columna Estado -->
              <ng-container matColumnDef="estado">
                <th mat-header-cell *matHeaderCellDef>Estado</th>
                <td mat-cell *matCellDef="let hallazgo">
                  <span
                    class="status-badge status-{{
                      hallazgo.estado.toLowerCase().replace(' ', '')
                    }}"
                  >
                    {{ hallazgo.estado }}
                  </span>
                </td>
              </ng-container>

              <!-- Columna Responsable -->
              <ng-container matColumnDef="responsable">
                <th mat-header-cell *matHeaderCellDef>Responsable</th>
                <td mat-cell *matCellDef="let hallazgo">
                  {{ hallazgo.responsable }}
                </td>
              </ng-container>

              <!-- Columna Fecha -->
              <ng-container matColumnDef="fecha">
                <th mat-header-cell *matHeaderCellDef>Fecha Detección</th>
                <td mat-cell *matCellDef="let hallazgo">
                  {{ hallazgo.fechaDeteccion | date : "dd/MM/yyyy" }}
                </td>
              </ng-container>

              <!-- Columna Acciones -->
              <ng-container matColumnDef="acciones">
                <th mat-header-cell *matHeaderCellDef>Acciones</th>
                <td mat-cell *matCellDef="let hallazgo">
                  <div class="acciones-cell">
                    <button
                      mat-icon-button
                      (click)="verDetalle(hallazgo)"
                      title="Ver detalle"
                    >
                      <mat-icon style="color: #4CAF50;">visibility</mat-icon>
                    </button>
                    <button
                      mat-icon-button
                      (click)="editar(hallazgo)"
                      title="Editar"
                    >
                      <mat-icon style="color: #FF9800;">edit</mat-icon>
                    </button>
                    <button
                      mat-icon-button
                      (click)="eliminar(hallazgo)"
                      title="Eliminar"
                      color="warn"
                    >
                      <mat-icon style="color: #F44336;">delete</mat-icon>
                    </button>
                  </div>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="columnasDisplayed"></tr>
              <tr
                mat-row
                *matRowDef="let row; columns: columnasDisplayed"
                class="hallazgo-row"
              ></tr>
            </table>
            <mat-paginator
              [pageSizeOptions]="[5, 10, 20]"
              showFirstLastButtons
              aria-label="Select page of periodic elements"
            >
            </mat-paginator>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [
    `
      .container {
        margin: 20px;
      }
      .filtros-card {
        margin-bottom: 24px;
      }

      .filtros-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 16px;
        margin-bottom: 16px;
      }

      .filtros-acciones {
        display: flex;
        gap: 16px;
        align-items: center;
        justify-content: space-between;
        flex-wrap: wrap;
      }

      .tabla-card {
        min-height: 400px;
      }

      .tabla-header {
        margin-bottom: 16px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .tabla-container {
        overflow-x: auto;
      }

      .hallazgos-table {
        width: 100%;
        min-width: 1000px;
      }

      .titulo-cell {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .titulo-cell strong {
        font-weight: 500;
      }

      .titulo-cell small {
        color: var(--text-secondary);
        font-size: 0.875rem;
      }

      .acciones-cell {
        display: flex;
        gap: 4px;
      }

      .hallazgo-row {
        cursor: pointer;
        transition: background-color 0.2s ease;
      }

      .hallazgo-row:hover {
        background-color: #f5f5f5;
      }

      .mat-mdc-chip {
        font-size: 0.875rem;
      }

      @media (max-width: 768px) {
        .filtros-grid {
          grid-template-columns: 1fr;
        }

        .filtros-acciones {
          flex-direction: column;
          align-items: stretch;
        }
      }
    `,
  ],
})
export class HallazgosListaComponent implements OnInit, AfterViewInit {
  columnasDisplayed: string[] = [
    "titulo",
    "area",
    "criticidad",
    "estado",
    "responsable",
    "fecha",
    "acciones",
  ];


  dataSource = new MatTableDataSource<Hallazgo>([]);
 @ViewChild(MatPaginator) paginator!: MatPaginator;

  


  filtros: FiltroHallazgos = {};
  private filtrosSubject = new BehaviorSubject<FiltroHallazgos>({});

  hallazgosFiltrados$!: Observable<Hallazgo[]>;

  constructor(
    private hallazgosService: HallazgosService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    combineLatest([
      this.hallazgosService.obtenerTodos(),
      this.filtrosSubject.asObservable(),
    ]).pipe(
      map(([hallazgos, filtros]) => this.filtrarHallazgos(hallazgos, filtros))
    ).subscribe(filtered => {
      this.dataSource.data = filtered;
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  aplicarFiltros(): void {
    this.filtrosSubject.next({ ...this.filtros });
  }

  limpiarFiltros(): void {
    this.filtros = {};
    this.filtrosSubject.next({});
  }

  verDetalle(hallazgo: Hallazgo): void {
    this.router.navigate(["/hallazgos", hallazgo.id]);
  }

  nuevoHallazgo(): void {
    this.dialog.open(HallazgoDialog, {
      width: "100vw",
      height: "100vh",
      panelClass: "fullscreen-modal",
      disableClose: true,
      enterAnimationDuration: "300ms",
      exitAnimationDuration: "200ms",
    });
  }

  editar(hallazgo: Hallazgo): void {
    console.log("Editar:", hallazgo);
    // Implementar edición
  }

  eliminar(hallazgo: Hallazgo): void {
    if (confirm("¿Está seguro que desea eliminar este hallazgo?")) {
      this.hallazgosService.eliminar(hallazgo.id).subscribe(() => {
        console.log("Hallazgo eliminado");
      });
    }
  }

  private filtrarHallazgos(
    hallazgos: Hallazgo[],
    filtros: FiltroHallazgos
  ): Hallazgo[] {
    return hallazgos.filter((hallazgo) => {
      if (filtros.texto && !this.contieneTexto(hallazgo, filtros.texto))
        return false;
      if (filtros.area && hallazgo.area !== filtros.area) return false;
      if (filtros.criticidad && hallazgo.criticidad !== filtros.criticidad)
        return false;
      if (filtros.estado && hallazgo.estado !== filtros.estado) return false;
      if (filtros.fechaDesde && hallazgo.fechaDeteccion < filtros.fechaDesde)
        return false;
      if (filtros.fechaHasta && hallazgo.fechaDeteccion > filtros.fechaHasta)
        return false;
      return true;
    });
  }

  private contieneTexto(hallazgo: Hallazgo, texto: string): boolean {
    const textoLower = texto.toLowerCase();
    return (
      hallazgo.titulo.toLowerCase().includes(textoLower) ||
      hallazgo.descripcion.toLowerCase().includes(textoLower) ||
      hallazgo.responsable.toLowerCase().includes(textoLower)
    );
  }
}
