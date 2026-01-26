import { HStack } from '@navikt/ds-react';
import type { ReactNode } from 'react';

interface ContainerProps {
  children: ReactNode;
}

export const CenteredContainer = ({ children }: ContainerProps) => (
  <HStack justify="center" align="center" gap="space-16">
    {children}
  </HStack>
);

export const SpaceBetweenFlexListContainer = ({ children }: ContainerProps) => (
  <div className="grid grid-cols-2 gap-4">{children}</div>
);
