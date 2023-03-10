import { Button, GuidePanel, Heading } from '@navikt/ds-react';
import React, { useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAddress } from '../../../../hooks/use-address';
import { Data, useErrors } from '../../../../hooks/use-errors';
import { Language } from '../../../../language/language';
import { useTranslation } from '../../../../language/use-translation';
import { PageIdentifier } from '../../../../logging/amplitude';
import { useLogPageView } from '../../../../logging/use-log-page-view';
import { CenteredContainer } from '../../../../styled-components/common';
import { Optional } from '../../../optional/optional';
import { PostFormContainer } from './post-form-container';

type Props = Data;

export const RenderCaseinnsendingPage = (props: Props) => {
  const { caseData, type } = props;
  const isKlage = type === 'klage' || type === 'session-klage';
  const pageIdentifier = isKlage ? PageIdentifier.KLAGESKJEMA_INNSENDING : PageIdentifier.ANKESKJEMA_INNSENDING;
  useLogPageView(pageIdentifier);
  const navigate = useNavigate();

  const { page_title, title_fragment, steps, title, stepTexts, address, common } = useTexts(props);

  const { isValid } = useErrors(props);

  useEffect(() => {
    if (!isValid) {
      navigate('../begrunnelse', { replace: true });
    }
  }, [isValid, navigate]);

  if (type === 'authenticated-ettersendelse' || type === 'unauthenticated-ettersendelse') {
    return null;
  }

  return (
    <PostFormContainer
      activeStep={3}
      isValid
      page_title={page_title}
      steps={steps}
      innsendingsytelse={caseData.innsendingsytelse}
      title_fragment={title_fragment}
    >
      <Heading level="1" size="xlarge">
        {title}
      </Heading>
      <GuidePanel>
        <InstructionList>
          <ListItem>{stepTexts[0]}</ListItem>
          <ListItem>{stepTexts[1]}</ListItem>
          <Optional show={caseData.hasVedlegg}>
            <ListItem>{stepTexts[2]}</ListItem>
          </Optional>
          <ListItem>
            <span>
              {stepTexts[3]}
              <Address>
                {address[0]}
                <br />
                {address[1]}
                <br />
                {address[2]}
              </Address>
            </span>
          </ListItem>
        </InstructionList>
      </GuidePanel>
      <CenteredContainer>
        <Button as={Link} to="../oppsummering" variant="secondary">
          {common.back}
        </Button>
      </CenteredContainer>
    </PostFormContainer>
  );
};

interface Texts {
  title: string;
  page_title: string;
  title_fragment: string;
  common: Language['common'];
  steps: string[];
  stepTexts: string[];
  address: [string, string, string];
}

const useTexts = ({ caseData, type }: Props): Texts => {
  const isKlage = type === 'klage' || type === 'session-klage';
  const { klageskjema_post, ankeskjema_post, common } = useTranslation();
  const skjema_post = isKlage ? klageskjema_post : ankeskjema_post;
  const { title, steg, steg_simple } = skjema_post.innsending;
  const { steps, title_fragment, page_title } = skjema_post.common;
  const address = useAddress(caseData.innsendingsytelse);

  return useMemo(() => {
    switch (caseData.innsendingsytelse) {
      case 'LONNSGARANTI':
        return {
          stepTexts: steg_simple,
          address,
          title,
          page_title,
          title_fragment,
          common,
          steps,
        };
      default:
        return {
          stepTexts: steg,
          address,
          title,
          page_title,
          title_fragment,
          common,
          steps,
        };
    }
  }, [address, caseData.innsendingsytelse, common, page_title, steg, steg_simple, steps, title, title_fragment]);
};

const InstructionList = styled.ol`
  display: flex;
  flex-direction: column;
  row-gap: 8px;
  margin: 0;
  padding: 0;
`;

const ListItem = styled.li`
  display: grid;
  align-items: flex-start;
  grid-template-columns: min-content 1fr;
  column-gap: 8px;
  counter-increment: li;

  &::before {
    content: counter(li) '.';
  }
`;

const Address = styled.address`
  display: block;
`;
