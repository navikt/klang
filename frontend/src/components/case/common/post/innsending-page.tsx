import { PostFormContainer } from '@app/components/case/common/post/post-form-container';
import { useAddress } from '@app/hooks/use-address';
import { Innsendingsytelse } from '@app/innsendingsytelser/innsendingsytelser';
import type { Language } from '@app/language/language';
import { useTranslation } from '@app/language/use-translation';
import type { CaseType } from '@app/redux-api/case/types';
import { Button, GuidePanel, Heading, HStack } from '@navikt/ds-react';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';

interface Props {
  type: CaseType;
  innsendingsytelse: Innsendingsytelse;
  hasVedlegg: boolean;
}

export const RenderCaseinnsendingPage = ({ type, innsendingsytelse, hasVedlegg }: Props) => {
  const { skjema } = useTranslation();
  const { page_title, title_fragment, title, stepTexts, address, common } = useTexts({
    type,
    innsendingsytelse,
  });

  return (
    <PostFormContainer
      activeStep={3}
      isValid
      page_title={page_title}
      steps={skjema.steps[type]}
      innsendingsytelse={innsendingsytelse}
      title_fragment={title_fragment}
    >
      <Heading level="1" size="medium">
        {title}
      </Heading>
      <GuidePanel>
        <ol className="m-0 flex flex-col gap-2 p-0">
          <li className="grid grid-cols-[min-content_1fr] items-start gap-x-2 [counter-increment:li] before:content-[counter(li)_'.']">
            {stepTexts[0]}
          </li>
          <li className="grid grid-cols-[min-content_1fr] items-start gap-x-2 [counter-increment:li] before:content-[counter(li)_'.']">
            {stepTexts[1]}
          </li>
          {hasVedlegg ? (
            <li className="grid grid-cols-[min-content_1fr] items-start gap-x-2 [counter-increment:li] before:content-[counter(li)_'.']">
              {stepTexts[2]}
            </li>
          ) : null}
          <li className="grid grid-cols-[min-content_1fr] items-start gap-x-2 [counter-increment:li] before:content-[counter(li)_'.']">
            <span>
              {stepTexts[3]}
              <address className="block not-italic">
                {address[0]}
                <br />
                {address[1]}
                <br />
                {address[2]}
              </address>
            </span>
          </li>
        </ol>
      </GuidePanel>
      <HStack justify="center" align="center" gap="space-16">
        <Button as={Link} to="../oppsummering" variant="secondary">
          {common.back}
        </Button>
      </HStack>
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

interface UseTextsProps {
  innsendingsytelse: Props['innsendingsytelse'];
  type: CaseType;
}

const useTexts = ({ innsendingsytelse, type }: UseTextsProps): Texts => {
  const { common, skjema, innsending } = useTranslation();
  const { title, steg, steg_simple } = innsending;
  const { title_fragment, page_title } = skjema.common;
  const address = useAddress(innsendingsytelse);

  return useMemo(
    () => ({
      stepTexts: innsendingsytelse === Innsendingsytelse.LONNSGARANTI ? steg_simple[type] : steg[type],
      address,
      title,
      page_title: page_title[type],
      title_fragment: title_fragment[type],
      common,
      steps: skjema.steps[type],
    }),
    [address, common, innsendingsytelse, page_title, skjema.steps, steg, steg_simple, title, title_fragment, type],
  );
};
