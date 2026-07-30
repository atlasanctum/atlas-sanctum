import * as Sentry from "@sentry/react";
import React from "react";
import { useLocation } from "react-router-dom";
import AuthFallback from "./AuthFallback";

interface Props {
  children: React.ReactNode;
}

/**
 * Route-scoped error boundary. Tags Sentry events with the current route +
 * the latest auth provider state captured in errorReporting, then renders
 * AuthFallback so users never see a blank screen.
 */
export const RouteErrorBoundary: React.FC<Props> = ({ children }) => {
  const { pathname } = useLocation();
  return (
    <Sentry.ErrorBoundary
      key={pathname}
      fallback={<AuthFallback />}
      beforeCapture={(scope) => {
        scope.setTag("route", pathname);
        scope.setContext("route", { pathname });
      }}
    >
      {children}
    </Sentry.ErrorBoundary>
  );
};

export default RouteErrorBoundary;