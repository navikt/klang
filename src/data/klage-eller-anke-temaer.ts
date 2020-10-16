import { TemaKey } from '../types/tema';
import * as data from './klage-eller-anke-temaer.json';
export interface InngangYtelse {
    tittel: string;
    path: string;
    temakode: TemaKey;
    skjemaveileder: boolean;
    digital: boolean;
    bareAnke: boolean;
}

interface InngangKategori {
    tittel: string;
    path: string;
    beskrivelse: string;
    ytelser: InngangYtelse[];
}

export const INNGANG_KATEGORIER: InngangKategori[] = JSON.parse(JSON.stringify(data.kategorier));

export const getKategori = (kategori: string) => INNGANG_KATEGORIER.find(({ path }) => path === kategori) ?? null;

export const hasDigitalForm = (kategori: InngangKategori, tema: TemaKey) =>
    kategori.ytelser.some(t => t.digital && t.temakode === tema);

export const ytelseInTema = (kategoriObj: InngangKategori, tema: string, ytelse: string) => {
    return kategoriObj.ytelser.some(({ temakode, path }) => temakode === tema && path === ytelse);
};

export const getUnderkategoriTitleFromPath = (kategori: InngangKategori, underkategoriPath: string) => {
    if (kategori === null) {
        return null;
    }
    if (kategori.ytelser) {
        return kategori.ytelser.find(({ path }) => path === underkategoriPath)?.tittel || '';
    }
    return '';
};
