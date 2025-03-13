import { AxiosError } from 'axios';

export function redirectToLogin(loginUrl = '', returnUrl = '') {
  const location = loginUrl ?? `${window.location.origin}/api/auth/login`;
  if (returnUrl) {
    const queryParams = new URLSearchParams({ return_url: encodeURI(returnUrl) }).toString();
    window.location.href = `${location}?${queryParams}`;
  } else {
    window.location.href = location;
  }
}

export function redirectToLogout(logoutUrl = '') {
  const location = logoutUrl ?? `${window.location.origin}/api/auth/logout`;
  window.location.href = location;
}

// Checks is the response from an API call to your Express server returned a 401/403 status.
export function isUnauthorizedError(error) {
  if (!error) {
    return false;
  }
  if (error instanceof AxiosError) {
    return error.response?.status === 401;
  }
  return false;
}
export function isForbiddenError(error) {
  if (!error) {
    return false;
  }
  if (error instanceof AxiosError) {
    return error.response?.status === 403;
  }
  return false;
}
