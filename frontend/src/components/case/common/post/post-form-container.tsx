import { skipToken } from '@reduxjs/toolkit/dist/query';
import React from 'react';
import { useBreadcrumbs } from '../../../../breadcrumbs/use-breadcrumbs';
import { useInnsendingsytelseName } from '../../../../hooks/use-innsendingsytelser';
import { usePageInit } from '../../../../hooks/use-page-init';
import { useIsAuthenticated } from '../../../../hooks/use-user';
import { Innsendingsytelse } from '../../../../innsendingsytelser/innsendingsytelser';
import { FormTitleContainer } from '../../../../routes/form-title-container';
import { ContentContainer } from '../../../../styled-components/content-container';
import { FormMainContainer } from '../../../../styled-components/main-container';
import { StepProps, Steps } from '../../../steps/steps';

interface Props {
  innsendingsytelse: Innsendingsytelse;
  activeStep: number;
  children: React.ReactNode;
  isValid: boolean;
  steps: string[];
  title_fragment: string;
  page_title: string;
  loginRequired?: boolean;
}

export const PostFormContainer = ({
  innsendingsytelse,
  activeStep,
  isValid,
  children,
  steps,
  title_fragment,
  page_title,
  loginRequired = false,
}: Props) => {
  const [undertittel] = useInnsendingsytelseName(innsendingsytelse);
  const { data: isAuthenticated } = useIsAuthenticated(loginRequired ? undefined : skipToken);

  usePageInit(`${steps[activeStep - 1] ?? ''} \u2013 ${title_fragment}`);
  useBreadcrumbs(null, null);

  const [label1, label2, label3] = steps;

  const stepperSteps: StepProps[] = [
    {
      disabled: isAuthenticated === false,
      to: '../begrunnelse',
      label: label1,
    },
    {
      disabled: !isValid || isAuthenticated === false,
      to: '../oppsummering',
      label: label2,
    },
    {
      disabled: !isValid || isAuthenticated === false,
      to: '../innsending',
      label: label3,
    },
  ];

  return (
    <FormMainContainer>
      <FormTitleContainer tittel={page_title} undertittel={undertittel} />
      <ContentContainer>
        <Steps activeStep={activeStep} steps={stepperSteps} />
        {children}
      </ContentContainer>
    </FormMainContainer>
  );
};
