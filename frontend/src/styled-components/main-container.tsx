import { desktopHeight } from '@app/styled-components/media-queries';
import { styled } from 'styled-components';

const MainContainer = styled.main`
  padding-bottom: 128px;
  min-height: 75vh;

  @media ${desktopHeight.desktopL} {
    min-height: 80vh;
  }
  @media ${desktopHeight.desktop4K} {
    min-height: 85vh;
  }
`;

export const FormMainContainer = styled(MainContainer)`
  padding-bottom: 128px;
  background-color: #fff;
`;
