export interface Hallazgo {
  id: string;
  titulo: string;
  descripcion: string;
  area: string;
  fechaDeteccion: Date;
  criticidad: 'Alta' | 'Media' | 'Baja';
  responsable: string;
  estado: 'Abierto' | 'En Proceso' | 'Cerrado';
  tipo: string;
  evidencias: Evidencia[];
  fechaCreacion: Date;
  fechaActualizacion: Date;
  creadoPor: string;
  requiereDocumentacion?: boolean;
  analisisCausas?: AnalisisCausas;
  planAccion?: PlanAccion;
}

export interface Evidencia {
  id: string;
  nombre: string;
  tipo: 'imagen' | 'documento';
  url: string;
  fechaSubida: Date;
}

export interface AnalisisCausas {
  id: string;
  hallazgoId: string;
  causasIdentificadas: string[];
  metodologia: string;
  conclusiones: string;
  evidencias: string;
  equipoAnalisis: string[];
  fechaAnalisis: Date;
}

export interface PlanAccion {
  id: string;
  hallazgoId: string;
  actividades: Actividad[];
  fechaCreacion: Date;
  responsableGeneral: string;
  estado: 'Pendiente' | 'En Progreso' | 'Completado';
}

export interface Actividad {
  id: string;
  descripcion: string;
  responsable: string;
  fechaInicio: Date;
  fechaFin: Date;
  estado: 'Pendiente' | 'En Progreso' | 'Completada';
  progreso: number;
  comentarios?: string;
}

export interface FiltroHallazgos {
  texto?: string;
  area?: string;
  criticidad?: string;
  estado?: string;
  tipo?: string;
  fechaDesde?: Date;
  fechaHasta?: Date;
}

export interface EstadisticasHallazgos {
  total: number;
  abiertos: number;
  enProceso: number;
  cerrados: number;
  porCriticidad: {
    alta: number;
    media: number;
    baja: number;
  };
  porArea: { [key: string]: number };
}