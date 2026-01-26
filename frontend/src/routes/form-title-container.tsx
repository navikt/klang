import { Box, Heading, VStack } from '@navikt/ds-react';

interface Props {
  tittel: string;
  undertittel: string;
}

export const FormTitleContainer = ({ tittel, undertittel }: Props) => (
  <Box
    as={VStack}
    align="center"
    width="100%"
    marginBlock="space-0 space-32"
    paddingInline="space-8"
    paddingBlock="space-16"
    borderColor="info"
    borderWidth="0 0 4 0"
    background="info-moderate"
  >
    <Heading spacing level="1" size="medium">
      {tittel}
    </Heading>
    <Heading spacing level="2" size="small">
      {undertittel}
    </Heading>
  </Box>
);
