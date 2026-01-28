import { BodyLong, Box, GlobalAlert, HStack } from '@navikt/ds-react';

interface Props {
  heading: string;
  messages: string[];
}

export const MaintenanceAlert = ({ heading, messages }: Props) => (
  <Box asChild background="default" height="100vh" width="100vw">
    <HStack align="center" justify="center">
      <GlobalAlert status="announcement" centered className="shadow-ax-dialog">
        <GlobalAlert.Header>
          <GlobalAlert.Title>{heading}</GlobalAlert.Title>
        </GlobalAlert.Header>

        <GlobalAlert.Content>
          {messages.map((m) => (
            <BodyLong key={m}>{m}</BodyLong>
          ))}
        </GlobalAlert.Content>
      </GlobalAlert>
    </HStack>
  </Box>
);
