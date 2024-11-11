import { Envelope } from '@app/icons/envelope';
import { useTranslation } from '@app/language/use-translation';
import type { CaseType } from '@app/redux-api/case/types';
import { Alert, Heading } from '@navikt/ds-react';
import { useEffect, useState } from 'react';
import { keyframes, styled } from 'styled-components';

interface Props {
  type: CaseType;
}

export const StatusLoading = ({ type }: Props) => {
  const { skjema, icons } = useTranslation();
  const [showStillWorking, setShowStillWorking] = useState<boolean>(false);

  useEffect(() => {
    const stillWorkingTimer = setTimeout(() => setShowStillWorking(true), 8000);

    return () => {
      clearTimeout(stillWorkingTimer);
    };
  }, []);

  return (
    <div>
      <BouncingEnvelope title={icons.receipt} />
      <Heading level="2" size="medium" spacing={showStillWorking} align="center">
        {skjema.status.loading.title[type]}
      </Heading>

      {showStillWorking ? (
        <Alert variant="info" size="small">
          {skjema.status.loading.still_working}
        </Alert>
      ) : null}
    </div>
  );
};

const bounce = keyframes`
    0%,100% {
        -webkit-transform: translateY(0);
    }
    50% {
        -webkit-transform: translateY(-10px);
    }
`;

const BouncingEnvelope = styled(Envelope)`
  display: block;
  margin-left: auto;
  margin-right: auto;
  margin-top: 16px;
  margin-bottom: 16px;
  animation-duration: 1.5s;
  animation-fill-mode: both;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  animation-name: ${bounce};
`;
