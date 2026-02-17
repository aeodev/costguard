import { Component } from 'react';
import { Button } from '../shared/ui/button';
import { Card } from '../shared/ui/card';

type ErrorBoundaryProps = {
  children: React.ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
  message: string;
};

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, message: error.message };
  }

  reset = (): void => {
    this.setState({ hasError: false, message: '' });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="mx-auto max-w-4xl p-6">
          <Card className="bg-rose-500/10">
            <h2 className="text-xl font-semibold text-rose-300">App Route Error</h2>
            <p className="mt-2 text-sm text-slate-300">{this.state.message || 'Unexpected rendering error.'}</p>
            <Button className="mt-4" onClick={this.reset}>
              Try Again
            </Button>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
