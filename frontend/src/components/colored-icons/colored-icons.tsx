import {
  CheckmarkCircleFillIcon,
  ExclamationmarkTriangleFillIcon,
  InformationSquareFillIcon,
  XMarkOctagonFillIcon,
} from '@navikt/aksel-icons';
import React from 'react';

type Props = React.SVGProps<SVGSVGElement> & React.RefAttributes<SVGSVGElement> & { title?: string };

export const CheckmarkCircleFillIconColored = (props: Props) => (
  <CheckmarkCircleFillIcon aria-hidden {...props} color="var(--a-icon-success)" />
);

export const XMarkOctagonFillIconColored = (props: Props) => (
  <XMarkOctagonFillIcon aria-hidden {...props} color="var(--a-icon-error)" />
);

// eslint-disable-next-line import/no-unused-modules
export const ExclamationmarkTriangleFillIconColored = (props: Props) => (
  <ExclamationmarkTriangleFillIcon aria-hidden {...props} color="var(--a-icon-warning)" />
);

// eslint-disable-next-line import/no-unused-modules
export const InformationSquareFillIconColored = (props: Props) => (
  <InformationSquareFillIcon aria-hidden {...props} color="var(--a-icon-info)" />
);
