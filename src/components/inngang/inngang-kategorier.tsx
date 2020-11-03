import React from 'react';
import { Sidetittel, Systemtittel, Undertittel } from 'nav-frontend-typografi';
import { InngangKategori } from '../../data/kategorier';
import {
    CenterInMobileContainer,
    Margin40Container,
    Margin40TopContainer,
    PointsFlexListContainer,
    WhiteBackgroundContainer
} from '../../styled-components/main-styled-components';
import { PageIdentifier } from '../../utils/logger/amplitude';
import { useLogPageView } from '../../utils/logger/use-log-page-view';
import KlageLinkPanel from '../link/link';

interface Props {
    inngangkategori: InngangKategori;
}

const InngangKategorier = ({ inngangkategori }: Props) => {
    useLogPageView(PageIdentifier.INNGANG_KATEGORIER);
    return (
        <section>
            <Margin40TopContainer>
                <CenterInMobileContainer>
                    <Sidetittel>{inngangkategori.title}</Sidetittel>
                </CenterInMobileContainer>
            </Margin40TopContainer>

            <Margin40Container>
                <WhiteBackgroundContainer>
                    <Systemtittel>Hvilken tjeneste eller ytelse gjelder det?</Systemtittel>

                    <Margin40TopContainer>
                        <PointsFlexListContainer>{getLinks(inngangkategori)}</PointsFlexListContainer>
                    </Margin40TopContainer>
                </WhiteBackgroundContainer>
            </Margin40Container>
        </section>
    );
};

const getLinks = ({ kategorier, path }: InngangKategori) =>
    kategorier.map(kategori => (
        <KlageLinkPanel key={kategori.title} href={`/${path}/${kategori.path}`} className="lenkepanel-flex" border>
            <div>
                <Undertittel className="lenkepanel__heading">{kategori.title}</Undertittel>
            </div>
        </KlageLinkPanel>
    ));

export default InngangKategorier;
