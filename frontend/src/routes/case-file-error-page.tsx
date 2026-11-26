import { getMinSideUrl } from '@app/functions/min-side-url';
import { usePageInit } from '@app/hooks/use-page-init';
import { useLanguage } from '@app/language/use-language';
import { useTranslation } from '@app/language/use-translation';
import { ContentContainer } from '@app/styled-components/content-container';
import { FormMainContainer } from '@app/styled-components/main-container';
import { BodyLong, Button, Heading, HStack, VStack } from '@navikt/ds-react';
import { useLocation } from 'react-router';

export enum CaseFileType {
  ATTACHMENT = 'attachment',
  PDF = 'pdf',
}

enum CaseFileError {
  NOT_FOUND = 'not_found',
  GONE = 'gone',
  FORBIDDEN = 'forbidden',
  /** Other client errors, e.g. the case is deleted or already sent in. */
  UNAVAILABLE = 'unavailable',
  /** Server errors, where trying again may help. */
  ERROR = 'error',
}

interface Props {
  fileType: CaseFileType;
}

/**
 * Case files (attachments and case PDFs) are opened in a new tab and served by the server.
 * If the server cannot serve the file, it responds with the app and the status code, and this page explains why.
 */
export const CaseFileErrorPage = ({ fileType }: Props) => {
  const { pathname } = useLocation();
  const lang = useLanguage();
  const { case_file_error_page } = useTranslation();
  const error = getCaseFileError();
  const { title, description } = case_file_error_page[fileType][error];
  const isError = error === CaseFileError.ERROR;

  usePageInit(title);

  return (
    <FormMainContainer>
      <ContentContainer>
        <VStack gap="space-16" paddingBlock="space-64 space-0">
          <Heading level="1" size="large">
            {title}
          </Heading>
          <BodyLong>{description}</BodyLong>
          <HStack gap="space-16">
            {isError ? (
              // Full page load, so the server fetches the file again.
              <Button as="a" href={pathname}>
                {case_file_error_page.try_again}
              </Button>
            ) : null}
            {/* Case files are only available through the case, which is cleaned up some time after it is sent in. */}
            <Button as="a" href={getMinSideUrl(lang)} variant={isError ? 'secondary' : 'primary'}>
              {case_file_error_page.go_to_min_side}
            </Button>
          </HStack>
        </VStack>
      </ContentContainer>
    </FormMainContainer>
  );
};

/**
 * The status of the document, set by the server in the `data-status` attribute.
 * `client_error` is used for client error status codes without their own page.
 */
const getCaseFileError = (): CaseFileError => {
  switch (document.documentElement.getAttribute('data-status')) {
    case '404':
      return CaseFileError.NOT_FOUND;
    case '410':
      return CaseFileError.GONE;
    case '403':
      return CaseFileError.FORBIDDEN;
    case '400':
    case 'client_error':
      return CaseFileError.UNAVAILABLE;
    default:
      return CaseFileError.ERROR;
  }
};
