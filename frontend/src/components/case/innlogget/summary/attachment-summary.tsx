import { FileIcon } from '@app/components/attachments/file-icon';
import { ExternalLink } from '@app/components/link/external-link';
import { getAttachmentUrl } from '@app/functions/case-file-url';
import { displayBytes } from '@app/functions/display';
import { useLanguage } from '@app/language/use-language';
import { useTranslation } from '@app/language/use-translation';
import { type Attachment, CaseStatus } from '@app/redux-api/case/types';
import { Section } from '@app/styled-components/summary';
import { Heading, HStack, VStack } from '@navikt/ds-react';

interface Props {
  status: CaseStatus;
  id: string;
  attachments: Attachment[];
}

export const AttachmentSummary = ({ status, id, attachments }: Props) => {
  const { skjema } = useTranslation();
  const lang = useLanguage();

  if (attachments.length === 0) {
    return null;
  }

  if (status !== CaseStatus.DRAFT) {
    return (
      <Section>
        <Heading level="1" size="small" spacing>
          {skjema.summary.documents} ({attachments.length})
        </Heading>
        <VStack as="ul" gap="space-4" margin="space-0" padding="space-0" className="list-none">
          {attachments.map((attachment) => (
            <HStack as="li" key={attachment.id} align="center" gap="space-4">
              <FileIcon contentType={attachment.contentType} />
              <span>
                {attachment.tittel} ({displayBytes(attachment.sizeInBytes)})
              </span>
            </HStack>
          ))}
        </VStack>
      </Section>
    );
  }

  return (
    <Section>
      <Heading level="1" size="small" spacing>
        {skjema.summary.documents} ({attachments.length})
      </Heading>
      <VStack as="ul" gap="space-4" margin="space-0" padding="space-0" className="list-none">
        {attachments.map((attachment) => (
          <li key={attachment.id}>
            <ExternalLink href={getAttachmentUrl(lang, id, attachment.id)}>
              <FileIcon contentType={attachment.contentType} />
              <span>
                {attachment.tittel} ({displayBytes(attachment.sizeInBytes)})
              </span>
            </ExternalLink>
          </li>
        ))}
      </VStack>
    </Section>
  );
};
