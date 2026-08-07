/** Una tarea pendiente del alumno: lección por ver o evaluación por responder. */
export interface PendingTask {
  id: string;
  kind: 'lesson' | 'evaluation';
  title: string;
  courseId: string;
  courseTitle: string;
  /** Minutos estimados — solo en lecciones que lo declaran */
  durationMinutes?: number | null;
  /** Tipo de contenido de la lección ('video', 'quiz', …) */
  contentType?: string;
  done: boolean;
}

/** Resumen de tareas de un alumno, opcionalmente acotado a un curso. */
export interface PendingTasksResult {
  tasks: PendingTask[];
  total: number;
  done: number;
}
