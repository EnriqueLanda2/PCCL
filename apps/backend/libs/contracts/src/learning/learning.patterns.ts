export const LEARNING_PATTERNS = {
  COURSE_CREATE: 'learning.course.create',
  COURSE_FIND_ALL: 'learning.course.find_all',
  COURSE_FIND_PUBLISHED: 'learning.course.find_published',
  COURSE_FIND_ONE: 'learning.course.find_one',
  COURSE_UPDATE: 'learning.course.update',
  COURSE_DELETE: 'learning.course.delete',
  COURSE_PUBLISH: 'learning.course.publish',

  LESSON_CREATE: 'learning.lesson.create',
  LESSON_FIND_ALL: 'learning.lesson.find_all',
  LESSON_FIND_ONE: 'learning.lesson.find_one',
  LESSON_UPDATE: 'learning.lesson.update',
  LESSON_DELETE: 'learning.lesson.delete',

  INSCRIPTION_CREATE: 'learning.inscription.create',
  INSCRIPTION_FIND_ALL: 'learning.inscription.find_all',
  INSCRIPTION_FIND_ONE: 'learning.inscription.find_one',
  INSCRIPTION_UPDATE: 'learning.inscription.update',
  INSCRIPTION_DELETE: 'learning.inscription.delete',

  PROGRESS_FIND_BY_INSCRIPTION: 'learning.progress.find_by_inscription',
  PROGRESS_FIND_ALL: 'learning.progress.find_all',

  CALIFICATION_CREATE: 'learning.calification.create',
  CALIFICATION_FIND_ALL: 'learning.calification.find_all',
  CALIFICATION_FIND_ONE: 'learning.calification.find_one',
  CALIFICATION_UPDATE: 'learning.calification.update',
  CALIFICATION_DELETE: 'learning.calification.delete',

  NOTE_CREATE: 'learning.note.create',
  NOTE_FIND_BY_LESSON: 'learning.note.find_by_lesson',
  NOTE_UPDATE: 'learning.note.update',
  NOTE_DELETE: 'learning.note.delete',

  EVALUATION_CREATE: 'learning.evaluation.create',
  EVALUATION_FIND_ALL: 'learning.evaluation.find_all',
  EVALUATION_FIND_ONE: 'learning.evaluation.find_one',
  EVALUATION_SUBMIT_ATTEMPT: 'learning.evaluation.submit_attempt',

  EVT_INSCRIPTION_COMPLETED: 'learning.inscription.completed',

  LIVE_SESSION_CREATE: 'learning.live_session.create',
  LIVE_SESSION_FIND_ALL: 'learning.live_session.find_all',
  LIVE_SESSION_FIND_ONE: 'learning.live_session.find_one',
  LIVE_SESSION_UPDATE: 'learning.live_session.update',
  LIVE_SESSION_DELETE: 'learning.live_session.delete',
  LIVE_SESSION_FIND_NEXT_PUBLIC: 'learning.live_session.find_next_public',
} as const;
