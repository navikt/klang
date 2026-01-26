import { DigitalFormContainer } from '@app/components/case/common/digital/digital-form-container';
import { PersonligeOpplysningerSummary } from '@app/components/case/common/summary/personlige-opplysninger-summary';
import { VedtakSummary } from '@app/components/case/common/summary/vedtak-summary';
import { CaseLoader } from '@app/components/case/innlogget/loader';
import { AttachmentSummary } from '@app/components/case/innlogget/summary/attachment-summary';
import { FinalizeDigitalCase } from '@app/components/case/innlogget/summary/finalize-digital';
import { PdfLink } from '@app/components/case/innlogget/summary/pdf-link';
import { InformationPointBox } from '@app/components/information-point-box/information-point-box';
import { useCaseErrors } from '@app/hooks/errors/use-case-errors';
import { useGoToBegrunnelseOnError } from '@app/hooks/errors/use-navigate-on-error';
import { useUserRequired } from '@app/hooks/use-user';
import { Clipboard } from '@app/icons/clipboard';
import { useTranslation } from '@app/language/use-translation';
import { type Case, CaseStatus } from '@app/redux-api/case/types';
import { API_PATH } from '@app/redux-api/common';
import { Section } from '@app/styled-components/summary';
import { Alert, BodyLong, Box, Button, ErrorMessage, Heading, HStack, Panel, VStack } from '@navikt/ds-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export const CaseOppsummeringPage = () => <CaseLoader Component={DigitalCaseOppsummeringPage} />;

interface Props {
  data: Case;
}

const DigitalCaseOppsummeringPage = ({ data }: Props) => {
  const { common, skjema, user_loader, icons } = useTranslation();
  const { data: user, isSuccess } = useUserRequired();
  const validate = useCaseErrors(data.type);
  const [isValid] = validate(data);
  const [error, setError] = useState<string | null>(null);

  useGoToBegrunnelseOnError(isValid);

  const incompleteStatus = data.status === CaseStatus.DRAFT || data.status === CaseStatus.DOWNLOADED;

  return (
    <DigitalFormContainer
      activeStep={2}
      isValid={isValid}
      case={data}
      page_title={skjema.common.page_title[data.type]}
      steps={skjema.steps[data.type]}
      innsendingsytelse={data.innsendingsytelse}
      title_fragment={skjema.common.title_fragment[data.type]}
    >
      <VStack align="center">
        <Box marginInline="auto" marginBlock="space-0 space-16" width="100px">
          <Clipboard title={icons.summary} className="w-full" />
        </Box>
        <Heading align="center" level="2" size="medium">
          {skjema.summary.title.logged_in}
        </Heading>
      </VStack>

      <Panel border>
        <VStack gap="space-16">
          <Section>
            <Heading level="1" size="small" spacing>
              {skjema.summary.sections.person.title}
            </Heading>
            <BodyLong spacing>{skjema.summary.sections.person.info_from}</BodyLong>
            <PersonligeOpplysningerSummary
              fornavn={isSuccess ? user.navn.fornavn : user_loader.loading_user}
              etternavn={isSuccess ? user.navn.etternavn : user_loader.loading_user}
              f_or_d_number={
                isSuccess ? user.folkeregisteridentifikator?.identifikasjonsnummer : user_loader.loading_user
              }
            />
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

          <AttachmentSummary
            id={data.id}
            status={data.status}
            attachments={data.vedlegg}
            basePath={`${API_PATH}/klanker`}
          />
        </VStack>
      </Panel>

      {data.status === CaseStatus.DONE ? null : (
        <Alert variant="info">{skjema.summary.kvitteringInfo[data.type]}</Alert>
      )}

      {getError(error)}

      <HStack justify="center" align="center" gap="space-16">
        {incompleteStatus ? (
          <Button as={Link} variant="secondary" to="../begrunnelse">
            {common.back}
          </Button>
        ) : null}
        <FinalizeDigitalCase {...data} id={data.id} setError={setError} />
      </HStack>

      <PdfLink
        show={incompleteStatus}
        text={skjema.summary.post_link}
        href={`${API_PATH}/klanker/${data.id}/pdf/innsending`}
        id={data.id}
        hasVedlegg={data.hasVedlegg}
        hasUploadedVedlegg={data.vedlegg.length !== 0}
      />
    </DigitalFormContainer>
  );
};

const getError = (error: string | null) => {
  if (error === null) {
    return null;
  }

  return <ErrorMessage spacing>{error}</ErrorMessage>;
};
