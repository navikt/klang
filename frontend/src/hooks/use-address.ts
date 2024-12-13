import { Innsendingsytelse } from '@app/innsendingsytelser/innsendingsytelser';

type AddressLines = [string, string, string];

export const useAddress = (innsendingsytelse: Innsendingsytelse | null): AddressLines => {
  if (innsendingsytelse === Innsendingsytelse.LONNSGARANTI) {
    return ['Nav Arbeid og ytelser Kristiania', 'Postboks 6683 St. Olavs plass', '0129 Oslo'];
  }

  return ['Nav skanning', 'Postboks 1400', '0109 Oslo'];
};
