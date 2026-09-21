import { Errors } from '@app/components/case/common/errors';
import { EttersendelseKaEnhet } from '@app/components/case/common/ettersendelse-ka-enhet';
import { FormFieldsIds } from '@app/components/case/common/form-fields-ids';
import { PostFormContainer } from '@app/components/case/common/post/post-form-container';
import { Saksnummer } from '@app/components/case/common/saksnummer';
import { VedtakDate } from '@app/components/case/common/vedtak-date';
import { BegrunnelseText } from '@app/components/case/uinnlogget/begrunnelse/begrunnelse-text';
import { UserInfo } from '@app/components/case/uinnlogget/begrunnelse/user-info';
import { useSessionCase } from '@app/components/case/uinnlogget/session-case-context';
import { DeleteCaseButton } from '@app/components/delete-case-button/delete-case-button';
import { redirectToNav } from '@app/functions/redirect-to-nav';
import { INITIAL_ERRORS } from '@app/hooks/errors/types';
import { useSessionCaseErrors } from '@app/hooks/errors/use-session-case-errors';
import { useLanguage } from '@app/language/use-language';
import { useTranslation } from '@app/language/use-translation';
import { AppEventEnum } from '@app/logging/action';
import { appEvent } from '@app/logging/logger';
import { CaseType } from '@app/redux-api/case/types';
import { CenteredContainer } from '@app/styled-components/common';
import { BodyLong, Box, Button, Checkbox, CheckboxGroup, GuidePanel, InlineMessage } from '@navikt/ds-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';

export const SessionCaseBegrunnelsePage = () => {
  const { type, innsendingsytelse, sessionCase: data, updateSessionCase, deleteSessionCase } = useSessionCase();
  const navigate = useNavigate();
  const language = useLanguage();

  const { skjema, post, common } = useTranslation();

  const validate = useSessionCaseErrors(type);

  const [errors, setErrors] = useState(INITIAL_ERRORS);
  const [isValid, setIsValid] = useState(false);

  // biome-ignore lint/correctness/useExhaustiveDependencies: Reset errors and validation when language changes.
  useEffect(() => {
    setErrors(INITIAL_ERRORS);
    setIsValid(false);
  }, [language]);

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

    navigate('../oppsummering');
  };

  const deleteAndReturn = () => {
    deleteSessionCase();
    redirectToNav();
  };

  const { page_title, title_fragment } = skjema.common;
  const { steps } = skjema;

  const isEttersendelseKlage = type === CaseType.ETTERSENDELSE_KLAGE;

  return (
    <PostFormContainer
      activeStep={1}
      isValid={isValid}
      page_title={page_title[type]}
      steps={steps[type]}
      innsendingsytelse={innsendingsytelse}
      title_fragment={title_fragment[type]}
    >
      <GuidePanel>
        <BodyLong spacing>{post.should_log_in_digital[type]}</BodyLong>
        <BodyLong spacing>{common.login_copy_reminder}</BodyLong>
        <BodyLong>{post.employer_info[type]}</BodyLong>
      </GuidePanel>

      <UserInfo data={data} update={(info) => updateSessionCase(info)} errors={errors} />

      <VedtakDate
        value={data.vedtakDate}
        onChange={(vedtakDate) => updateSessionCase({ vedtakDate })}
        error={errors[FormFieldsIds.VEDTAK_DATE]}
        type={type}
      />

      {isEttersendelseKlage ? (
        <EttersendelseKaEnhet
          caseIsAtKA={data.caseIsAtKA}
          onIsAtKaChange={(caseIsAtKA) => updateSessionCase({ caseIsAtKA })}
          error={errors[FormFieldsIds.CASE_IS_AT_KA]}
        />
      ) : null}

      <Saksnummer
        internalSaksnummer={data.internalSaksnummer}
        value={data.userSaksnummer}
        onChange={(userSaksnummer) => updateSessionCase({ userSaksnummer, internalSaksnummer: null })}
        error={errors[FormFieldsIds.SAKSNUMMER]}
      />

      <Box background="warning-moderate" borderColor="warning" borderWidth="1" padding="space-8" borderRadius="8">
        <InlineMessage status="warning">{common.login_copy_reminder}</InlineMessage>
      </Box>

      <BegrunnelseText
        value={data.fritekst}
        description={skjema.begrunnelse.begrunnelse_text.description[type]}
        placeholder={skjema.begrunnelse.begrunnelse_text.placeholder[type]}
        label={skjema.begrunnelse.begrunnelse_text.title[type]}
        onChange={(fritekst) => updateSessionCase({ fritekst })}
        error={errors[FormFieldsIds.FRITEKST]}
      />

      <CheckboxGroup
        value={data.hasVedlegg ? [HAS_VEDLEGG] : []}
        error={errors[FormFieldsIds.VEDLEGG]}
        onChange={(value: string[]) => updateSessionCase({ hasVedlegg: value.includes(HAS_VEDLEGG) })}
        legend={common.has_attachments_label}
        hideLegend
      >
        <Checkbox value={HAS_VEDLEGG}>{common.has_attachments_label}</Checkbox>
      </CheckboxGroup>

      <Errors {...errors} />

      <CenteredContainer>
        <DeleteCaseButton isLoading={false} onDelete={deleteAndReturn} title={skjema.begrunnelse.delete_title[type]} />

        <Button as={Link} variant="primary" onClick={submitKlage} to="../oppsummering" relative="path">
          {skjema.begrunnelse.next_button}
        </Button>
      </CenteredContainer>
    </PostFormContainer>
  );
};

const HAS_VEDLEGG = 'hasVedlegg';
