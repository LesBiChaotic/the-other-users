/**
 * Root Error Boundary — The Other Users
 * 
 * In-world diegetic error recovery boundary providing Retry, Return Home,
 * and Surface Reset controls without leaking authored spoilers.
 */

import { Component, ErrorInfo, ReactNode } from 'react';
import { BaseButton } from '../components/primitives/BaseButton';

interface Props {
  children: ReactNode;
  onSurfaceReset?: () => void;
}

interface State {
  hasError: boolean;
  errorCode: string;
}

export class RootErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      errorCode: '',
    };
  }

  static getDerivedStateFromError(error: Error): State {
    // Generate deterministic diagnostic code without sensitive data
    const code = `ERR_PLN_${Math.abs(
      error.message.split('').reduce((a, b) => ((a << 5) - a + b.charCodeAt(0)) | 0, 0)
    ).toString(16)}`;

    return {
      hasError: true,
      errorCode: code,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Palinode boundary caught exception:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, errorCode: '' });
  };

  handleSurfaceReset = () => {
    if (this.props.onSurfaceReset) {
      this.props.onSurfaceReset();
    }
    this.setState({ hasError: false, errorCode: '' });
  };

  render() {
    if (this.state.hasError) {
      return (
        <main
          role="alert"
          aria-live="assertive"
          style={{
            minHeight: '100dvh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 'var(--space-4)',
            backgroundColor: 'var(--bg-canvas)',
            color: 'var(--text-primary)',
          }}
        >
          <div
            style={{
              maxWidth: '560px',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-4)',
            }}
          >
            <h1 className="type-h2" style={{ color: 'var(--accent-warning)' }}>
              Protocol Translation Exception
            </h1>
            <p className="type-body">
              The interface encountered an unrenderable packet translation error.
              Sensory stream temporarily disrupted.
            </p>
            <p className="type-mono" style={{ color: 'var(--text-muted)' }}>
              Diagnostic Reference: {this.state.errorCode}
            </p>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 'var(--space-3)',
                marginTop: 'var(--space-2)',
              }}
            >
              <BaseButton variant="primary" onClick={this.handleRetry}>
                Retry Packet
              </BaseButton>
              <BaseButton onClick={this.handleSurfaceReset}>
                Reset Surface
              </BaseButton>
              <BaseButton onClick={() => (window.location.href = '/')}>
                Return to Network Threshold
              </BaseButton>
            </div>
          </div>
        </main>
      );
    }

    return this.props.children;
  }
}
