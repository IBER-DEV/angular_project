import { Component, OnInit, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatStepperModule } from '@angular/material/stepper';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HallazgosService } from '../../services/hallazgos.service';
import { Inject } from '@angular/core';


@Component({
  selector: 'app-hallazgo-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatStepperModule,
    MatCheckboxModule,
    MatSnackBarModule
  ],
  template: `
    <div class="page-header">
      <div class="container">
        <h1 class="page-title">Nuevo Hallazgo</h1>
        <p class="page-subtitle">Registro detallado de hallazgos y no conformidades</p>
      </div>
    </div>

    <div class="container">
      <mat-card class="form-card">
        <mat-card-content>
          <mat-stepper orientation="vertical" [linear]="true" #stepper>
            <!-- Paso 1: Información básica -->
            <mat-step [stepControl]="informacionBasicaForm" label="Información Básica">
              <form [formGroup]="informacionBasicaForm">
                <div class="form-grid">
                  <mat-form-field appearance="outline">
                    <mat-label>Título del Hallazgo</mat-label>
                    <input matInput formControlName="titulo" placeholder="Descripción breve del hallazgo">
                    <mat-error *ngIf="informacionBasicaForm.get('titulo')?.hasError('required')">
                      El título es obligatorio
                    </mat-error>
                  </mat-form-field>

                  <mat-form-field appearance="outline">
                    <mat-label>Área/Departamento</mat-label>
                    <mat-select formControlName="area">
                      <mat-option value="Producción">Producción</mat-option>
                      <mat-option value="Calidad">Calidad</mat-option>
                      <mat-option value="Seguridad">Seguridad</mat-option>
                      <mat-option value="Mantenimiento">Mantenimiento</mat-option>
                      <mat-option value="Administración">Administración</mat-option>
                      <mat-option value="Recursos Humanos">Recursos Humanos</mat-option>
                    </mat-select>
                  </mat-form-field>

                  <mat-form-field appearance="outline">
                    <mat-label>Tipo de Hallazgo</mat-label>
                    <mat-select formControlName="tipo">
                      <mat-option value="Operativo">Operativo</mat-option>
                      <mat-option value="Seguridad">Seguridad</mat-option>
                      <mat-option value="Calidad">Calidad</mat-option>
                      <mat-option value="Documentación">Documentación</mat-option>
                      <mat-option value="No Conformidad Mayor">No Conformidad Mayor</mat-option>
                      <mat-option value="No Conformidad Menor">No Conformidad Menor</mat-option>
                    </mat-select>
                  </mat-form-field>

                  <mat-form-field appearance="outline">
                    <mat-label>Nivel de Criticidad</mat-label>
                    <mat-select formControlName="criticidad" (selectionChange)="evaluarDocumentacion()">
                      <mat-option value="Alta">Alta</mat-option>
                      <mat-option value="Media">Media</mat-option>
                      <mat-option value="Baja">Baja</mat-option>
                    </mat-select>
                  </mat-form-field>

                  <mat-form-field appearance="outline">
                    <mat-label>Fecha de Detección</mat-label>
                    <input matInput [matDatepicker]="fechaPicker" formControlName="fechaDeteccion">
                    <mat-datepicker-toggle matIconSuffix [for]="fechaPicker"></mat-datepicker-toggle>
                    <mat-datepicker #fechaPicker></mat-datepicker>
                  </mat-form-field>

                  <mat-form-field appearance="outline">
                    <mat-label>Responsable</mat-label>
                    <input matInput formControlName="responsable" placeholder="Persona responsable del área">
                  </mat-form-field>
                </div>

                <mat-form-field appearance="outline" class="descripcion-field">
                  <mat-label>Descripción Detallada</mat-label>
                  <textarea matInput 
                           formControlName="descripcion" 
                           rows="4" 
                           placeholder="Descripción completa del hallazgo, incluyendo contexto y detalles relevantes">
                  </textarea>
                  <mat-error *ngIf="informacionBasicaForm.get('descripcion')?.hasError('required')">
                    La descripción es obligatoria
                  </mat-error>
                </mat-form-field>

                <div class="step-actions">
                  <button mat-raised-button color="primary" matStepperNext [disabled]="informacionBasicaForm.invalid">
                    Siguiente
                  </button>
                </div>
              </form>
            </mat-step>

            <!-- Paso 2: Evaluación y Clasificación -->
            <mat-step [stepControl]="evaluacionForm" label="Evaluación y Clasificación">
              <form [formGroup]="evaluacionForm">
                <!-- Árbol de decisión para documentación -->
                <mat-card class="decision-card">
                  <mat-card-header>
                    <mat-icon mat-card-avatar>decision_tree</mat-icon>
                    <mat-card-title>Evaluación de Documentación</mat-card-title>
                    <mat-card-subtitle>Árbol de decisión automático</mat-card-subtitle>
                  </mat-card-header>
                  <mat-card-content>
                    <div class="decision-info">
                      <p><strong>Criterios de evaluación:</strong></p>
                      <ul>
                        <li>Criticidad Alta: Requiere documentación obligatoria</li>
                        <li>Áreas de Seguridad/Calidad: Documentación requerida</li>
                        <li>No Conformidad Mayor: Documentación obligatoria</li>
                      </ul>
                      
                      <div class="decision-result" [ngClass]="requiereDocumentacion ? 'requiere' : 'no-requiere'">
                        <mat-icon>{{ requiereDocumentacion ? 'check_circle' : 'cancel' }}</mat-icon>
                        <span>
                          {{ requiereDocumentacion ? 'REQUIERE' : 'NO REQUIERE' }} documentación formal
                        </span>
                      </div>
                    </div>
                  </mat-card-content>
                </mat-card>

                <div class="form-grid">
                  <mat-form-field appearance="outline">
                    <mat-label>Estado Inicial</mat-label>
                    <mat-select formControlName="estado">
                      <mat-option value="Abierto">Abierto</mat-option>
                      <mat-option value="En Proceso">En Proceso</mat-option>
                    </mat-select>
                  </mat-form-field>

                  <mat-form-field appearance="outline">
                    <mat-label>Creado por</mat-label>
                    <input matInput formControlName="creadoPor" placeholder="Nombre del inspector/auditor">
                  </mat-form-field>
                </div>

                <div class="step-actions">
                  <button mat-button matStepperPrevious>Anterior</button>
                  <button mat-raised-button color="primary" matStepperNext [disabled]="evaluacionForm.invalid">
                    Siguiente
                  </button>
                </div>
              </form>
            </mat-step>

            <!-- Paso 3: Revisión y Confirmación -->
            <mat-step label="Revisión y Confirmación">
              <div class="revision-content">
                <h3>Resumen del Hallazgo</h3>
                
                <div class="resumen-grid">
                  <div class="resumen-item">
                    <strong>Título:</strong>
                    <span>{{ informacionBasicaForm.get('titulo')?.value }}</span>
                  </div>
                  
                  <div class="resumen-item">
                    <strong>Área:</strong>
                    <span>{{ informacionBasicaForm.get('area')?.value }}</span>
                  </div>
                  
                  <div class="resumen-item">
                    <strong>Tipo:</strong>
                    <span>{{ informacionBasicaForm.get('tipo')?.value }}</span>
                  </div>
                  
                  <div class="resumen-item">
                    <strong>Criticidad:</strong>
                    <span class="status-badge criticidad-{{ informacionBasicaForm.get('criticidad')?.value?.toLowerCase() }}">
                      {{ informacionBasicaForm.get('criticidad')?.value }}
                    </span>
                  </div>
                  
                  <div class="resumen-item">
                    <strong>Responsable:</strong>
                    <span>{{ informacionBasicaForm.get('responsable')?.value }}</span>
                  </div>
                  
                  <div class="resumen-item">
                    <strong>Estado:</strong>
                    <span class="status-badge status-{{ evaluacionForm.get('estado')?.value?.toLowerCase().replace(' ', '') }}">
                      {{ evaluacionForm.get('estado')?.value }}
                    </span>
                  </div>
                </div>

                <div class="resumen-descripcion">
                  <strong>Descripción:</strong>
                  <p>{{ informacionBasicaForm.get('descripcion')?.value }}</p>
                </div>

                <div class="resumen-documentacion">
                  <strong>Documentación:</strong>
                  <span [ngClass]="requiereDocumentacion ? 'text-warning' : 'text-success'">
                    {{ requiereDocumentacion ? 'Requiere documentación formal' : 'No requiere documentación adicional' }}
                  </span>
                </div>

                <div class="step-actions">
                  <button mat-button matStepperPrevious>Anterior</button>
                  <button mat-button color="warn" (click)="cerrarDialogo()">Cerrar</button>
                  <button mat-raised-button 
                          color="primary" 
                          (click)="guardarHallazgo()"
                          [disabled]="guardando">
                    <mat-icon *ngIf="guardando">hourglass_empty</mat-icon>
                    {{ guardando ? 'Guardando...' : 'Crear Hallazgo' }}
                  </button>

                </div>
              </div>
            </mat-step>
          </mat-stepper>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .form-card {
      max-width: 100%;
      margin: 0;
      height: 100%;
      border-radius: 0;
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 16px;
      margin-bottom: 24px;
    }

   
 
    .descripcion-field {
      width: 100%;
      margin-bottom: 24px;
    }

    .step-actions {
      display: flex;
      gap: 16px;
      justify-content: flex-end;
      margin-top: 24px;
    }

    .decision-card {
      margin-bottom: 24px;
      border-left: 4px solid var(--primary-color);
    }

    .decision-info ul {
      margin: 16px 0;
      padding-left: 20px;
    }

    .decision-result {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px;
      border-radius: 8px;
      font-weight: 500;
      margin-top: 16px;
    }

    .decision-result.requiere {
      background-color: #FFF3E0;
      color: #F57C00;
    }

    .decision-result.no-requiere {
      background-color: #E8F5E8;
      color: #2E7D32;
    }

    .revision-content {
      padding: 16px 0;
    }

    .resumen-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 16px;
      margin: 24px 0;
    }

    .resumen-item {
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding: 16px;
      background-color: #F5F5F5;
      border-radius: 8px;
    }

    .resumen-descripcion {
      margin: 24px 0;
      padding: 16px;
      background-color: #F5F5F5;
      border-radius: 8px;
    }

    .resumen-descripcion p {
      margin-top: 8px;
      line-height: 1.6;
    }

    .resumen-documentacion {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin: 24px 0;
      padding: 16px;
      background-color: #F5F5F5;
      border-radius: 8px;
    }

    .text-warning { color: #F57C00; }
    .text-success { color: #2E7D32; }

    /* Estilos para pantalla completa */
    :host {
      display: block;
      height: 100%;
    }

    .container {
      height: 100%;
      padding: 0;
    }

    .page-header {
      display: none; /* Ocultar header en diálogo */
    }

    @media (max-width: 768px) {
      .form-grid {
        grid-template-columns: 1fr;
      }
      
      .resumen-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class HallazgoFormComponent implements OnInit {
  informacionBasicaForm!: FormGroup;
  evaluacionForm!: FormGroup;
  
  requiereDocumentacion = false;
  guardando = false;

  constructor(
    private formBuilder: FormBuilder,
    private hallazgosService: HallazgosService,
    private snackBar: MatSnackBar,
   @Optional() public dialogRef: MatDialogRef<HallazgoFormComponent>,
   @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.inicializarFormularios();
  }

  private inicializarFormularios(): void {
    this.informacionBasicaForm = this.formBuilder.group({
      titulo: ['', [Validators.required, Validators.minLength(5)]],
      descripcion: ['', [Validators.required, Validators.minLength(20)]],
      area: ['', Validators.required],
      tipo: ['', Validators.required],
      criticidad: ['', Validators.required],
      fechaDeteccion: [new Date(), Validators.required],
      responsable: ['', Validators.required]
    });

    this.evaluacionForm = this.formBuilder.group({
      estado: ['Abierto', Validators.required],
      creadoPor: ['', Validators.required]
    });
  }

  cerrarDialogo() {
  this.dialogRef.close();
}


  evaluarDocumentacion(): void {
    const formValues = this.informacionBasicaForm.value;
    this.requiereDocumentacion = this.hallazgosService.evaluarRequiereDocumentacion(formValues);
  }

  guardarHallazgo(): void {
    if (this.informacionBasicaForm.valid && this.evaluacionForm.valid) {
      this.guardando = true;
      
      const hallazgoData = {
        ...this.informacionBasicaForm.value,
        ...this.evaluacionForm.value,
        requiereDocumentacion: this.requiereDocumentacion,
        evidencias: []
      };

      this.hallazgosService.crear(hallazgoData).subscribe({
        next: (hallazgo) => {
          this.guardando = false;
          this.snackBar.open('Hallazgo creado exitosamente', 'Cerrar', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.resetearFormularios();
          if (this.dialogRef){ this.dialogRef.close(hallazgo);} // Cerrar el diálogo y pasar el hallazgo creado
        },
        error: (error) => {
          this.guardando = false;
          this.snackBar.open('Error al crear el hallazgo', 'Cerrar', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
          console.error('Error:', error);
        }
      });
    }
  }

  private resetearFormularios(): void {
    this.informacionBasicaForm.reset();
    this.evaluacionForm.reset();
    this.requiereDocumentacion = false;
  }
}
