import { getKategori, getUnderkategoriTitleFromPath, ytelseInTema } from '../../data/klage-eller-anke-temaer';

describe('Formatting in root page', () => {
    it('Should get category object from category path', () => {
        const expectedKategoriObj = {
            tittel: 'Familie og barn',
            path: 'familie-og-barn',
            beskrivelse: 'Barnetrygd, foreldrepenger, pleie',
            underkategorier: [
                {
                    tema: 'FOR',
                    tittel: 'Foreldrepenger, engangsstønad og svangerskapspenger',
                    ytelsePath: 'foreldrepenger-engangsstønad-svangerskapspenger',
                    skjemaveileder: false,
                    digital: true,
                    bareAnke: false
                }
            ]
        };
        const kategoriObj = getKategori('familie-og-barn');
        expect(kategoriObj).toStrictEqual(expectedKategoriObj);
    });

    it('Should return false if cant find title of underkategori from path', () => {
        const kategoriObj = {
            tittel: 'Arbeid',
            path: 'arbeid',
            beskrivelse: 'Dagpenger, AAP, egen bedrift',
            underkategorier: [
                {
                    tema: 'FOR',
                    tittel: 'Foreldrepenger, engangsstønad og svangerskapspenger',
                    ytelsePath: 'foreldrepenger-engangsstønad-svangerskapspenger',
                    skjemaveileder: false,
                    digital: true,
                    bareAnke: false
                }
            ]
        };
        const ytelse = 'foreldrepenger-engangsstønad-test';

        const expectedResult = false;

        const result = ytelseInTema(kategoriObj, 'FOR', ytelse);

        expect(result).toStrictEqual(expectedResult);
    });

    it('Should get title of underkategori from path', () => {
        const kategoriObj = {
            tittel: 'Arbeid',
            path: 'arbeid',
            beskrivelse: 'Dagpenger, AAP, egen bedrift',
            underkategorier: [
                {
                    tema: 'FOR',
                    tittel: 'Foreldrepenger, engangsstønad og svangerskapspenger',
                    ytelsePath: 'foreldrepenger-engangsstønad-svangerskapspenger',
                    skjemaveileder: false,
                    digital: true,
                    bareAnke: false
                }
            ]
        };
        const ytelse = 'foreldrepenger-engangsstønad-svangerskapspenger';
        const expectedYtelseTitle = 'Foreldrepenger, engangsstønad og svangerskapspenger';

        const underkategoriTitle = getUnderkategoriTitleFromPath(kategoriObj, ytelse);
        expect(underkategoriTitle).toStrictEqual(expectedYtelseTitle);
    });
});
