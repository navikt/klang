import { navigationEvent } from '@app/logging/logger';
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

interface Props {
  children: JSX.Element;
}

export const NavigationLogger = ({ children }: Props) => {
  const location = useLocation();
  const previousPath = useRef<string>(location.pathname);

  useEffect(() => {
    if (previousPath.current !== location.pathname) {
      navigationEvent();
      previousPath.current = location.pathname;
    }
  }, [location.pathname]);

  return children;
};
