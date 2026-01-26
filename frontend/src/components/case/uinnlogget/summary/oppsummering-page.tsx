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
import { Section } from '@app/styled-components/summary';
import { getLoginRedirectPath } from '@app/user/login';
import { EnterIcon } from '@navikt/aksel-icons';
import {
  Alert,
  BodyLong,
  BodyShort,
  Box,
  Button,
  Checkbox,
  CheckboxGroup,
  Heading,
  HStack,
  VStack,
} from '@navikt/ds-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

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

const UNDERSTOOD_VALUE = 'understood';

const PostKlageoppsummeringPage = ({ data }: Props) => {
  const { common, skjema, icons, error_messages } = useTranslation();
  const validate = useSessionCaseErrors(data.type);
  const [isValid] = validate(data);
  const [isUnderstood, setIsUnderstood] = useState(false);
  const [isUnderstoodError, setIsUnderstoodError] = useState<string | null>(null);
  const [downloadError, setDownloadError] = useState<boolean>(false);

  const showIsUnderstoodError = isUnderstoodError !== null;

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
      <VStack align="center">
        <Box marginInline="auto" marginBlock="space-0 space-16" width="100px">
          <Clipboard title={icons.summary} className="w-full" />
        </Box>
        <Heading align="center" level="2" size="medium">
          {skjema.summary.title.not_logged_in}
        </Heading>
      </VStack>

      <VStack asChild gap="space-16">
        <Box padding="space-16" borderWidth="1" borderRadius="12">
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
            <VStack gap="space-16">
              <InformationPointBox header={skjema.summary.sections.begrunnelse.why[data.type]}>
                <BodyLong className="wrap-break-word whitespace-pre-wrap">
                  {data.fritekst.length === 0 ? common.not_specified : data.fritekst}
                </BodyLong>
              </InformationPointBox>
            </VStack>
          </Section>

          <Section>
            <Heading level="1" size="small" spacing>
              {skjema.summary.sections.begrunnelse.documents}
            </Heading>
            <BodyShort>{data.hasVedlegg ? common.yes : common.no}</BodyShort>
          </Section>
        </Box>
      </VStack>

      <Alert variant="info">
        <BodyShort spacing>{skjema.summary.sections.login.notice[data.type]}</BodyShort>
        <Button variant="primary" size="medium" as="a" href={getLoginRedirectPath()} icon={<EnterIcon aria-hidden />}>
          {skjema.summary.sections.login.action}
        </Button>
      </Alert>

      <Box
        background={showIsUnderstoodError ? 'danger-moderate' : 'warning-moderate'}
        borderColor={showIsUnderstoodError ? 'danger-strong' : 'warning-strong'}
        borderRadius="12"
        borderWidth="1"
        padding="space-16"
      >
        <CheckboxGroup
          value={isUnderstood ? [UNDERSTOOD_VALUE] : []}
          onChange={(checked: string[]) => setIsUnderstood(checked.includes(UNDERSTOOD_VALUE))}
          error={isUnderstoodError}
          hideLegend
          legend={skjema.summary.sections.confirm.legend}
        >
          <Checkbox value={UNDERSTOOD_VALUE} error={showIsUnderstoodError}>
            {skjema.summary.sections.confirm.label[data.type]}
          </Checkbox>
        </CheckboxGroup>
      </Box>

      <VStack align="center" gap="space-16">
        <HStack align="center" justify="center" gap="space-16">
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
            onError={() => setDownloadError(true)}
            error={downloadError}
          />
        </HStack>

        {downloadError ? (
          <Alert size="small" variant="error" aria-live="polite" id="download-error">
            {error_messages.download}
          </Alert>
        ) : null}
      </VStack>
    </PostFormContainer>
  );
};
