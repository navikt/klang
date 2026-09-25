import { currentPath } from '@app/routes/current-path';
import { getLoginPath } from '@app/user/login';
import { setParams } from '@navikt/nav-dekoratoren-moduler';
import { useEffect } from 'react';
import { useLocation } from 'react-router';

interface Props {
  children: React.JSX.Element;
}

export const DekoratorSetRedirect = ({ children }: Props) => {
  const location = useLocation();

  useEffect(() => {
    const redirectToUrl = `${window.location.origin}${getLoginPath(currentPath(location))}`;
    setParams({ redirectToUrl });
  }, [location]);

  return children;
};
