import React, { useEffect } from 'react';
import InngangInfoBox from '../../components/skjema-inngang/inngang-info-box';
import { Margin80TopContainer } from '../../styled-components/main-styled-components';
import queryString from 'query-string';
import { setReferrer } from '../../store/actions';

const SkjemaInngang = (props: any) => {
    const query = queryString.parse(props.location.search);
    const referrer = document.referrer;

    console.log('i have found referrer ', referrer);

    useEffect(() => {
        setReferrer(referrer);
    }, [referrer]);

    return (
        <Margin80TopContainer>
            <InngangInfoBox query={query} />
        </Margin80TopContainer>
    );
};

export default SkjemaInngang;
