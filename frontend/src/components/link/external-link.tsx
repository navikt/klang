import { ExtLink } from '@app/icons/external-link';
import { Languages } from '@app/language/types';
import { useLanguage } from '@app/language/use-language';
import { Link, type LinkProps } from '@navikt/ds-react';

const ICON_TITLES: Record<Languages, string> = {
  [Languages.nb]: 'Åpne lenke i ny fane',
  [Languages.en]: 'Open link in new tab',
  [Languages.nn]: 'Åpne lenke i ny fane',
};

interface ExternalLinkProps extends Omit<LinkProps, 'target' | 'rel' | 'style'> {
  openInSameWindow?: boolean;
  inline?: boolean;
}

export const ExternalLink = ({ openInSameWindow = false, inline = false, children, ...props }: ExternalLinkProps) => {
  const lang = useLanguage();

  return (
    <Link
      {...props}
      target={openInSameWindow ? '_self' : '_blank'}
      rel="noopener noreferrer"
      className={inline ? 'inline' : undefined}
    >
      {children}
      {openInSameWindow ? null : <ExtLink title={ICON_TITLES[lang]} />}
    </Link>
  );
};
