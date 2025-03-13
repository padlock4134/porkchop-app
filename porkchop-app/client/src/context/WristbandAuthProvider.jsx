import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

import { isUnauthorizedError, redirectToLogin, redirectToLogout } from "../utils/auth-helpers";

const authProviderClient = axios.create({ withXSRFToken: true, withCredentials: true });

const WristbandAuthContext = createContext({
  authStatus: 'LOADING',
  isAuthenticated: false,
  isLoading: true,
  tenantId: '',
  userId: ''
});

function useWristbandAuth() {
  const context = useContext(WristbandAuthContext);
  if (context === undefined) {
    throw new Error('useWristbandAuth() must be used within a WristbandAuthProvider.');
  }
  return {
    isAuthenticated: context.isAuthenticated,
    isLoading: context.isLoading,
    authStatus: context.authStatus
  };
}

function useWristbandSession() {
  const context = useContext(WristbandAuthContext);
  if (context === undefined) {
    throw new Error('useWristbandSession() must be used within a WristbandAuthProvider.');
  }
  return { tenantId: context.tenantId, userId: context.userId };
}

// "WristbandAuthProvider" should wrap your App component to enable access to the useWristbandAuth() and
// useWristbandSession() hooks everywhere.
function WristbandAuthProvider({
  children,
  disableRedirectOnUnauthenticated = false,
  loginUrl,
  logoutUrl,
  sessionUrl,
}) {
  // React State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState('');
  const [tenantId, setTenantId] = useState('');

  const authStatus = isLoading ? 'LOADING' : (isAuthenticated ? 'AUTHENTICATED' : 'UNAUTHENTICATED');

  // Bootstrap the application with the authenticated user's session data.
  useEffect(() => {
    const fetchSession = async () => {
      try {
        // The session API will let React know if the user has a previously authenticated session.
        // If so, it will initialize session data.
        const response = await authProviderClient.get(sessionUrl, {
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          xsrfCookieName: 'XSRF-TOKEN',
          xsrfHeaderName: 'X-XSRF-TOKEN',
        });
        const { isAuthenticated: respIsAuthenticated, userId, tenantId } = response.data;

        if (!respIsAuthenticated) {
          // Don't call logout here to preserve the current page for when the user returns after re-authentication.
          if (disableRedirectOnUnauthenticated) {
            setIsAuthenticated(false);
            setIsLoading(false);
          } else {
            await redirectToLogin(loginUrl);
          }
        } else {
          setIsAuthenticated(true);
          setIsLoading(false);
          setUserId(userId);
          setTenantId(tenantId);
        }
      } catch (error) {
        console.log(error);
        if (disableRedirectOnUnauthenticated) {
          setIsAuthenticated(false);
          setIsLoading(false);
        } else {
          // Don't call logout on 401 to preserve the current page for when the user returns after re-authentication.
          isUnauthorizedError(error) ? await redirectToLogin(loginUrl) : await redirectToLogout(logoutUrl);
        }
      }
    };

    fetchSession();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <WristbandAuthContext.Provider value={{
      authStatus,
      isAuthenticated,
      isLoading,
      tenantId,
      userId
    }}>
      {children}
    </WristbandAuthContext.Provider>
  );
}

export { WristbandAuthProvider, useWristbandAuth, useWristbandSession };
