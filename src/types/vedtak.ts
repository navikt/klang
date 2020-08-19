import { Tema } from './tema';

export class Vedtak {
    tittel?: string = '';
    vedtak: string = '';
    tema: string = 'FOR';
    ytelse: string = Tema['FOR'];
    saksnummer: string = '';
}
