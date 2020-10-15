import BegrunnelsePage from '../pages/begrunnelse/begrunnelse-page';
import OppsummeringSkjemaPage from '../pages/oppsummering-skjema-page/oppsummering-skjema-page';
import { JSXElementConstructor } from 'react';

export type FormStep = {
    step?: number;
    path: string;
    component: JSXElementConstructor<any>;
    label: string;
    redirect?: string;
    exact: boolean;
};

export const formSteps: FormStep[] = [
    {
        step: 0,
        path: `/klage`,
        component: BegrunnelsePage,
        label: 'Begrunnelse',
        exact: true
    },
    {
        step: 1,
        path: `/oppsummering`,
        component: OppsummeringSkjemaPage,
        label: 'Oppsummering',
        exact: true
    }
];
