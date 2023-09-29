import React from 'react';

class ErrorBoundary extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {error:""};
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({error: `${error.name}: ${error.message}`});
  }

  render() {
    const {error} = this.state;

    if (error) {
      return (
          <>
            <>{this.props.fallback}</>
          </>
      )
    } else {
      return (
          <>{this.props.children}</>
      )
    }
  }
}

export default ErrorBoundary;