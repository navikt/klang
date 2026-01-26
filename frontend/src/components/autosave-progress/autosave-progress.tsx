import { useTranslation } from '@app/language/use-translation';
import { CheckmarkIcon } from '@navikt/aksel-icons';
import { Tooltip } from '@navikt/ds-react';
import { formatDate, isToday, parseISO } from 'date-fns';
import { styled } from 'styled-components';

interface Props {
  lastSaved: string;
}

const AutosaveContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  text-align: right;
  column-gap: 4px;
  margin-top: 4px;
  color: var(--ax-text-neutral-subtle);
`;

export const AutosaveProgressIndicator = ({ lastSaved }: Props) => {
  const { skjema } = useTranslation();
  const { tooltip: popover, saved } = skjema.begrunnelse.autosave;

  return (
    <Tooltip content={popover}>
      <AutosaveContainer>
        <CheckmarkIcon aria-hidden />
        <span>
          {saved} {getDate(lastSaved)}
        </span>
      </AutosaveContainer>
    </Tooltip>
  );
};

const getDate = (date: string) => {
  const parsed = parseISO(date);

  if (isToday(parsed)) {
    return <time dateTime={date}>{formatDate(parsed, 'HH:mm:ss')}</time>;
  }

  return <time dateTime={date}>{formatDate(parsed, 'dd.MM.yyyy HH:mm:ss')}</time>;
};
