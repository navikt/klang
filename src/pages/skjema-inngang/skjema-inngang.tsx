import React from 'react';
import InngangInfoBox from '../../components/skjema-inngang/inngang-info-box';
import NotFoundPage from '../not-found/not-found-page';
import { isValidYtelse } from '../../utils/routes.config';
import { DoubleMarginTopContainer } from '../../styled-components/main-styled-components';

const SkjemaInngang = (props: any) => {
    let ytelse = props.match.params.ytelse;
    if (isValidYtelse(ytelse)) {
        return (
            <DoubleMarginTopContainer>
                <DoubleMarginTopContainer>
                    <InngangInfoBox ytelse={ytelse} />
                </DoubleMarginTopContainer>
            </DoubleMarginTopContainer>
        );
    }
    return <NotFoundPage />;
};

export default SkjemaInngang;
