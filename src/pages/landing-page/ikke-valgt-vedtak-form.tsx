import React, { useState } from 'react';
import PersonligeOpplysningerPage from '../personlige-opplysninger/personlige-opplysninger-page';
import { Vedtak } from '../../types/vedtak';
import BegrunnelsePage from '../begrunnelse/begrunnelse-page';
import VedtaketPage from '../vedtaket/vedtaket-page';
import { RouteType, routesStepsIkkeValgtVedtak } from '../../utils/routes.config';
import { MarginContentContainer, CenteredContentContainer } from '../../styled-components/main-styled-components';
import Steps from '../../components/steps/steps';
import { Systemtittel } from 'nav-frontend-typografi';
import OppsummeringSkjemaPage from '../oppsummering-skjema-page/oppsummering-skjema-page';
import { constructKlage } from '../../types/klage';
import { postKlage, getKlager } from '../../services/klageService';

const IkkeValgtVedtakForm = (props: any) => {
    const [activeStep, setActiveStep] = useState<number>(props.activeStep || 0);
    const [activeVedtak, setActiveVedtak] = useState<Vedtak>(new Vedtak());
    const [activeBegrunnelse, setActiveBegrunnelse] = useState<string>('');

    let activeRoutes: RouteType[] = routesStepsIkkeValgtVedtak;
    let activeRoute: RouteType = activeRoutes[activeStep];

    const next = () => {
        setActiveStep(activeStep + 1);
    };

    const chooseStep = (step: number) => {
        setActiveStep(step);
    };

    const setVedtak = (activeVedtak: Vedtak) => {
        setActiveVedtak(activeVedtak);
        setActiveStep(activeStep + 1);
    };

    const setBegrunnelse = async (begrunnelse: string) => {
        setActiveBegrunnelse(begrunnelse);
        await submitDraft();
        setActiveStep(activeStep + 1);
    };

    const submitDraft = () => {
        // Submit form as DRAFT
        let klage = constructKlage(props.person, activeVedtak, activeBegrunnelse, true);
        getKlager().then(e => {
            console.log('e : ', e);
        });
        postKlage(klage).then(e => {
            console.log('e: ', e);
        });
    };

    const submitForm = () => {
        let klage = constructKlage(props.person, activeVedtak, activeBegrunnelse, false);
        postKlage(klage).then(e => {
            console.log('e: ', e);
        });
    };

    return (
        <>
            <MarginContentContainer>
                <Steps activeRoutes={activeRoutes} activeStep={activeStep} chooseStep={chooseStep} />
            </MarginContentContainer>
            <MarginContentContainer>
                <CenteredContentContainer>
                    <MarginContentContainer>
                        <Systemtittel>{activeRoute.label}</Systemtittel>
                    </MarginContentContainer>
                </CenteredContentContainer>
                {activeStep === 0 && <PersonligeOpplysningerPage next={() => next()} />}
                {activeStep === 1 && (
                    <VedtaketPage
                        foundVedtak={props.foundVedtak}
                        activeVedtak={activeVedtak}
                        submitVedtak={(activeVedtak: Vedtak) => setVedtak(activeVedtak)}
                    />
                )}
                {activeStep === 2 && (
                    <BegrunnelsePage
                        activeBegrunnelse={activeBegrunnelse}
                        submitBegrunnelse={(activeBegrunnelse: string) => setBegrunnelse(activeBegrunnelse)}
                    />
                )}
                {activeStep === 3 && (
                    <OppsummeringSkjemaPage
                        person={props.person}
                        vedtak={activeVedtak}
                        begrunnelse={activeBegrunnelse}
                        submitForm={() => submitForm()}
                    />
                )}
            </MarginContentContainer>
        </>
    );
};

export default IkkeValgtVedtakForm;
