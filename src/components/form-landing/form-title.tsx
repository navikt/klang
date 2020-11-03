import React from 'react';
import { Ingress, Innholdstittel } from 'nav-frontend-typografi';
import styled from 'styled-components/macro';
import { CenteredMainContainer, SmallMarginTopContainer } from '../../styled-components/main-styled-components';

const TitleContainer = styled.div`
    background-color: #cce1f3;
    border-bottom: 4px solid #66a4dc;
    padding: 16px 0;
    width: 100vw;
    margin-left: calc(50% - 50vw);
    margin-top: -32px;
    margin-bottom: 10px;
`;

const FormTitle = (props: { ytelse: string }) => (
    <TitleContainer>
        <CenteredMainContainer>
            <SmallMarginTopContainer>
                <Innholdstittel>Klage på vedtak</Innholdstittel>
                <SmallMarginTopContainer>
                    <Ingress>{props.ytelse}</Ingress>
                </SmallMarginTopContainer>
            </SmallMarginTopContainer>
        </CenteredMainContainer>
    </TitleContainer>
);
export default FormTitle;
