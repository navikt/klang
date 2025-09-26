import { RenderCaseinnsendingPage } from '@app/components/case/common/post/innsending-page';
import { CaseLoader } from '@app/components/case/innlogget/loader';
import { useCaseErrors } from '@app/hooks/errors/use-case-errors';
import { useGoToBegrunnelseOnError } from '@app/hooks/errors/use-navigate-on-error';
import type { Case } from '@app/redux-api/case/types';

export const CaseInnsendingPage = () => <CaseLoader Component={RenderCaseInnsendingPage} />;

const RenderCaseInnsendingPage = ({ data }: { data: Case }) => {
  const validate = useCaseErrors(data.type);
  const [isValid] = validate(data);

  useGoToBegrunnelseOnError(isValid);

  return (
    <RenderCaseinnsendingPage
      innsendingsytelse={data.innsendingsytelse}
      hasVedlegg={data.hasVedlegg}
      type={data.type}
    />
  );
};
