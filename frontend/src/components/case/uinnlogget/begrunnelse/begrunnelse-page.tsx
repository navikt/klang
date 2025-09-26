import { Errors } from '@app/components/case/common/errors';
import { EttersendelseKaEnhet } from '@app/components/case/common/ettersendelse-ka-enhet';
import { FormFieldsIds } from '@app/components/case/common/form-fields-ids';
import { PostFormContainer } from '@app/components/case/common/post/post-form-container';
import { Saksnummer } from '@app/components/case/common/saksnummer';
import { VedtakDate } from '@app/components/case/common/vedtak-date';
import { BegrunnelseText } from '@app/components/case/uinnlogget/begrunnelse/begrunnelse-text';
import { UserInfo } from '@app/components/case/uinnlogget/begrunnelse/user-info';
import { KlageSessionLoader } from '@app/components/case/uinnlogget/session-loader';
import type { ISessionCase } from '@app/components/case/uinnlogget/types';
import { DeleteCaseButton } from '@app/components/delete-case-button/delete-case-button';
import { redirectToNav } from '@app/functions/redirect-to-nav';
import { INITIAL_ERRORS } from '@app/hooks/errors/types';
import { useSessionCaseErrors } from '@app/hooks/errors/use-session-case-errors';
import type { Innsendingsytelse } from '@app/innsendingsytelser/innsendingsytelser';
import { useLanguage } from '@app/language/use-language';
import { useTranslation } from '@app/language/use-translation';
import { AppEventEnum } from '@app/logging/action';
import { appEvent } from '@app/logging/logger';
import { useAppDispatch } from '@app/redux/configure-store';
import { deleteSessionCase, updateSessionCase } from '@app/redux/session/session';
import { CaseType } from '@app/redux-api/case/types';
import { CenteredContainer } from '@app/styled-components/common';
import { BodyLong, Button, Checkbox, CheckboxGroup, GuidePanel } from '@navikt/ds-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';

interface IProps {
  innsendingsytelse: Innsendingsytelse;
  type: CaseType;
}

export const SessionCasebegrunnelsePage = (props: IProps) => (
  <KlageSessionLoader Component={RenderKlagebegrunnelsePage} {...props} />
);

interface Props {
  data: ISessionCase;
}

const RenderKlagebegrunnelsePage = ({ data }: Props) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const language = useLanguage();

  const updateCase = (update: Partial<ISessionCase>) => {
    const { type, innsendingsytelse: ytelse } = data;

    dispatch(updateSessionCase({ type, innsendingsytelse: ytelse, data: update }));
  };

  const { skjema, post, common } = useTranslation();

  const validate = useSessionCaseErrors(data.type);

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
    dispatch(deleteSessionCase({ type: data.type, innsendingsytelse: data.innsendingsytelse }));
    redirectToNav();
  };

  const { page_title, title_fragment } = skjema.common;
  const { steps } = skjema;

  const isEttersendelseKlage = data.type === CaseType.ETTERSENDELSE_KLAGE;

  return (
    <PostFormContainer
      activeStep={1}
      isValid={isValid}
      page_title={page_title[data.type]}
      steps={steps[data.type]}
      innsendingsytelse={data.innsendingsytelse}
      title_fragment={title_fragment[data.type]}
    >
      <GuidePanel>
        <BodyLong spacing>{post.should_log_in_digital[data.type]}</BodyLong>
        <BodyLong>{post.employer_info[data.type]}</BodyLong>
      </GuidePanel>

      <UserInfo data={data} update={(info) => updateCase(info)} errors={errors} />

      <VedtakDate
        value={data.vedtakDate}
        onChange={(vedtakDate) => updateCase({ vedtakDate })}
        error={errors[FormFieldsIds.VEDTAK_DATE]}
        type={data.type}
      />

      {isEttersendelseKlage ? (
        <EttersendelseKaEnhet
          caseIsAtKA={data.caseIsAtKA}
          onIsAtKaChange={(caseIsAtKA) => updateCase({ caseIsAtKA })}
          error={errors[FormFieldsIds.CASE_IS_AT_KA]}
        />
      ) : null}

      <Saksnummer
        internalSaksnummer={data.internalSaksnummer}
        value={data.userSaksnummer}
        onChange={(userSaksnummer) => updateCase({ userSaksnummer, internalSaksnummer: null })}
        error={errors[FormFieldsIds.SAKSNUMMER]}
      />

      <BegrunnelseText
        value={data.fritekst}
        description={skjema.begrunnelse.begrunnelse_text.description[data.type]}
        placeholder={skjema.begrunnelse.begrunnelse_text.placeholder[data.type]}
        label={skjema.begrunnelse.begrunnelse_text.title[data.type]}
        onChange={(fritekst) => updateCase({ fritekst })}
        error={errors[FormFieldsIds.FRITEKST]}
        type={data.type}
      />

      <CheckboxGroup
        value={data.hasVedlegg ? [HAS_VEDLEGG] : []}
        error={errors[FormFieldsIds.VEDLEGG]}
        onChange={(value: string[]) => updateCase({ hasVedlegg: value.includes(HAS_VEDLEGG) })}
        legend={common.has_attachments_label}
        hideLegend
      >
        <Checkbox value={HAS_VEDLEGG}>{common.has_attachments_label}</Checkbox>
      </CheckboxGroup>

      <Errors {...errors} />

      <CenteredContainer>
        <DeleteCaseButton
          isLoading={false}
          onDelete={deleteAndReturn}
          title={skjema.begrunnelse.delete_title[data.type]}
        />

        <Button as={Link} variant="primary" onClick={submitKlage} to="../oppsummering" relative="path">
          {skjema.begrunnelse.next_button}
        </Button>
      </CenteredContainer>
    </PostFormContainer>
  );
};

const HAS_VEDLEGG = 'hasVedlegg';
