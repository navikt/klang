import { type StepProps, Steps } from '@app/components/steps/steps';
import { useInnsendingsytelseName } from '@app/hooks/use-innsendingsytelser';
import { usePageInit } from '@app/hooks/use-page-init';
import type { Innsendingsytelse } from '@app/innsendingsytelser/innsendingsytelser';
import { FormTitleContainer } from '@app/routes/form-title-container';
import { ContentContainer } from '@app/styled-components/content-container';
import { FormMainContainer } from '@app/styled-components/main-container';

interface Props {
  innsendingsytelse: Innsendingsytelse;
  activeStep: number;
  children: React.ReactNode;
  isValid: boolean;
  steps: string[];
  title_fragment: string;
  page_title: string;
}

export const PostFormContainer = ({
  innsendingsytelse,
  activeStep,
  isValid,
  children,
  steps,
  title_fragment,
  page_title,
}: Props) => {
  const [undertittel] = useInnsendingsytelseName(innsendingsytelse);

  usePageInit(`${steps[activeStep - 1] ?? ''} \u2013 ${title_fragment}`);

  const [label1, label2, label3] = steps;

  const stepperSteps: StepProps[] = [
    {
      to: '../begrunnelse',
      label: label1,
    },
    {
      disabled: !isValid,
      to: '../oppsummering',
      label: label2,
    },
    {
      disabled: !isValid,
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
