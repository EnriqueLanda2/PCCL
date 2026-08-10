# Estados de carga en botones de acción — diseño

Fecha: 2026-08-10
Alcance: `apps/frontend/web-shell`

## Problema

Los botones que disparan una acción asíncrona (guardar, eliminar, iniciar
sesión, inscribirse, etc.) no dan feedback consistente mientras esperan
respuesta del backend. Algunos ya lo hacen bien, otros deshabilitan sin
indicar nada visualmente, y otros mezclan un spinner distinto al del resto
de la app.

Este diseño cubre **solo botones de acción**. Skeletons de pantalla completa
quedan fuera, para una pasada posterior.

## Estado actual (investigado)

- `app/components/ui/Button.tsx` ya expone `Button` con prop `loading`:
  deshabilita, pone `aria-busy`, y sustituye el ícono izquierdo por
  `WaveSpinner`. ~40 sitios ya lo usan correctamente.
- `IconButton` en el mismo archivo **no** tiene prop `loading` (asimetría con
  `Button`).
- `app/components/ui/WaveSpinner.tsx` es el spinner oficial de la plataforma
  (usado también como `PageLoader` de página completa).
- Puntos inconsistentes detectados:
  - `app/components/layout/Sidebar.tsx` — botón de logout: `disabled` +
    cambio de texto ("Saliendo…"), sin spinner.
  - `app/components/shared/PendingTasks.tsx` — dos botones usan
    `CircularProgress` de MUI en vez de `WaveSpinner`.
  - `app/components/shared/CheckoutModal.tsx` — mismo caso, `CircularProgress`
    de MUI.
- ~30 archivos contienen botones con handler async (`onClick={async...}`,
  `await api.*`), incluyendo módulos bajo `app/modules/*/page.tsx` y
  componentes compartidos (`CourseComments`, `CreateCourseModal`,
  `CreateLessonModal`, `EnrollableCourses`, `LessonFileViewer`, `NotesPanel`,
  `RouteGuard`, `identity/page.tsx`, `validate/page.tsx`, entre otros). No
  todos están auditados línea por línea todavía — eso es trabajo de la
  implementación (ver plan).
- No hay `@mui/lab` en `package.json` (no hay `LoadingButton` de MUI
  disponible ni se va a agregar).

## Regla de diseño

Todo botón que dispara una acción async:

1. Se deshabilita mientras la acción está en curso.
2. Muestra `WaveSpinner` (tamaño `xs`) como indicador — nunca
   `CircularProgress` de MUI ni otro spinner.
3. Si el botón ya usa el componente compartido `Button`/`IconButton` de
   `app/components/ui/Button.tsx`, se usa su prop `loading` (agregándola a
   `IconButton` si hace falta).
4. Si el botón es MUI crudo o `<button>` plano en un lugar donde migrar al
   componente compartido arriesga romper estilos ya afinados (p. ej. dentro
   de `Popper`/`Paper` de MUI), **no se fuerza la migración de componente** —
   solo se corrige/agrega el estado de carga y se reemplaza el spinner por
   `WaveSpinner`, dejando el botón base como está.

## Cambios concretos conocidos

1. `app/components/ui/Button.tsx`: agregar prop `loading` a `IconButton`,
   mismo comportamiento que `Button` (disable + `aria-busy` + `WaveSpinner`
   reemplazando el ícono).
2. `app/components/layout/Sidebar.tsx`: botón de logout muestra
   `WaveSpinner` en vez del ícono mientras `loggingOut` es `true`.
3. `app/components/shared/PendingTasks.tsx`: los dos `startIcon={... ?
   <CircularProgress .../> : ...}` pasan a `WaveSpinner size="xs"`; se quita
   el import de `CircularProgress` de MUI si queda sin uso.
4. `app/components/shared/CheckoutModal.tsx`: mismo reemplazo de
   `CircularProgress` por `WaveSpinner size="xs"`.

## Trabajo de auditoría (resto de archivos)

Para cada uno de los ~30 archivos con botones de acción async:

- Si el botón ya muestra un indicador de carga consistente (spinner +
  disable), no se toca.
- Si deshabilita pero no muestra spinner, se agrega `WaveSpinner`.
- Si no hace nada (ni disable ni spinner) durante la espera, se agrega
  estado local `loading`/`busy` (patrón ya usado en el código: `useState` +
  `try/finally`) y se aplica la regla de diseño completa.

No se documenta aquí la lista exhaustiva línea por línea: el plan de
implementación reparte los archivos por módulo y cada tarea incluye su
propia verificación.

## Fuera de alcance

- Skeletons/placeholders de pantalla completa al cargar una vista.
- Agregar `@mui/lab` o cualquier librería nueva de spinners.
- Rediseñar la apariencia de los botones más allá del indicador de carga.
- Migrar botones MUI/nativos al componente `Button` compartido salvo que sea
  trivial y de bajo riesgo.

## Verificación

No hay sesión autenticada disponible para probar la app en vivo durante esta
tarea (no se van a introducir credenciales). Verificación por archivo
tocado: `tsc --noEmit` y `eslint` sobre el archivo, más revisión manual del
diff. Si en algún momento hay credenciales de prueba disponibles, se puede
hacer un smoke test visual adicional.
