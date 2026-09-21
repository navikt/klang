import { RenderCaseinnsendingPage } from '@app/components/case/common/post/innsending-page';
import { useSessionCase } from '@app/components/case/uinnlogget/session-case-context';
import { useGoToBegrunnelseOnError } from '@app/hooks/errors/use-navigate-on-error';
import { useSessionCaseErrors } from '@app/hooks/errors/use-session-case-errors';

export const SessionCaseInnsendingPage = () => {
  const { type, innsendingsytelse, sessionCase } = useSessionCase();
  const validate = useSessionCaseErrors(type);
  const [isValid] = validate(sessionCase);

  useGoToBegrunnelseOnError(isValid);

  return (
    <RenderCaseinnsendingPage innsendingsytelse={innsendingsytelse} hasVedlegg={sessionCase.hasVedlegg} type={type} />
  );
};
