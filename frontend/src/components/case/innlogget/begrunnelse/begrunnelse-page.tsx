import { AttachmentsSection } from '@app/components/attachments/attachments';
import { DigitalFormContainer } from '@app/components/case/common/digital/digital-form-container';
import { Errors } from '@app/components/case/common/errors';
import { EttersendelseKaEnhet } from '@app/components/case/common/ettersendelse-ka-enhet';
import { FormFieldsIds } from '@app/components/case/common/form-fields-ids';
import { DebouncedSaksnummer } from '@app/components/case/common/saksnummer';
import { PersonligeOpplysningerSummary } from '@app/components/case/common/summary/personlige-opplysninger-summary';
import { VedtakDate } from '@app/components/case/common/vedtak-date';
import { BegrunnelseText } from '@app/components/case/innlogget/begrunnelse/begrunnelse-text';
import { CaseLoader } from '@app/components/case/innlogget/loader';
import { DeleteCaseButton } from '@app/components/delete-case-button/delete-case-button';
import { redirectToNav } from '@app/functions/redirect-to-nav';
import { INITIAL_ERRORS } from '@app/hooks/errors/types';
import { useCaseErrors } from '@app/hooks/errors/use-case-errors';
import { useUserRequired } from '@app/hooks/use-user';
import { useLanguage } from '@app/language/use-language';
import { useTranslation } from '@app/language/use-translation';
import { AppEventEnum } from '@app/logging/action';
import { appEvent } from '@app/logging/logger';
import { useDeleteAttachmentMutation, useDeleteCaseMutation, useUpdateCaseMutation } from '@app/redux-api/case/api';
import { type Case, CaseStatus, CaseType, type UpdateCaseFields } from '@app/redux-api/case/types';
import { API_PATH } from '@app/redux-api/common';
import { CenteredContainer } from '@app/styled-components/common';
import { BodyLong, Button, GuidePanel } from '@navikt/ds-react';
import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export const CaseBegrunnelsePage = () => <CaseLoader Component={RenderCasebegrunnelsePage} />;

interface Props {
  data: Case;
}

const RenderCasebegrunnelsePage = ({ data }: Props) => {
  const navigate = useNavigate();
  const language = useLanguage();
  const { data: user, isSuccess } = useUserRequired();

  const { skjema, user_loader } = useTranslation();

  const [updateCase] = useUpdateCaseMutation();
  const [deleteAttachment] = useDeleteAttachmentMutation();
  const [deleteCase, { isLoading }] = useDeleteCaseMutation();

  const validate = useCaseErrors(data.type);

  const [errors, setErrors] = useState(INITIAL_ERRORS);
  const [isValid, setIsValid] = useState(false);

  // biome-ignore lint/correctness/useExhaustiveDependencies: Reset errors and validation when language changes.
  useEffect(() => {
    setErrors(INITIAL_ERRORS);
    setIsValid(false);
  }, [language]);

  useEffect(() => {
    if (data.status !== CaseStatus.DRAFT) {
      navigate(NEXT_PAGE_URL, { replace: true });
    }
  }, [data, navigate]);

  const submitKlage = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();

    appEvent(AppEventEnum.CASE_SUBMIT);

    const [_isValid, _errors] = validate(data);

    setErrors(_errors);
    setIsValid(_isValid);

    if (!_isValid) {
      appEvent(AppEventEnum.CASE_INVALID);

      return;
    }

    appEvent(AppEventEnum.CASE_VALID);

    navigate(NEXT_PAGE_URL);
  };

  const deleteAndReturn = () => deleteCase(data.id).then(redirectToNav);

  const { title_fragment, page_title } = skjema.common;

  const isEttersendelseKlage = data.type === CaseType.ETTERSENDELSE_KLAGE;

  const onChange = useCallback(
    async <T extends keyof UpdateCaseFields>(key: T, value: UpdateCaseFields[T]) => {
      await updateCase({ key, value, id: data.id });
    },
    [data.id, updateCase],
  );

  return (
    <DigitalFormContainer
      activeStep={1}
      isValid={isValid}
      case={data}
      page_title={page_title[data.type]}
      steps={skjema.steps[data.type]}
      innsendingsytelse={data.innsendingsytelse}
      title_fragment={title_fragment[data.type]}
    >
      <GuidePanel>
        <BodyLong>{skjema.employer_info[data.type]}</BodyLong>
      </GuidePanel>

      <PersonligeOpplysningerSummary
        fornavn={isSuccess ? user.navn.fornavn : user_loader.loading_user}
        etternavn={isSuccess ? user.navn.etternavn : user_loader.loading_user}
        f_or_d_number={isSuccess ? user.folkeregisteridentifikator?.identifikasjonsnummer : user_loader.loading_user}
      />

      <VedtakDate
        value={data.vedtakDate}
        error={errors[FormFieldsIds.VEDTAK_DATE]}
        type={data.type}
        onChange={(vedtakDate) => onChange('vedtakDate', vedtakDate)}
      />

      {isEttersendelseKlage ? (
        <EttersendelseKaEnhet
          caseIsAtKA={data.caseIsAtKA}
          onIsAtKaChange={(caseIsAtKA) => onChange('caseIsAtKA', caseIsAtKA)}
          error={errors[FormFieldsIds.CASE_IS_AT_KA]}
        />
      ) : null}

      <DebouncedSaksnummer
        value={data.userSaksnummer}
        internalSaksnummer={data.internalSaksnummer}
        onChange={(userSaksnummer) => onChange('userSaksnummer', userSaksnummer)}
        error={errors[FormFieldsIds.SAKSNUMMER]}
      />

      <BegrunnelseText
        caseId={data.id}
        value={data.fritekst}
        type={data.type}
        description={skjema.begrunnelse.begrunnelse_text.description[data.type]}
        placeholder={skjema.begrunnelse.begrunnelse_text.placeholder[data.type]}
        label={skjema.begrunnelse.begrunnelse_text.title[data.type]}
        error={errors[FormFieldsIds.FRITEKST]}
        modified={data.modifiedByUser}
      />

      <AttachmentsSection
        attachments={data.vedlegg}
        caseId={data.id}
        basePath={`${API_PATH}/klanker`}
        onDelete={deleteAttachment}
        error={errors[FormFieldsIds.VEDLEGG]}
      />

      <Errors {...errors} />

      <CenteredContainer>
        <DeleteCaseButton
          isLoading={isLoading}
          onDelete={deleteAndReturn}
          title={skjema.begrunnelse.delete_title[data.type]}
        />

        <Button as={Link} variant="primary" onClick={submitKlage} to={NEXT_PAGE_URL} disabled={user === undefined}>
          {skjema.begrunnelse.next_button}
        </Button>
      </CenteredContainer>
    </DigitalFormContainer>
  );
};

const NEXT_PAGE_URL = '../oppsummering';
