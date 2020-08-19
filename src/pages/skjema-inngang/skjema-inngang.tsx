import React, { useEffect } from 'react';
import InngangInfoBox from '../../components/skjema-inngang/inngang-info-box';
import NotFoundPage from '../not-found/not-found-page';
import { isValidYtelse } from '../../utils/routes.config';
import { Margin80TopContainer } from '../../styled-components/main-styled-components';
import queryString from 'query-string';
import { defaultYtelse } from '../../types/ytelse';
import { useSelector, useDispatch } from 'react-redux';
import { Store } from '../../store/reducer';
import { setValgtYtelse } from '../../store/actions';

const SkjemaInngang = (props: any) => {
    const dispatch = useDispatch();
    const { chosenYtelse } = useSelector((state: Store) => state);

    const query = queryString.parse(props.location.search);
    const ytelse = query.ytelse ?? defaultYtelse;

    useEffect(() => {
        if (ytelse && !Array.isArray(ytelse)) {
            dispatch(setValgtYtelse(ytelse));
        }
    }, [dispatch, ytelse]);

    return (
        <Margin80TopContainer>
            <InngangInfoBox ytelse={chosenYtelse} />
        </Margin80TopContainer>
    );
};

export default SkjemaInngang;
