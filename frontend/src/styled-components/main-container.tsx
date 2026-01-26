import { Box } from '@navikt/ds-react';
import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

export const FormMainContainer = ({ children }: Props) => (
  <Box
    as="main"
    paddingBlock="space-0 space-128"
    className="ax-2xl:min-h-[80vh] min-h-[75vh] bg-ax-bg-default min-[2160px]:min-h-[85vh]"
  >
    {children}
  </Box>
);
