import { TemaKey } from '../types/tema';
import * as data from './klage-eller-anke-temaer.json';
export interface KategoriTema {
    tema: TemaKey;
    tittel: string;
    ytelsePath: string;
    skjemaveileder: boolean;
    digital: boolean;
    bareAnke: boolean;
}

interface KlageAnkeTema {
    tittel: string;
    path: string;
    beskrivelse: string;
    underkategorier: KategoriTema[];
}

export const KLAGE_ELLER_ANKE_TEMAER: KlageAnkeTema[] = JSON.parse(JSON.stringify(data.temaer));

export const getKategori = (kategori: string) => KLAGE_ELLER_ANKE_TEMAER.find(({ path }) => path === kategori) ?? null;

export const hasDigitalForm = (kategori: KlageAnkeTema, tema: TemaKey) =>
    kategori.underkategorier.some(t => t.digital && t.tema === tema);

export const ytelseInTema = (kategoriObj: KlageAnkeTema, temaKode: string, ytelse: string) => {
    return kategoriObj.underkategorier.some(({ tema, ytelsePath }) => tema === temaKode && ytelsePath === ytelse);
};

export const getUnderkategoriTitleFromPath = (kategori: KlageAnkeTema, underkategoriPath: string) => {
    if (kategori === null) {
        return null;
    }
    if (kategori.underkategorier) {
        return kategori.underkategorier.find(({ ytelsePath }) => ytelsePath === underkategoriPath)?.tittel || '';
    }
    return '';
};
