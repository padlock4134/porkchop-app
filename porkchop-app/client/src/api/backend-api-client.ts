import axios from "axios";

import { isForbiddenError, isUnauthorizedError, redirectToLogin } from "../utils/auth-helpers";

const backendApiClient = axios.create({
  baseURL: 'http://localhost:6900/api',
  headers: { "Content-Type": "application/json", Accept: "application/json" },
  xsrfCookieName: "XSRF-TOKEN",
  xsrfHeaderName: "X-XSRF-TOKEN",
  withXSRFToken: true,
  withCredentials: true,
});

// Any HTTP 401/403 should trigger the user to go log in again.  This happens when their
// session cookie has expired and/or the CSRF cookie/header are missing in the request.
const unauthorizedAccessInterceptor = async (error: { response: { status: number } }) => {
  if (isUnauthorizedError(error) || isForbiddenError(error)) {
    await redirectToLogin();
  }

  return Promise.reject(error);
};

backendApiClient.interceptors.response.use(undefined, unauthorizedAccessInterceptor);

export { backendApiClient };
