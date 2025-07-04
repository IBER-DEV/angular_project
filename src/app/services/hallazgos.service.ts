import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, delay } from 'rxjs/operators';
import { Hallazgo, FiltroHallazgos, EstadisticasHallazgos, AnalisisCausas, PlanAccion } from '../models/hallazgo.model';

@Injectable({
  providedIn: 'root'
})
export class HallazgosService {
  private hallazgosSubject = new BehaviorSubject<Hallazgo[]>(this.generarDatosMuestra());
  hallazgos$ = this.hallazgosSubject.asObservable();

  private auditLogSubject = new BehaviorSubject<string[]>([]);
  auditLog$ = this.auditLogSubject.asObservable();

  constructor() {}

  obtenerTodos(): Observable<Hallazgo[]> {
    return this.hallazgos$;
  }

  obtenerPorId(id: string): Observable<Hallazgo | undefined> {
    return this.hallazgos$.pipe(
      map(hallazgos => hallazgos.find(h => h.id === id))
    );
  }

  filtrar(filtros: FiltroHallazgos): Observable<Hallazgo[]> {
    return this.hallazgos$.pipe(
      map(hallazgos => {
        return hallazgos.filter(hallazgo => {
          if (filtros.texto && !this.contieneTexto(hallazgo, filtros.texto)) return false;
          if (filtros.area && hallazgo.area !== filtros.area) return false;
          if (filtros.criticidad && hallazgo.criticidad !== filtros.criticidad) return false;
          if (filtros.estado && hallazgo.estado !== filtros.estado) return false;
          if (filtros.tipo && hallazgo.tipo !== filtros.tipo) return false;
          if (filtros.fechaDesde && hallazgo.fechaDeteccion < filtros.fechaDesde) return false;
          if (filtros.fechaHasta && hallazgo.fechaDeteccion > filtros.fechaHasta) return false;
          return true;
        });
      })
    );
  }

  crear(hallazgo: Omit<Hallazgo, 'id' | 'fechaCreacion' | 'fechaActualizacion'>): Observable<Hallazgo> {
    const nuevoHallazgo: Hallazgo = {
      ...hallazgo,
      id: this.generarId(),
      fechaCreacion: new Date(),
      fechaActualizacion: new Date()
    };

    const hallazgosActuales = this.hallazgosSubject.value;
    this.hallazgosSubject.next([...hallazgosActuales, nuevoHallazgo]);
    
    this.agregarLog(`Hallazgo creado: ${nuevoHallazgo.titulo} por ${nuevoHallazgo.creadoPor}`);
    
    return of(nuevoHallazgo).pipe(delay(500));
  }

  actualizar(id: string, cambios: Partial<Hallazgo>): Observable<Hallazgo> {
    const hallazgosActuales = this.hallazgosSubject.value;
    const indice = hallazgosActuales.findIndex(h => h.id === id);
    
    if (indice !== -1) {
      const hallazgoActualizado = {
        ...hallazgosActuales[indice],
        ...cambios,
        fechaActualizacion: new Date()
      };
      
      hallazgosActuales[indice] = hallazgoActualizado;
      this.hallazgosSubject.next([...hallazgosActuales]);
      
      this.agregarLog(`Hallazgo actualizado: ${hallazgoActualizado.titulo}`);
      
      return of(hallazgoActualizado).pipe(delay(300));
    }
    
    throw new Error('Hallazgo no encontrado');
  }

  eliminar(id: string): Observable<boolean> {
    const hallazgosActuales = this.hallazgosSubject.value;
    const hallazgoEliminado = hallazgosActuales.find(h => h.id === id);
    
    if (hallazgoEliminado) {
      const nuevosHallazgos = hallazgosActuales.filter(h => h.id !== id);
      this.hallazgosSubject.next(nuevosHallazgos);
      
      this.agregarLog(`Hallazgo eliminado: ${hallazgoEliminado.titulo}`);
      
      return of(true).pipe(delay(300));
    }
    
    return of(false);
  }

