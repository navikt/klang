import { PersonligeOpplysningerSummary } from '@app/components/case/common/summary/personlige-opplysninger-summary';
import { useUserRequired } from '@app/hooks/use-user';
import { useTranslation } from '@app/language/use-translation';
import type { IUser } from '@app/redux-api/user/types';
import { SpaceBetweenFlexListContainer } from '@app/styled-components/common';
import { ErrorMessage, Skeleton, VStack } from '@navikt/ds-react';

const getSakenGjelderUser = (fullmaktsgivere: IUser[], self: IUser, sakenGjelder: string): IUser | undefined => {
  if (sakenGjelder === self.folkeregisteridentifikator.identifikasjonsnummer) {
    return self;
  }

  return fullmaktsgivere.find(
    ({ folkeregisteridentifikator }) => folkeregisteridentifikator.identifikasjonsnummer === sakenGjelder,
  );
};

interface PersonligeOpplysningerProps {
  fullmaktsgivere: IUser[];
  sakenGjelder: string;
}

export const SakenGjelderSummary = ({ fullmaktsgivere, sakenGjelder }: PersonligeOpplysningerProps) => {
  const { data, isFetching, isSuccess } = useUserRequired();
  const { user_loader } = useTranslation();

  if (isFetching) {
    return <Loading />;
  }

  if (!isSuccess || data === undefined) {
    return <ErrorMessage>{user_loader.error}</ErrorMessage>;
  }

  const sakenGjelderUser = getSakenGjelderUser(fullmaktsgivere, data, sakenGjelder);

  if (sakenGjelderUser === undefined) {
    return <ErrorMessage>{user_loader.error}</ErrorMessage>;
  }

  return (
    <PersonligeOpplysningerSummary
      fornavn={sakenGjelderUser.navn.fornavn}
      etternavn={sakenGjelderUser.navn.etternavn}
      f_or_d_number={sakenGjelderUser.folkeregisteridentifikator.identifikasjonsnummer}
    />
  );
};

const Loading = () => (
  <SpaceBetweenFlexListContainer>
    <VStack>
      <Skeleton height={24} width={170} />
      <Skeleton height={24} />
    </VStack>
    <VStack>
      <Skeleton height={24} width={100} />
      <Skeleton height={24} />
    </VStack>
    <VStack>
      <Skeleton height={24} width={300} />
      <Skeleton height={24} />
    </VStack>
  </SpaceBetweenFlexListContainer>
);
