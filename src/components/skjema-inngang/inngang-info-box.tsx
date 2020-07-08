import React, { useState } from 'react';
import styled from 'styled-components';
import desk_lamp from '../../assets/images/icons/desklamp.svg';
import { Systemtittel, Normaltekst } from 'nav-frontend-typografi';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import {
    MarginContainer,
    matchMediaQueries,
    ButtonFlexContainer,
    device
} from '../../styled-components/main-styled-components';
import { useHistory } from 'react-router-dom';

export const BoxHeader = styled.div`
    background-color: #c1b5d0;
    padding: 5px 30px;
`;

export const BoxContent = styled.div`
    padding: 40px 30px;
    .infoBox {
        max-width: 500px;
    }
    @media ${device.mobileM} {
        padding: 45px 0;
    }
`;

interface Props {
    ytelse: string;
}

const InngangInfoBox = (props: Props) => {
    const history = useHistory();
    const [mobileMode, setMobileMode] = useState<boolean>(matchMediaQueries.mobileM.matches);

    matchMediaQueries.mobileM.addListener(width => {
        setMobileMode(width.matches);
    });

    return (
        <div>
            <BoxHeader>
                <img src={desk_lamp} alt="Desk lamp" />
            </BoxHeader>
            <BoxContent>
                <Systemtittel>Klage - {props.ytelse}</Systemtittel>
                <MarginContainer>
                    <div className="infoBox">
                        <Normaltekst>
                            For å fullføre skjema for klage eller anke må du logge inn med elektronisk ID. Hvis du søker
                            på vegne av andre må du fylle inn personopplysninger manuelt.
                        </Normaltekst>
                        <MarginContainer>
                            <Normaltekst>Les mer om dine klagerettigheter på våre tema-sider.</Normaltekst>
                        </MarginContainer>
                    </div>

                    <MarginContainer>
                        <ButtonFlexContainer>
                            <Hovedknapp kompakt={mobileMode} onClick={() => history.push(`${props.ytelse}/klage`)}>
                                Fortsett til innlogget skjema
                            </Hovedknapp>

                            <Knapp kompakt={mobileMode}>Jeg klager på vegne av andre</Knapp>
                        </ButtonFlexContainer>
                    </MarginContainer>
                    <MarginContainer>
                        <Normaltekst>Jeg har ikke elektronisk ID</Normaltekst>
                    </MarginContainer>
                </MarginContainer>
            </BoxContent>
        </div>
    );
};

export default InngangInfoBox;
