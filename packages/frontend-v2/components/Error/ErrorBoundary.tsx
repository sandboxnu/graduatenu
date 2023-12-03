import React, { Component } from "react";

interface ErrorBoundaryProps {
  fallback: React.FC;
  children: React.ReactNode;
}

interface IState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, IState> {
  state = { hasError: false };

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    // Update state so the next render will show the fallback UI.
    console.error(error);
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <>{this.props.fallback}</>;
    }
    return this.props.children;
  }
}
