import React from 'react';
import { log } from '../logging';

class ErrorBoundary extends React.Component {
    constructor(props) {
      super(props);
      this.state = { hasError: false };
    }
  
    static getDerivedStateFromError(error) {
      // Update state so the next render will show the fallback UI.
      return { hasError: true };
    }
  
    componentDidCatch(error, errorInfo) {
      // You can also log the error to an error reporting service
      log(error, errorInfo);
    }
  
    render() {
      if (this.state.hasError) {
        // You can render any custom fallback UI
        return <p>{this.props.errorMessage}</p>;
      }
  
      return this.props.children; 
    }

    
  }

ErrorBoundary.defaultProps = {
    errorMessage: "Something went wrong."
}

export default ErrorBoundary;