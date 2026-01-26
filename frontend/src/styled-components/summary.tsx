import { Box } from '@navikt/ds-react';
import type { ReactNode } from 'react';

interface SectionProps {
  children: ReactNode;
  className?: string;
}

export const Section = ({ children, className }: SectionProps) => (
  <Box
    as="section"
    paddingBlock="space-0 space-16"
    borderColor="neutral-subtle"
    borderWidth="0 0 1 0"
    className={`last:border-b-0 ${className ?? ''}`}
  >
    {children}
  </Box>
);
