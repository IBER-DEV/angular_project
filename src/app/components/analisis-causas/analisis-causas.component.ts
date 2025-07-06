import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { HallazgosService } from '../../services/hallazgos.service';
import { Hallazgo, AnalisisCausas } from '../../models/hallazgo.model';

@Component({
  selector: 'app-analisis-causas',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatChipsModule,
    MatExpansionModule
  ],
  template: `
    <div class="page-header">
      <div class="container" style="margin: 20px;">
        <h1 class="page-title">Análisis de Causas Raíz</h1>
        <p class="page-subtitle">Investigación colaborativa y documentación de causas</p>
      </div>
    </div>

    <div class="container" style="margin: 20px;">
      <!-- Selector de hallazgo -->
      <mat-card class="selector-card" appearance="outlined">
        <mat-card-header>
          <mat-icon mat-card-avatar>search</mat-icon>
          <mat-card-title>Seleccionar Hallazgo para Análisis</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Hallazgo</mat-label>
            <mat-select [(value)]="hallazgoSeleccionado" (selectionChange)="onHallazgoSeleccionado($event.value)">
              <mat-option *ngFor="let hallazgo of hallazgos$ | async" [value]="hallazgo">
                <div class="hallazgo-option">
                  <strong>{{ hallazgo.titulo }}</strong>
                  <span class="status-badge status-{{ hallazgo.estado.toLowerCase().replace(' ', '') }}">
                    {{ hallazgo.estado }}
                  </span>
                </div>
                <small>{{ hallazgo.area }} - {{ hallazgo.fechaDeteccion | date:'dd/MM/yyyy' }}</small>
              </mat-option>
            </mat-select>
          </mat-form-field>
        </mat-card-content>
      </mat-card>

      <!-- Información del hallazgo seleccionado -->
      <mat-card class="info-card" appearance="outlined" *ngIf="hallazgoSeleccionado">
        <mat-card-header>
          <mat-icon mat-card-avatar>info</mat-icon>
          <mat-card-title>Información del Hallazgo</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="info-grid">
            <div class="info-item">
              <strong>Título:</strong>
              <span>{{ hallazgoSeleccionado.titulo }}</span>
            </div>
            <div class="info-item">
              <strong>Descripción:</strong>
              <span>{{ hallazgoSeleccionado.descripcion }}</span>
            </div>
            <div class="info-item">
              <strong>Área:</strong>
              <mat-chip>{{ hallazgoSeleccionado.area }}</mat-chip>
            </div>
            <div class="info-item">
              <strong>Criticidad:</strong>
              <span class="status-badge criticidad-{{ hallazgoSeleccionado.criticidad.toLowerCase() }}">
                {{ hallazgoSeleccionado.criticidad }}
              </span>
            </div>
            <div class="info-item">
              <strong>Responsable:</strong>
              <span>{{ hallazgoSeleccionado.responsable }}</span>
            </div>
            <div class="info-item">
              <strong>Fecha de Detección:</strong>
              <span>{{ hallazgoSeleccionado.fechaDeteccion | date:'dd/MM/yyyy' }}</span>
            </div>
          </div>
        </mat-card-content>
      </mat-card>

      <!-- Formulario de análisis de causas -->
      <mat-card class="analisis-card" appearance="outlined" *ngIf="hallazgoSeleccionado">
        <mat-card-header>
          <mat-icon mat-card-avatar>psychology</mat-icon>
          <mat-card-title>Análisis de Causas</mat-card-title>
          <mat-card-subtitle>Metodología sistemática de investigación</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="analisisForm" (ngSubmit)="guardarAnalisis()">
            
            <!-- Metodología -->
            <mat-expansion-panel class="metodologia-panel">
              <mat-expansion-panel-header>
                <mat-panel-title>
                  <mat-icon>science</mat-icon>
                  Metodología de Análisis
                </mat-panel-title>
              </mat-expansion-panel-header>
              
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Metodología Utilizada</mat-label>
                <mat-select formControlName="metodologia">
                  <mat-option value="5-Porques">5 Porqués</mat-option>
                  <mat-option value="Ishikawa">Diagrama de Ishikawa (Espina de Pescado)</mat-option>
                  <mat-option value="Arbol-Fallas">Árbol de Fallas</mat-option>
                  <mat-option value="Pareto">Análisis de Pareto</mat-option>
                  <mat-option value="FMEA">FMEA (Análisis de Modos de Falla)</mat-option>
                  <mat-option value="RCA">Root Cause Analysis (RCA)</mat-option>
                </mat-select>
              </mat-form-field>
            </mat-expansion-panel>

            <!-- Causas identificadas -->
            <mat-expansion-panel class="causas-panel" [expanded]="true">
              <mat-expansion-panel-header>
                <mat-panel-title>
                  <mat-icon>list</mat-icon>
                  Causas Identificadas
                </mat-panel-title>
              </mat-expansion-panel-header>

              <div formArrayName="causasIdentificadas">
                <div *ngFor="let causa of causas.controls; let i = index" class="causa-item">
                  <mat-form-field appearance="outline" class="causa-field">
                    <mat-label>Causa {{ i + 1 }}</mat-label>
                    <input matInput [formControlName]="i" placeholder="Describe la causa identificada">
                  </mat-form-field>
                  <button mat-icon-button type="button" color="warn" (click)="eliminarCausa(i)" *ngIf="causas.length > 1">
                    <mat-icon>delete</mat-icon>
                  </button>
                </div>
              </div>

              <button mat-button type="button" (click)="agregarCausa()" class="add-causa-btn">
                <mat-icon>add</mat-icon>
                Agregar Causa
              </button>
            </mat-expansion-panel>

            <!-- Evidencias -->
            <mat-expansion-panel class="evidencias-panel">
              <mat-expansion-panel-header>
                <mat-panel-title>
                  <mat-icon>evidence</mat-icon>
                  Evidencias y Documentación
                </mat-panel-title>
              </mat-expansion-panel-header>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Evidencias Recopiladas</mat-label>
                <textarea matInput 
                         formControlName="evidencias" 
                         rows="4" 
                         placeholder="Describe las evidencias encontradas, documentos revisados, entrevistas realizadas, etc.">
                </textarea>
              </mat-form-field>
            </mat-expansion-panel>

            <!-- Equipo de análisis -->
            <mat-expansion-panel class="equipo-panel">
              <mat-expansion-panel-header>
                <mat-panel-title>
                  <mat-icon>group</mat-icon>
                  Equipo de Análisis
                </mat-panel-title>
              </mat-expansion-panel-header>

              <div formArrayName="equipoAnalisis">
                <div *ngFor="let miembro of equipo.controls; let i = index" class="miembro-item">
                  <mat-form-field appearance="outline" class="miembro-field">
                    <mat-label>Miembro {{ i + 1 }}</mat-label>
                    <input matInput [formControlName]="i" placeholder="Nombre y cargo del miembro del equipo">
                  </mat-form-field>
                  <button mat-icon-button type="button" color="warn" (click)="eliminarMiembro(i)" *ngIf="equipo.length > 1">
                    <mat-icon>delete</mat-icon>
                  </button>
                </div>
              </div>

              <button mat-button type="button" (click)="agregarMiembro()" class="add-miembro-btn">
                <mat-icon>add</mat-icon>
                Agregar Miembro
              </button>
            </mat-expansion-panel>

            <!-- Conclusiones -->
            <mat-expansion-panel class="conclusiones-panel">
              <mat-expansion-panel-header>
                <mat-panel-title>
                  <mat-icon>summarize</mat-icon>
                  Conclusiones del Análisis
                </mat-panel-title>
              </mat-expansion-panel-header>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Conclusiones</mat-label>
                <textarea matInput 
                         formControlName="conclusiones" 
                         rows="6" 
                         placeholder="Resume las conclusiones del análisis, causa raíz identificada y recomendaciones">
                </textarea>
                <mat-error *ngIf="analisisForm.get('conclusiones')?.hasError('required')">
                  Las conclusiones son obligatorias
                </mat-error>
              </mat-form-field>
            </mat-expansion-panel>

            <!-- Botones de acción -->
            <div class="form-actions">
              <button mat-button type="button" (click)="limpiarFormulario()">
                <mat-icon>clear</mat-icon>
                Limpiar
              </button>
              <button mat-raised-button 
                      type="submit" 
                      color="primary" 
                      [disabled]="analisisForm.invalid || guardando">
                <mat-icon *ngIf="guardando">hourglass_empty</mat-icon>
                <mat-icon *ngIf="!guardando">save</mat-icon>
                {{ guardando ? 'Guardando...' : 'Guardar Análisis' }}
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>

      <!-- Historial de análisis -->
      <mat-card class="historial-card" appearance="outlined" *ngIf="hallazgoSeleccionado?.analisisCausas">
        <mat-card-header>
          <mat-icon mat-card-avatar>history</mat-icon>
          <mat-card-title>Análisis Existente</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="analisis-existente">
            <div class="detalle-item">
              <strong>Metodología:</strong>
              <span>{{ hallazgoSeleccionado?.analisisCausas?.metodologia }}</span>
            </div>
            
            <div class="detalle-item">
              <strong>Causas Identificadas:</strong>
              <div class="causas-list">
                <mat-chip *ngFor="let causa of hallazgoSeleccionado?.analisisCausas?.causasIdentificadas">
                  {{ causa }}
                </mat-chip>
              </div>
            </div>

            <div class="detalle-item">
              <strong>Equipo de Análisis:</strong>
              <div class="equipo-list">
                <mat-chip *ngFor="let miembro of hallazgoSeleccionado?.analisisCausas?.equipoAnalisis">
                  {{ miembro }}
                </mat-chip>
              </div>
            </div>

            <div class="detalle-item">
              <strong>Conclusiones:</strong>
              <p>{{ hallazgoSeleccionado?.analisisCausas?.conclusiones }}</p>
            </div>

            <div class="detalle-item">
              <strong>Evidencias:</strong>
              <p>{{ hallazgoSeleccionado?.analisisCausas?.evidencias }}</p>
            </div>

            <div class="detalle-item">
              <strong>Fecha de Análisis:</strong>
              <span>{{ hallazgoSeleccionado?.analisisCausas?.fechaAnalisis | date:'dd/MM/yyyy HH:mm' }}</span>
            </div>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .selector-card {
      margin-bottom: 24px;
    }

    .full-width {
      width: 100%;
    }

    .hallazgo-option {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
    }

    .info-card {
      margin-bottom: 24px;
    }

    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 16px;
    }

    .info-item {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .analisis-card {
      margin-bottom: 24px;
    }

    .mat-expansion-panel {
      margin-bottom: 16px;
    }

    .causa-item, .miembro-item {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 12px;
    }

    .causa-field, .miembro-field {
      flex-grow: 1;
    }

    .add-causa-btn, .add-miembro-btn {
      margin-top: 8px;
    }

    .form-actions {
      display: flex;
      gap: 16px;
      justify-content: flex-end;
      margin-top: 32px;
      padding-top: 24px;
      border-top: 1px solid #E0E0E0;
    }

    .historial-card {
  border: 1px solid #ccc; 
  border-radius: 8px; 
  margin-bottom: 20px; 
    }

    .analisis-existente {
      padding: 16px;
      border-radius: 8px;
    }

    .detalle-item {
      margin-bottom: 16px;
    }

    .detalle-item:last-child {
      margin-bottom: 0;
    }

    .causas-list, .equipo-list {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 8px;
    }

    .detalle-item p {
      margin-top: 8px;
      line-height: 1.6;
    }

    .mat-expansion-panel-header-title {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    @media (max-width: 768px) {
      .info-grid {
        grid-template-columns: 1fr;
      }
      
      .causa-item, .miembro-item {
        flex-direction: column;
        align-items: stretch;
      }
      
      .form-actions {
        flex-direction: column;
      }
    }
  `]
})
export class AnalisisCausasComponent implements OnInit {
  hallazgos$!: Observable<Hallazgo[]>;
  hallazgoSeleccionado: Hallazgo | null = null;
  analisisForm!: FormGroup;
  guardando = false;

