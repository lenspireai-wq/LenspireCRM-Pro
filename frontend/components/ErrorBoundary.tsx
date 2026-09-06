"use client";
import { Component, type ErrorInfo, type ReactNode } from "react";
import * as Sentry from "@sentry/nextjs";

type Props = {
  children: ReactNode;
  fallback?: (error: Error, reset: () => void) => ReactNode;
  label?: string;
};

type State = { error: Error | null };

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    Sentry.captureException(error, {
      tags: { boundary: this.props.label ?? "section" },
      extra: { componentStack: info.componentStack },
    });
  }

  reset = () => this.setState({ error: null });

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;
    if (this.props.fallback) return this.props.fallback(error, this.reset);
    return (
      <section
        className="sectionError"
        role="alert"
        aria-live="assertive"
      >
        <div className="sectionErrorCard">
          <span className="sectionErrorEyebrow">
            {this.props.label ? `${this.props.label} error` : "Section error"}
          </span>
          <h2>This view could not load.</h2>
          <p>
            The team has been notified. You can retry, or move to another
            workspace while we recover.
          </p>
          <pre className="sectionErrorMessage">{error.message}</pre>
          <div className="sectionErrorActions">
            <button
              type="button"
              className="loginSubmit"
              onClick={this.reset}
            >
              Retry
            </button>
          </div>
        </div>
      </section>
    );
  }
}
