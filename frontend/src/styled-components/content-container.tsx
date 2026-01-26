import { VStack } from '@navikt/ds-react';
import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

export const ContentContainer = ({ children }: Props) => (
  <VStack gap="space-32" marginInline="auto" className="min-w-[320px] laptop:max-w-200 max-w-[92%]">
    {children}
  </VStack>
);
