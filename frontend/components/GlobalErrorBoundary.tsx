"use client";

import { Component, type ReactNode, type ErrorInfo } from "react";

interface GlobalErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

interface GlobalErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export class GlobalErrorBoundary extends Component<GlobalErrorBoundaryProps, GlobalErrorBoundaryState> {
  constructor(props: GlobalErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): Partial<GlobalErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });
    
    console.error("Global Error Boundary caught an error:", error, errorInfo);
    
    if (typeof window !== "undefined" && process.env.NODE_ENV === "production") {
      const Sentry = (window as any).__SENTRY__;
      if (Sentry?.captureException) {
        Sentry.captureException(error, { contexts: { react: { componentStack: errorInfo.componentStack } } });
      }
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div style={styles.container}>
          <div style={styles.content}>
            <div style={styles.icon}>⚠️</div>
            <h1 style={styles.title}>Something went wrong</h1>
            <p style={styles.message}>
              An unexpected error occurred. The error has been reported to our team.
            </p>
            {process.env.NODE_ENV === "development" && this.state.error && (
              <details style={styles.details}>
                <summary style={styles.summary}>Error Details (Development Only)</summary>
                <pre style={styles.errorText}>{this.state.error.toString()}</pre>
                {this.state.errorInfo?.componentStack && (
                  <pre style={styles.stackText}>{this.state.errorInfo.componentStack}</pre>
                )}
              </details>
            )}
            <div style={styles.actions}>
              <button onClick={this.handleRetry} style={styles.primaryButton}>
                Try Again
              </button>
              <button onClick={this.handleGoHome} style={styles.secondaryButton}>
                Go to Dashboard
              </button>
              <button onClick={this.handleReload} style={styles.tertiaryButton}>
                Reload Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    padding: "2rem",
    backgroundColor: "var(--color-bg, #080d15)",
    color: "var(--color-text, #e6e6e6)",
  },
  content: {
    textAlign: "center",
    maxWidth: "600px",
    width: "100%",
  },
  icon: {
    fontSize: "4rem",
    marginBottom: "1.5rem",
  },
  title: {
    fontSize: "2rem",
    fontWeight: 600,
    marginBottom: "1rem",
    color: "var(--color-text, #e6e6e6)",
  },
  message: {
    fontSize: "1.125rem",
    color: "var(--color-text-secondary, #a0a0a0)",
    marginBottom: "2rem",
    lineHeight: 1.6,
  },
  details: {
    marginBottom: "2rem",
    textAlign: "left",
    backgroundColor: "var(--color-surface, #0b1220)",
    padding: "1rem",
    borderRadius: "8px",
    border: "1px solid var(--color-border, #1e2d3d)",
  },
  summary: {
    cursor: "pointer",
    fontWeight: 600,
    marginBottom: "0.5rem",
    color: "var(--color-text, #e6e6e6)",
  },
  errorText: {
    fontSize: "0.875rem",
    color: "#ff6b6b",
    backgroundColor: "rgba(255, 107, 107, 0.1)",
    padding: "1rem",
    borderRadius: "4px",
    overflow: "auto",
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
    marginBottom: "0.5rem",
  },
  stackText: {
    fontSize: "0.75rem",
    color: "var(--color-text-secondary, #a0a0a0)",
    overflow: "auto",
    maxHeight: "200px",
    backgroundColor: "var(--color-bg-secondary, #0d1420)",
    padding: "0.75rem",
    borderRadius: "4px",
  },
  actions: {
    display: "flex",
    gap: "1rem",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  primaryButton: {
    padding: "0.75rem 1.5rem",
    fontSize: "1rem",
    fontWeight: 600,
    color: "#fff",
    backgroundColor: "var(--color-primary, #7367f0)",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    transition: "background-color 0.2s",
  },
  secondaryButton: {
    padding: "0.75rem 1.5rem",
    fontSize: "1rem",
    fontWeight: 600,
    color: "var(--color-text, #e6e6e6)",
    backgroundColor: "transparent",
    border: "1px solid var(--color-border, #1e2d3d)",
    borderRadius: "6px",
    cursor: "pointer",
    transition: "background-color 0.2s",
  },
  tertiaryButton: {
    padding: "0.75rem 1.5rem",
    fontSize: "1rem",
    fontWeight: 500,
    color: "var(--color-text-secondary, #a0a0a0)",
    backgroundColor: "transparent",
    border: "none",
    cursor: "pointer",
    textDecoration: "underline",
  },
};
