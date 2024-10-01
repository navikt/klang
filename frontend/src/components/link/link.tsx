import { ExtLink } from '@app/icons/external-link';
import { useTranslation } from '@app/language/use-translation';
import { Link, type LinkProps } from '@navikt/ds-react';

interface ExternalLinkProps extends Omit<LinkProps, 'target' | 'rel' | 'style'> {
  openInSameWindow?: boolean;
  inline?: boolean;
}

export const ExternalLink = ({ openInSameWindow = false, inline = false, children, ...props }: ExternalLinkProps) => {
  const { icons } = useTranslation();

  return (
    <Link
      {...props}
      target={openInSameWindow ? '_self' : '_blank'}
      rel="noopener noreferrer"
      style={{ display: inline ? 'inline' : undefined }}
    >
      {children}
      {openInSameWindow ? null : <ExtLink title={icons.externalLink} />}
    </Link>
  );
};
