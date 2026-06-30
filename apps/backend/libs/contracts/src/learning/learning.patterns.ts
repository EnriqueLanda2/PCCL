export const LEARNING_PATTERNS = {
  COURSE_CREATE: 'learning.course.create',
  COURSE_FIND_ALL: 'learning.course.find_all',
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

  CALIFICATION_CREATE: 'learning.calification.create',
  CALIFICATION_FIND_ALL: 'learning.calification.find_all',
  CALIFICATION_FIND_ONE: 'learning.calification.find_one',
  CALIFICATION_UPDATE: 'learning.calification.update',
  CALIFICATION_DELETE: 'learning.calification.delete',

  EVALUATION_CREATE: 'learning.evaluation.create',
  EVALUATION_FIND_ALL: 'learning.evaluation.find_all',
  EVALUATION_FIND_ONE: 'learning.evaluation.find_one',
  EVALUATION_SUBMIT_ATTEMPT: 'learning.evaluation.submit_attempt',

  EVT_INSCRIPTION_COMPLETED: 'learning.inscription.completed',
} as const;
