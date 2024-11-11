import { BodyShort, HStack, Heading, VStack } from '@navikt/ds-react';
import { format, parse } from 'date-fns';
import { styled } from 'styled-components';

interface TimelineItemProps {
  title: string;
  date?: string;
  icon: React.ReactNode;
  text?: React.ReactNode;
  children?: React.ReactNode;
}

export const TimelineItem = ({ title, date, icon, text, children }: TimelineItemProps) => (
  <HStack as="li" gap="2" wrap={false} width="100%" align="stretch">
    <Icon>
      <IconCircle>{icon}</IconCircle>
    </Icon>

    <VStack gap="2" flexGrow="1">
      <Heading level="2" size="xsmall">
        {title}
      </Heading>

      {date === undefined ? <StyledTime as="span">Fremtid</StyledTime> : <DisplayDate date={date} />}

      {text === undefined ? null : <BodyShort>{text}</BodyShort>}

      {children === undefined ? null : <HStack gap="2">{children}</HStack>}
    </VStack>
  </HStack>
);

const Icon = styled.div`
  position: relative;
  z-index: 0;

  &::after {
    content: '';
    height: 100%;
    width: var(--a-spacing-05);
    background-color: var(--a-bg-subtle);
    position: absolute;
    top: 0;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    z-index: -1;
  }
`;

const IconCircle = styled.div`
  width: var(--a-spacing-10);
  height: var(--a-spacing-10);
  border-radius: 50%;
  background-color: var(--a-bg-subtle);
  display: flex;
  justify-content: center;
  align-items: center;
`;

interface DateProps {
  date: string;
}

const DisplayDate = ({ date }: DateProps) => (
  <StyledTime dateTime={date}>{format(parse(date, 'yyyy-MM-dd', new Date()), 'dd.MM.yyyy')}</StyledTime>
);

const StyledTime = styled.time`
  font-size: var(--a-font-size-small);
  color: var(--a-text-subtle);
`;
