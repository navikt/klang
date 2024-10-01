import { useInnsendingsytelseName } from '@app/hooks/use-innsendingsytelser';
import { usePageInit } from '@app/hooks/use-page-init';
import { useIsAuthenticated } from '@app/hooks/use-user';
import type { Innsendingsytelse } from '@app/innsendingsytelser/innsendingsytelser';
import {
  type Anke,
  CaseStatus,
  type EttersendelseAnke,
  type EttersendelseKlage,
  type Klage,
} from '@app/redux-api/case/types';
import { FormTitleContainer } from '@app/routes/form-title-container';
import { ContentContainer } from '@app/styled-components/content-container';
import { FormMainContainer } from '@app/styled-components/main-container';
import { type StepProps, Steps } from '../../../steps/steps';

interface Props {
  innsendingsytelse: Innsendingsytelse;
  activeStep: number;
  isValid: boolean;
  children: React.ReactNode;
  case: Klage | Anke | EttersendelseKlage | EttersendelseAnke;
  steps: string[];
  title_fragment: string;
  page_title: string;
}

export const DigitalFormContainer = ({
  innsendingsytelse,
  activeStep,
  isValid,
  case: sak,
  children,
  steps,
  title_fragment,
  page_title,
}: Props) => {
  const [undertittel] = useInnsendingsytelseName(innsendingsytelse);
  const { isAuthenticated } = useIsAuthenticated();

  usePageInit(`${steps[activeStep - 1] ?? ''} \u2013 ${title_fragment}`);

  const [label1, label2, label3] = steps;

  const stepperSteps: StepProps[] = [
    {
      disabled: isAuthenticated === false || sak.status === CaseStatus.DONE,
      to: '../begrunnelse',
      label: label1,
    },
    {
      disabled: isAuthenticated === false || (!isValid && sak.status !== CaseStatus.DONE),
      to: '../oppsummering',
      label: label2,
    },
    {
      disabled: isAuthenticated === false || sak.status !== CaseStatus.DONE,
      to: '../kvittering',
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
