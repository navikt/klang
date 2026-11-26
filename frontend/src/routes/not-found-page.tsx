import { getNavKlageUrl } from '@app/functions/nav-klage-url';
import { usePageInit } from '@app/hooks/use-page-init';
import { getLanguage } from '@app/language/language';
import { LANGUAGES, Languages } from '@app/language/types';
import { ContentContainer } from '@app/styled-components/content-container';
import { FormMainContainer } from '@app/styled-components/main-container';
import { BodyLong, Button, Heading, HStack, VStack } from '@navikt/ds-react';
import { useLocation } from 'react-router';

export const NotFoundPage = () => {
  const { pathname } = useLocation();
  const lang = getLanguageFromPath(pathname);
  const { not_found_page } = getLanguage(lang);

  usePageInit(not_found_page.title);

  return (
    <FormMainContainer>
      <ContentContainer>
        <VStack gap="space-16" paddingBlock="space-64 space-0">
          <Heading level="1" size="large">
            {not_found_page.title}
          </Heading>
          <BodyLong>{not_found_page.description}</BodyLong>
          <HStack gap="space-16">
            <Button as="a" href={getNavKlageUrl(lang)}>
              {not_found_page.go_to_nav_klage}
            </Button>
          </HStack>
        </VStack>
      </ContentContainer>
    </FormMainContainer>
  );
};

const getLanguageFromPath = (pathname: string): Languages => {
  const [firstSegment] = pathname.split('/').filter((segment) => segment.length > 0);
  const lowerCased = firstSegment?.toLowerCase();

  return LANGUAGES.find((l) => l === lowerCased) ?? Languages.nb;
};
