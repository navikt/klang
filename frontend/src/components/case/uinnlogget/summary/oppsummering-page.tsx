import { PostFormContainer } from '@app/components/case/common/post/post-form-container';
import { PersonligeOpplysningerSummary } from '@app/components/case/common/summary/personlige-opplysninger-summary';
import { VedtakSummary } from '@app/components/case/common/summary/vedtak-summary';
import { KlageSessionLoader } from '@app/components/case/uinnlogget/session-loader';
import { DownloadButton } from '@app/components/case/uinnlogget/summary/download-button';
import type { ISessionCase } from '@app/components/case/uinnlogget/types';
import { InformationPointBox } from '@app/components/information-point-box/information-point-box';
import { useGoToBegrunnelseOnError } from '@app/hooks/errors/use-navigate-on-error';
import { useSessionCaseErrors } from '@app/hooks/errors/use-session-case-errors';
import { Clipboard } from '@app/icons/clipboard';
import type { Innsendingsytelse } from '@app/innsendingsytelser/innsendingsytelser';
import { useTranslation } from '@app/language/use-translation';
import type { CaseType } from '@app/redux-api/case/types';
import { CenteredContainer } from '@app/styled-components/common';
import { CenteredHeading } from '@app/styled-components/page-title';
import { getLoginRedirectPath } from '@app/user/login';
import { EnterIcon } from '@navikt/aksel-icons';
import { Alert, BodyLong, BodyShort, Button, ConfirmationPanel, Heading, Panel } from '@navikt/ds-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { styled } from 'styled-components';

interface IProps {
  innsendingsytelse: Innsendingsytelse;
  type: CaseType;
}

export const SessionCaseOppsummeringPage = (props: IProps) => (
  <KlageSessionLoader Component={PostKlageoppsummeringPage} {...props} />
);

interface Props {
  data: ISessionCase;
}

const PostKlageoppsummeringPage = ({ data }: Props) => {
  const { common, skjema, icons } = useTranslation();
  const validate = useSessionCaseErrors(data.type);
  const [isValid] = validate(data);
  const [isUnderstood, setIsUnderstood] = useState(false);
  const [isUnderstoodError, setIsUnderstoodError] = useState<string | null>(null);

  useGoToBegrunnelseOnError(isValid);

  const { title_fragment, page_title } = skjema.common;

  return (
    <PostFormContainer
      innsendingsytelse={data.innsendingsytelse}
      activeStep={2}
      isValid={isValid}
      steps={skjema.steps[data.type]}
      title_fragment={title_fragment[data.type]}
      page_title={page_title[data.type]}
    >
      <div>
        <Icon title={icons.summary} />
        <CenteredHeading level="2" size="medium">
          {skjema.summary.title.not_logged_in}
        </CenteredHeading>
      </div>

      <StyledPanel border>
        <Section>
          <Heading level="1" size="small" spacing>
            {skjema.summary.sections.person.title}
          </Heading>
          <PersonligeOpplysningerSummary {...data.navn} f_or_d_number={data.foedselsnummer} />
        </Section>

        <Section>
          <Heading level="1" size="small" spacing>
            {skjema.summary.sections.case.title}
          </Heading>
          <VedtakSummary {...data} />
        </Section>

        <Section>
          <Heading level="1" size="small" spacing>
            {skjema.summary.sections.begrunnelse.title[data.type]}
          </Heading>
          <VerticalContent>
            <InformationPointBox header={skjema.summary.sections.begrunnelse.why[data.type]}>
              <StyledBodyLong>{data.fritekst.length === 0 ? common.not_specified : data.fritekst}</StyledBodyLong>
            </InformationPointBox>
          </VerticalContent>
        </Section>

        <Section>
          <Heading level="1" size="small" spacing>
            {skjema.summary.sections.begrunnelse.documents}
          </Heading>
          <BodyShort>{data.hasVedlegg ? common.yes : common.no}</BodyShort>
        </Section>
      </StyledPanel>

      <Alert variant="info">
        <BodyShort spacing>{skjema.summary.sections.login.notice[data.type]}</BodyShort>
        <Button variant="primary" size="medium" as="a" href={getLoginRedirectPath()} icon={<EnterIcon aria-hidden />}>
          {skjema.summary.sections.login.action}
        </Button>
      </Alert>

      <ConfirmationPanel
        checked={isUnderstood}
        label={skjema.summary.sections.confirm.label[data.type]}
        onChange={() => setIsUnderstood((u) => !u)}
        error={isUnderstoodError}
      />

      <CenteredContainer>
        <Button as={Link} variant="secondary" to="../begrunnelse">
          {common.back}
        </Button>
        <DownloadButton
          caseData={data}
          validForm={() => {
            if (isUnderstood) {
              setIsUnderstoodError(null);

              return true;
            }

            setIsUnderstoodError(skjema.summary.sections.confirm.error[data.type]);

            return false;
          }}
        />
      </CenteredContainer>
    </PostFormContainer>
  );
};

const StyledPanel = styled(Panel)`
  display: flex;
  flex-direction: column;
  row-gap: 16px;
`;

const Section = styled.section`
  padding-bottom: 16px;
  border-bottom: 1px solid #a2a1a1;

  :last-child {
    border-bottom: none;
  }
`;

const VerticalContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const StyledBodyLong = styled(BodyLong)`
  white-space: pre-wrap;
  word-break: break-word;
`;

const Icon = styled(Clipboard)`
  && {
    display: block;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 16px;
    width: 100px;
  }
`;
