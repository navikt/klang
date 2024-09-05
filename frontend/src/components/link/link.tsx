import { ExtLink } from '@app/icons/external-link';
import { Link, type LinkProps } from '@navikt/ds-react';

interface ExternalLinkProps extends Omit<LinkProps, 'target' | 'rel' | 'style'> {
  openInSameWindow?: boolean;
  inline?: boolean;
}

export const ExternalLink = ({ openInSameWindow = false, inline = false, children, ...props }: ExternalLinkProps) => (
  <Link
    {...props}
    target={openInSameWindow ? '_self' : '_blank'}
    rel="noopener noreferrer"
    style={{ display: inline ? 'inline' : undefined }}
  >
    {children}
    {openInSameWindow ? null : <ExtLink />}
  </Link>
);
