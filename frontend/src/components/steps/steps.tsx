import { Stepper } from '@navikt/ds-react';
import type { StepperStepProps } from '@navikt/ds-react/Stepper';
import { Link } from 'react-router-dom';

interface Props {
  activeStep: number;
  steps: StepProps[];
}

export const Steps = ({ activeStep, steps }: Props) => (
  <Stepper activeStep={activeStep} orientation="horizontal">
    {steps.map((props) => (
      <Step key={props.to} {...props} />
    ))}
  </Stepper>
);

export interface StepProps extends Omit<StepperStepProps, 'children'> {
  to: string;
  disabled?: boolean;
  label?: string;
}

const Step = ({ label = '', disabled = false, to, ...props }: StepProps) => {
  if (disabled) {
    return (
      <Stepper.Step as="button" className="cursor-not-allowed opacity-30" disabled {...props}>
        {label}
      </Stepper.Step>
    );
  }

  return (
    <Stepper.Step to={to} as={Link} {...props}>
      {label}
    </Stepper.Step>
  );
};
