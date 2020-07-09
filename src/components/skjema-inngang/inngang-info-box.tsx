import React, { useState } from 'react';
import styled from 'styled-components';
import Desklamp from '../../assets/images/icons/Desklamp';
import { Systemtittel, Normaltekst } from 'nav-frontend-typografi';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import {
    MarginContainer,
    matchMediaQueries,
    ButtonFlexContainer,
    device
} from '../../styled-components/main-styled-components';
import { useHistory } from 'react-router-dom';
import View from '../../assets/images/icons/View';
import Book from '../../assets/images/icons/Book';

export const BoxHeader = styled.div`
    background-color: #c1b5d0;
    padding: 5px 30px;
    svg:nth-of-type(1) {
    }
    svg:nth-of-type(2) {
        position: relative;
        right: 20px;
    }
    svg:nth-of-type(3) {
    }
    @media ${device.mobileS} {
        svg {
            max-width: 70px;
        }
    }
    @media ${device.mobileL} {
        svg {
            max-width: none;
        }
    }
`;

export const BoxContent = styled.div`
    padding: 40px 30px;
    .infoBox {
        max-width: 500px;
    }
    @media ${device.mobileS} {
        padding: 45px 0;
    }
`;

interface Props {
    ytelse: string;
}

const InngangInfoBox = (props: Props) => {
    const history = useHistory();
    const [mediaumMobileMode, setMediumMobileMode] = useState<boolean>(matchMediaQueries.mobileM.matches);
    const [smallMobileMode, setSmallMobileMode] = useState<boolean>(matchMediaQueries.mobileS.matches);

    matchMediaQueries.mobileM.addListener(width => {
        setMediumMobileMode(width.matches);
    });

    matchMediaQueries.mobileS.addListener(width => {
        setSmallMobileMode(width.matches);
    });

    return (
        <div>
            <BoxHeader>
                <View />
                <Desklamp />
                <Book />
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
                            <Hovedknapp
                                kompakt={mediaumMobileMode}
                                mini={smallMobileMode}
                                onClick={() => history.push(`${props.ytelse}/klage`)}
                            >
                                Fortsett til innlogget skjema
                            </Hovedknapp>

                            <Knapp kompakt={mediaumMobileMode} mini={smallMobileMode}>
                                Jeg klager på vegne av andre
                            </Knapp>
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