  obtenerEstadisticas(): Observable<EstadisticasHallazgos> {
    return this.hallazgos$.pipe(
      map(hallazgos => {
        const stats: EstadisticasHallazgos = {
          total: hallazgos.length,
          abiertos: hallazgos.filter(h => h.estado === 'Abierto').length,
          enProceso: hallazgos.filter(h => h.estado === 'En Proceso').length,
          cerrados: hallazgos.filter(h => h.estado === 'Cerrado').length,
          porCriticidad: {
            alta: hallazgos.filter(h => h.criticidad === 'Alta').length,
            media: hallazgos.filter(h => h.criticidad === 'Media').length,
            baja: hallazgos.filter(h => h.criticidad === 'Baja').length
          },
          porArea: {}
        };

        // Calcular estadísticas por área
        hallazgos.forEach(h => {
          stats.porArea[h.area] = (stats.porArea[h.area] || 0) + 1;
        });

        return stats;
      })
    );
  }

  evaluarRequiereDocumentacion(hallazgo: Partial<Hallazgo>): boolean {
    // Árbol de decisión para determinar si requiere documentación
    if (hallazgo.criticidad === 'Alta') return true;
    if (hallazgo.area === 'Seguridad' || hallazgo.area === 'Calidad') return true;
    if (hallazgo.tipo === 'No Conformidad Mayor') return true;
    return false;
  }

  private contieneTexto(hallazgo: Hallazgo, texto: string): boolean {
    const textoLower = texto.toLowerCase();
    return hallazgo.titulo.toLowerCase().includes(textoLower) ||
           hallazgo.descripcion.toLowerCase().includes(textoLower) ||
           hallazgo.responsable.toLowerCase().includes(textoLower);
  }

  private agregarLog(mensaje: string): void {
    const logsActuales = this.auditLogSubject.value;
    const nuevoLog = `${new Date().toLocaleString()}: ${mensaje}`;
    this.auditLogSubject.next([nuevoLog, ...logsActuales.slice(0, 99)]);
  }

  private generarId(): string {
    return 'h' + Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private generarDatosMuestra(): Hallazgo[] {
    return [
      {
        id: '1',
        titulo: 'Falta de EPP en área de producción',
        descripcion: 'Se observaron operarios trabajando sin equipos de protección personal en la línea de ensamble',
        area: 'Producción',
        fechaDeteccion: new Date('2024-01-15'),
        criticidad: 'Alta',
        responsable: 'Juan Pérez',
        estado: 'Abierto',
        tipo: 'Seguridad',
        evidencias: [],
        fechaCreacion: new Date('2024-01-15'),
        fechaActualizacion: new Date('2024-01-15'),
        creadoPor: 'Inspector de Seguridad',
        requiereDocumentacion: true
      },
      {
        id: '2',
        titulo: 'Proceso de calibración no documentado',
        descripcion: 'El procedimiento de calibración de equipos no está debidamente documentado según ISO 9001',
        area: 'Calidad',
        fechaDeteccion: new Date('2024-01-10'),
        criticidad: 'Media',
        responsable: 'María García',
        estado: 'En Proceso',
        tipo: 'Documentación',
        evidencias: [],
        fechaCreacion: new Date('2024-01-10'),
        fechaActualizacion: new Date('2024-01-12'),
        creadoPor: 'Auditor de Calidad',
        requiereDocumentacion: true
      },
      {
        id: '3',
        titulo: 'Mantenimiento preventivo pendiente',
        descripcion: 'Equipos de la línea 3 requieren mantenimiento preventivo programado',
        area: 'Mantenimiento',
        fechaDeteccion: new Date('2024-01-08'),
        criticidad: 'Baja',
        responsable: 'Carlos López',
        estado: 'Cerrado',
        tipo: 'Operativo',
        evidencias: [],
        fechaCreacion: new Date('2024-01-08'),
        fechaActualizacion: new Date('2024-01-14'),
        creadoPor: 'Supervisor de Mantenimiento',
        requiereDocumentacion: false
      }
    ];
  }
}