import React, { useEffect } from 'react';
import ErrorBoundary from '../../components/error/ErrorBoundary';
import FormLanding from '../../components/form-landing/form-landing';
import queryString from 'query-string';
import { useDispatch } from 'react-redux';
import { setReferrer } from '../../store/actions';

const FormLandingPage = (props: any) => {
    const dispatch = useDispatch();
    const query = queryString.parse(props.location.search);

    useEffect(() => {
        dispatch(setReferrer(sessionStorage.getItem('referrer') ?? ''));
    }, [dispatch]);

    return (
        <ErrorBoundary>
            <FormLanding query={query} location={props.location} />
        </ErrorBoundary>
    );
};

export default FormLandingPage;
