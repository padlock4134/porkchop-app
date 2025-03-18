// client/src/api/backend-api-client.js
import axios from "axios";

import { isForbiddenError, isUnauthorizedError, redirectToLogin } from "../utils/auth-helpers";

const backendApiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:6900/api',
  headers: { "Content-Type": "application/json", Accept: "application/json" },
  xsrfCookieName: "XSRF-TOKEN",
  xsrfHeaderName: "X-XSRF-TOKEN",
  withXSRFToken: true,
  withCredentials: true,
});

// Any HTTP 401/403 should trigger the user to go log in again.  This happens when their
// session cookie has expired and/or the CSRF cookie/header are missing in the request.
const unauthorizedAccessInterceptor = async (error) => {
  if (isUnauthorizedError(error) || isForbiddenError(error)) {
    await redirectToLogin();
  }

  return Promise.reject(error);
};

backendApiClient.interceptors.response.use(undefined, unauthorizedAccessInterceptor);

// Subscription-related API functions
const subscriptionApi = {
  // Get user's subscription details
  getUserSubscription: async (userId) => {
    try {
      const response = await backendApiClient.get(`/v1/subscription/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching subscription:', error);
      throw error;
    }
  },
  
  // Create or update user's subscription
  updateSubscription: async (userId, planId) => {
    try {
      const response = await backendApiClient.post('/v1/subscription', {
        userId,
        planId
      });
      return response.data;
    } catch (error) {
      console.error('Error updating subscription:', error);
      throw error;
    }
  }
};

export { backendApiClient, subscriptionApi };