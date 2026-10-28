import { VStack } from '@navikt/ds-react';
import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

export const ContentContainer = ({ children }: Props) => (
  <VStack gap="space-32" marginInline="auto" className="laptop:max-w-200 max-w-[92%] min-w-[320px]">
    {children}
  </VStack>
);
