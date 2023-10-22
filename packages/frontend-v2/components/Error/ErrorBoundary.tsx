import React, { Component, ErrorInfo } from 'react';

interface IProps {
  fallback: React.FC;
  children: React.ReactNode;
}

interface IState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<IProps, IState>{

  state = {hasError: false};

  constructor(props: IProps) {
    super(props);
    this.state = {hasError: false};
  }

  static getDerivedStateFromError(error: Error) {
    // Update state so the next render will show the fallback UI.
    console.error(error);
    console.error("error boundary reached");
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // You can also log the error to an error reporting service
    console.error(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (<>
      {this.props.fallback}
      </>)
    }

    return this.props.children;
  }
}
