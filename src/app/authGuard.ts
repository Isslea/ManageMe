import { CanActivateFn } from '@angular/router';

export const AuthGuard: CanActivateFn = (route, state) => {
  const userLoggedData = localStorage.getItem('userLogged');
  if (userLoggedData) {
    return true;
  } else {
    return false;
  }
};
