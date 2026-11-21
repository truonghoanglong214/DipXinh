import { Component, type ErrorInfo, type ReactNode } from 'react';
import { ServerErrorPage } from '@/app/pages/ServerErrorPage';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Uncaught error in ErrorBoundary:', error, errorInfo);
  }

  public handleReset = (): void => {
    this.setState({ hasError: false, error: undefined });
  };

  public render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return <ServerErrorPage error={this.state.error} resetErrorBoundary={this.handleReset} />;
    }

    return this.props.children;
  }
}
