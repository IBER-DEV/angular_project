import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { Observable } from 'rxjs';
import { HallazgosService } from '../../services/hallazgos.service';

@Component({
  selector: 'app-auditoria',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatTableModule],
  template: `
    <div class="page-header">
      <div class="container">
        <h1 class="page-title">Auditoría del Sistema</h1>
        <p class="page-subtitle">Registro completo de actividades y cambios</p>
      </div>
    </div>

    <div class="container">
      <mat-card>
        <mat-card-header>
          <mat-icon mat-card-avatar>history</mat-icon>
          <mat-card-title>Log de Auditoría</mat-card-title>
          <mat-card-subtitle>Últimas actividades del sistema</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <div class="audit-log">
            <div class="log-item" *ngFor="let log of auditLog$ | async">
              <div class="log-timestamp">{{ getTimestamp(log) }}</div>
              <div class="log-message">{{ getMessage(log) }}</div>
            </div>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .audit-log {
      max-height: 600px;
      overflow-y: auto;
    }

    .log-item {
      display: flex;
      gap: 16px;
      padding: 12px;
      border-bottom: 1px solid #E0E0E0;
      transition: background-color 0.2s ease;
    }

    .log-item:hover {
      background-color: #F5F5F5;
    }

    .log-timestamp {
      font-size: 0.875rem;
      color: var(--text-secondary);
      white-space: nowrap;
      min-width: 160px;
    }

    .log-message {
      flex-grow: 1;
      font-size: 0.875rem;
    }

    .log-item:last-child {
      border-bottom: none;
    }
  `]
})
export class AuditoriaComponent implements OnInit {
  auditLog$!: Observable<string[]>;

  constructor(private hallazgosService: HallazgosService) {}

  ngOnInit(): void {
    this.auditLog$ = this.hallazgosService.auditLog$;
  }

  getTimestamp(log: string): string {
    const colonIndex = log.indexOf(':');
    return colonIndex > 0 ? log.substring(0, colonIndex) : '';
  }

  getMessage(log: string): string {
    const colonIndex = log.indexOf(':');
    return colonIndex > 0 ? log.substring(colonIndex + 2) : log;
  }
}