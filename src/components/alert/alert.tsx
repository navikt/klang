import React from 'react';
import AlertStripe, { AlertStripeType } from 'nav-frontend-alertstriper';
import { HTTPError } from '../error/error';

export interface AlertType extends HTTPError {
    type: AlertStripeType;
    text: string;
}

const Alert = (props: AlertType) => {
    return (
        <div className="error__container">
            <AlertStripe type={props.type}>{props.text && <span>{`${props.text}`}</span>}</AlertStripe>
        </div>
    );
};

export default Alert;