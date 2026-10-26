import { InfoBox } from '@app/components/info-box/info-box';
import { errorEvent } from '@app/logging/logger';
import { BodyShort } from '@navikt/ds-react';
import { Component, type ErrorInfo } from 'react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  state = { hasError: false };

  public static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    errorEvent(error.message, error.stack);
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <InfoBox variant="warning">
          <BodyShort>Beklager, det skjedde en feil.</BodyShort>
          <BodyShort>Sorry, something went wrong.</BodyShort>
        </InfoBox>
      );
    }

    return this.props.children;
  }
}
