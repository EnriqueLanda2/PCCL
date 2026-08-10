/* Login y registro comparten pantalla: este re-export existe solo para que
   /identity/register siga teniendo URL propia. El modo inicial lo deduce
   AuthPage del pathname. */
export { default } from '../auth/page';
