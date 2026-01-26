import { Envelope } from '@app/icons/envelope';
import { useTranslation } from '@app/language/use-translation';
import type { CaseType } from '@app/redux-api/case/types';
import { BodyShort, Box, Heading, VStack } from '@navikt/ds-react';

interface Props {
  informStillWorking: boolean;
  type: CaseType;
}

export const KvitteringLoading = ({ informStillWorking, type }: Props) => {
  const { skjema, icons } = useTranslation();

  return (
    <VStack align="center">
      <Box marginInline="auto" marginBlock="space-16" width="100px" className="animate-bounce-envelope">
        <Envelope title={icons.receipt} />
      </Box>
      <Heading align="center" size="medium" level="1" spacing>
        {skjema.kvittering.loading.title[type]}
      </Heading>
      {informStillWorking ? <BodyShort align="center">{skjema.kvittering.loading.still_working}</BodyShort> : null}
    </VStack>
  );
};
