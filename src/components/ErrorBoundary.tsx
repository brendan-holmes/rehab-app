import React from 'react';
import { logInfo } from '../logging';

type ErrorBoundaryProps = {
    errorMessage: string;
    children: React.ReactNode;
}

type ErrorBoundaryState = {
    hasError: boolean;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
      super(props);
      this.state = { hasError: false };
    }
  
    static getDerivedStateFromError() {
      // Update state so the next render will show the fallback UI.
      return { hasError: true };
    }
  
    componentDidCatch(error: any, errorInfo: any) {
      // You can also log the error to an error reporting service
      logInfo(error, errorInfo);
    }
  
    render() {
      if (this.state.hasError) {
        // You can render any custom fallback UI
        return <p>{this.props.errorMessage}</p>;
      }
  
      return this.props.children; 
    }

    
  }

export default ErrorBoundary;