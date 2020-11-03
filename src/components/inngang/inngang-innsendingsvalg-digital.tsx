import { Normaltekst, Sidetittel, Systemtittel } from 'nav-frontend-typografi';
import React from 'react';
import LetterOpened from '../../assets/images/icons/LetterOpened';
import {
    CenterInMobileContainer,
    Margin40Container,
    Margin40TopContainer,
    MarginContainer,
    MarginTopContainer,
    WhiteBackgroundContainer
} from '../../styled-components/main-styled-components';
import { Tema, TemaKey } from '../../types/tema';
import { LenkepanelBase } from 'nav-frontend-lenkepanel';
import Lenke from 'nav-frontend-lenker';
import MobilePhone from '../../assets/images/icons/MobilePhone';
import KlageLinkPanel from '../link/link';
import { useLocation } from 'react-router';
import queryString from 'query-string';
import { getUrlToPaperForm } from '../../types/ytelse';
import { useLogPageView } from '../../utils/logger/use-log-page-view';
import { PageIdentifier } from '../../utils/logger/amplitude';

interface Props {
    temaKey: TemaKey;
    title?: string;
    saksnummer?: string | null;
}

const InngangInnsendingDigital = ({ temaKey, title = Tema[temaKey], saksnummer = null }: Props) => {
    useLogPageView(PageIdentifier.INNGANG_INNSENDING_DIGITAL, temaKey, title);
    const paperUrl = getUrlToPaperForm(temaKey);

    return (
        <div>
            <CenterInMobileContainer>
                <Sidetittel>{title}</Sidetittel>
            </CenterInMobileContainer>
            <Margin40Container>
                <WhiteBackgroundContainer>
                    <Normaltekst>
                        For å fylle ut og sende inn en klage må du logge inn med elektronisk ID. Hvis du skal sende en
                        anke eller du skal søke på vegne av andre må du fylle inn personopplysninger manuelt og sende
                        skjema i posten.
                    </Normaltekst>

                    <Margin40TopContainer>
                        <DigitalContent temaKey={temaKey} saksnummer={saksnummer} />
                    </Margin40TopContainer>
                    <Margin40Container>
                        <LenkepanelBase href={paperUrl} border>
                            <div className="lenkepanel-content-with-image">
                                <div className="icon-container">
                                    <LetterOpened />
                                </div>
                                <div>
                                    <Systemtittel className="lenkepanel__heading">Klage via post</Systemtittel>
                                    <MarginTopContainer>
                                        <Normaltekst>
                                            Klageskjema som sendes inn via post. Også for deg som skal klage på vegne av
                                            andre.
                                        </Normaltekst>
                                    </MarginTopContainer>
                                </div>
                            </div>
                        </LenkepanelBase>
                    </Margin40Container>

                    <div>
                        Les mer om{' '}
                        <Lenke
                            target="_blank"
                            rel="noopener noreferrer"
                            href="https://www.nav.no/no/nav-og-samfunn/kontakt-nav/klage-ris-og-ros/klagerettigheter"
                        >
                            dine klagerettigheter på våre tema-sider
                        </Lenke>
                        .
                    </div>
                </WhiteBackgroundContainer>
            </Margin40Container>
        </div>
    );
};

interface DigitalContentProps {
    temaKey: TemaKey;
    saksnummer: string | null;
}

const DigitalContent = ({ temaKey, saksnummer }: DigitalContentProps) => {
    const { search } = useLocation();
    if (saksnummer === null) {
        const query = queryString.parse(search);
        saksnummer = getQueryValue(query.saksnummer);
    }
    const href =
        saksnummer === null ? `/begrunnelse?tema=${temaKey}` : `/begrunnelse?tema=${temaKey}&saksnummer=${saksnummer}`;

    return (
        <MarginContainer>
            <KlageLinkPanel href={href} border>
                <div className="lenkepanel-content-with-image">
                    <div className="icon-container">
                        <MobilePhone />
                    </div>
                    <div>
                        <Systemtittel className="lenkepanel__heading">Klage digitalt</Systemtittel>
                        <MarginTopContainer>
                            <Normaltekst>For å sende inn digitalt må du logge inn med elektronisk ID.</Normaltekst>
                        </MarginTopContainer>
                    </div>
                </div>
            </KlageLinkPanel>
            <Lenke target="_blank" rel="noopener noreferrer" href="https://www.norge.no/elektronisk-id">
                Slik skaffer du deg elektronisk ID
            </Lenke>
        </MarginContainer>
    );
};

function getQueryValue(queryValue: string | string[] | null | undefined) {
    if (typeof queryValue === 'string' && queryValue.length !== 0) {
        return queryValue;
    }
    return null;
}

export default InngangInnsendingDigital;
