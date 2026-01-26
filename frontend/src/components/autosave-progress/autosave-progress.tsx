import { useTranslation } from '@app/language/use-translation';
import { CheckmarkIcon } from '@navikt/aksel-icons';
import { HStack, Tooltip } from '@navikt/ds-react';
import { formatDate, isToday, parseISO } from 'date-fns';

interface Props {
  lastSaved: string;
}

export const AutosaveProgressIndicator = ({ lastSaved }: Props) => {
  const { skjema } = useTranslation();
  const { tooltip: popover, saved } = skjema.begrunnelse.autosave;

  return (
    <Tooltip content={popover}>
      <HStack gap="space-4" align="center" marginBlock="space-4 space-0" className="text-ax-text-neutral-subtle">
        <CheckmarkIcon aria-hidden />
        <span>
          {saved} {getDate(lastSaved)}
        </span>
      </HStack>
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
