import React from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { MasterPaddingContainer, MainContainer } from '../../styled-components/main-styled-components';
import { pathIsPartOfInngang } from '../../utils/routes.config';

interface Props {
    children: React.ReactChild | React.ReactChildren;
}

const Layout = ({ children }: Props) => {
    const location = useLocation();
    const isPartOfInngang = pathIsPartOfInngang(location.pathname);

    const bgColorChooser = () => {
        if (isPartOfInngang) return '#e7e9e9';
        return '#fff';
    };

    const Frame = styled.div<Props>`
        background-color: ${bgColorChooser()};
    `;

    return (
        <Frame>
            <MainContainer>
                <MasterPaddingContainer>{children}</MasterPaddingContainer>
            </MainContainer>
        </Frame>
    );
};

export default Layout;
