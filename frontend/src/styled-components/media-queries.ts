import { useEffect, useState } from 'react';

export enum Size {
  mobileS = '320px',
  mobileM = '375px',
  mobileL = '480px',
  tablet = '768px',
  laptop = '1024px',
  laptopL = '1440px',
  desktop = '2560px',
}

export const desktopHeight = {
  desktopL: '(min-height: 1440px)',
  desktop4K: '(min-height: 2160px)',
};

export const device = {
  mobileS: `(min-width: ${Size.mobileS})`,
  mobileM: `(min-width: ${Size.mobileM})`,
  mobileL: `(min-width: ${Size.mobileL})`,
  tablet: `(min-width: ${Size.tablet})`,
  laptop: `(min-width: ${Size.laptop})`,
  laptopL: `(min-width: ${Size.laptopL})`,
  desktop: `(min-width: ${Size.desktop})`,
  desktopL: `(min-width: ${Size.desktop})`,
};

const matchMediaQuery = (size: Size) => window.matchMedia(`(max-width: ${size})`);

const type = 'change';

export const useMatchMediaQuery = (size: Size) => {
  const [isSize, setIsSize] = useState<boolean>(matchMediaQuery(size).matches);

  useEffect(() => {
    const query = matchMediaQuery(size);
    const listener = ({ matches }: MediaQueryListEvent) => setIsSize(matches);
    query.addEventListener(type, listener);
    return () => query.removeEventListener(type, listener);
  }, [size]);

  return isSize;
};
