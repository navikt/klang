import { BodyLong, Loader, VStack } from '@navikt/ds-react';

interface Props {
  children?: string;
}

export const LoadingPage = ({ children }: Props) => (
  <VStack align="center" justify="center" gap="space-16" paddingBlock="space-64">
    <Loader size="3xlarge" />
    {children === undefined ? null : <BodyLong>{children}</BodyLong>}
  </VStack>
);