  constructor(
    private formBuilder: FormBuilder,
    private hallazgosService: HallazgosService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.hallazgos$ = this.hallazgosService.obtenerTodos();
    this.inicializarFormulario();
  }

  private inicializarFormulario(): void {
    this.analisisForm = this.formBuilder.group({
      metodologia: ['', Validators.required],
      causasIdentificadas: this.formBuilder.array([this.formBuilder.control('', Validators.required)]),
      evidencias: ['', Validators.required],
      equipoAnalisis: this.formBuilder.array([this.formBuilder.control('', Validators.required)]),
      conclusiones: ['', [Validators.required, Validators.minLength(50)]]
    });
  }

  get causas() {
    return this.analisisForm.get('causasIdentificadas') as FormArray;
  }

  get equipo() {
    return this.analisisForm.get('equipoAnalisis') as FormArray;
  }

  onHallazgoSeleccionado(hallazgo: Hallazgo): void {
    this.hallazgoSeleccionado = hallazgo;
    
    // Si el hallazgo ya tiene análisis, cargar los datos
    if (hallazgo.analisisCausas) {
      this.cargarAnalisisExistente(hallazgo.analisisCausas);
    } else {
      this.limpiarFormulario();
    }
  }

  private cargarAnalisisExistente(analisis: AnalisisCausas): void {
    // Limpiar arrays existentes
    while (this.causas.length !== 0) {
      this.causas.removeAt(0);
    }
    while (this.equipo.length !== 0) {
      this.equipo.removeAt(0);
    }

    // Cargar causas
    analisis.causasIdentificadas.forEach(causa => {
      this.causas.push(this.formBuilder.control(causa, Validators.required));
    });

    // Cargar equipo
    analisis.equipoAnalisis.forEach(miembro => {
      this.equipo.push(this.formBuilder.control(miembro, Validators.required));
    });

    // Cargar otros campos
    this.analisisForm.patchValue({
      metodologia: analisis.metodologia,
      evidencias: analisis.evidencias,
      conclusiones: analisis.conclusiones
    });
  }

