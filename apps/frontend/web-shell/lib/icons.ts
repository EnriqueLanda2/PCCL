/* ═══════════════════════════════════════════════════════════
   App Icons — registro central de íconos (Iconify, set "solar")
   Un solo lugar para nombrar íconos por su significado en vez
   de repetir strings de Iconify (o emojis) por toda la app.
     import { APP_ICONS } from '@/lib/icons'
     <Icon icon={APP_ICONS.search} />
   ═══════════════════════════════════════════════════════════ */

export const APP_ICONS = {
  /* Navegación / acciones genéricas */
  search:      'solar:magnifer-linear',
  filter:      'solar:tuning-2-linear',
  chevronUp:   'solar:alt-arrow-up-linear',
  chevronDown: 'solar:alt-arrow-down-linear',
  chevronLeft: 'solar:alt-arrow-left-linear',
  close:       'solar:close-circle-linear',
  edit:        'solar:pen-bold',
  trash:       'solar:trash-bin-trash-bold',
  upload:      'solar:upload-bold',
  lock:        'solar:lock-keyhole-bold',
  check:       'solar:check-circle-bold',
  checkFilled: 'solar:check-circle-bold-duotone',
  warning:     'solar:danger-triangle-bold-duotone',
  star:        'solar:star-bold',
  clock:       'solar:clock-circle-bold',
  user:        'solar:user-rounded-bold',
  users:       'solar:users-group-rounded-bold-duotone',
  settings:    'solar:settings-bold-duotone',
  key:         'solar:key-bold-duotone',
  folder:      'solar:folder-bold-duotone',
  clipboard:   'solar:clipboard-list-bold-duotone',
  shield:      'solar:shield-check-bold-duotone',
  liveDot:     'solar:videocamera-record-bold-duotone',

  /* Aprendizaje / cursos */
  book:        'solar:book-2-bold-duotone',
  notebook:    'solar:notebook-bold-duotone',
  document:    'solar:document-text-bold-duotone',
  chart:       'solar:chart-2-bold-duotone',
  trophy:      'solar:cup-star-bold-duotone',
  diploma:     'solar:diploma-bold-duotone',
  diplomaVerified: 'solar:diploma-verified-bold-duotone',
  medal:       'solar:medal-ribbon-star-bold-duotone',
  empty:       'solar:inbox-line-linear',

  /* Tipos de contenido de lección */
  video:       'solar:play-circle-bold-duotone',
  quiz:        'solar:document-text-bold-duotone',
  practice:    'solar:pen-new-square-bold-duotone',
  reading:     'solar:book-bookmark-bold-duotone',
  live:        'solar:videocamera-record-bold-duotone',
  link:        'solar:link-bold-duotone',
  file:        'solar:file-text-bold-duotone',
  task:        'solar:pen-2-bold-duotone',
  exam:        'solar:diploma-bold-duotone',

  /* Chatbot Rumbo */
  chat:        'solar:chat-round-dots-bold-duotone',
  send:        'solar:plain-2-bold',
  newChat:     'solar:add-square-bold',
  robot:       'solar:magic-stick-3-bold-duotone',
  expand:      'solar:full-screen-square-linear',
  pin:         'solar:pin-bold',
} as const;

export type AppIconName = keyof typeof APP_ICONS;

/** Rotación de íconos ilustrados para portadas de curso sin imagen real. */
export const COURSE_COVER_ICONS = [
  'solar:notebook-bold-duotone',
  'solar:code-square-bold-duotone',
  'solar:pen-new-square-bold-duotone',
  'solar:chart-square-bold-duotone',
  'solar:atom-bold-duotone',
  'solar:global-bold-duotone',
] as const;