  agregarCausa(): void {
    this.causas.push(this.formBuilder.control('', Validators.required));
  }

  eliminarCausa(index: number): void {
    if (this.causas.length > 1) {
      this.causas.removeAt(index);
    }
  }

  agregarMiembro(): void {
    this.equipo.push(this.formBuilder.control('', Validators.required));
  }

  eliminarMiembro(index: number): void {
    if (this.equipo.length > 1) {
      this.equipo.removeAt(index);
    }
  }

  limpiarFormulario(): void {
    this.analisisForm.reset();
    
    // Reinicializar arrays con un elemento vacío
    while (this.causas.length !== 0) {
      this.causas.removeAt(0);
    }
    while (this.equipo.length !== 0) {
      this.equipo.removeAt(0);
    }
    
    this.causas.push(this.formBuilder.control('', Validators.required));
    this.equipo.push(this.formBuilder.control('', Validators.required));
  }

  guardarAnalisis(): void {
    if (this.analisisForm.valid && this.hallazgoSeleccionado) {
      this.guardando = true;

      const analisisData: AnalisisCausas = {
        id: 'ac' + Date.now().toString(36) + Math.random().toString(36).substr(2),
        hallazgoId: this.hallazgoSeleccionado.id,
        metodologia: this.analisisForm.value.metodologia,
        causasIdentificadas: this.analisisForm.value.causasIdentificadas.filter((c: string) => c.trim() !== ''),
        evidencias: this.analisisForm.value.evidencias,
        equipoAnalisis: this.analisisForm.value.equipoAnalisis.filter((m: string) => m.trim() !== ''),
        conclusiones: this.analisisForm.value.conclusiones,
        fechaAnalisis: new Date()
      };

      // Actualizar el hallazgo con el análisis
      this.hallazgosService.actualizar(this.hallazgoSeleccionado.id, {
        analisisCausas: analisisData,
        estado: 'En Proceso' // Cambiar estado si estaba abierto
      }).subscribe({
        next: (hallazgoActualizado) => {
          this.guardando = false;
          this.hallazgoSeleccionado = hallazgoActualizado;
          this.snackBar.open('Análisis de causas guardado exitosamente', 'Cerrar', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
        },
        error: (error) => {
          this.guardando = false;
          this.snackBar.open('Error al guardar el análisis', 'Cerrar', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
          console.error('Error:', error);
        }
      });
    }
  }
}