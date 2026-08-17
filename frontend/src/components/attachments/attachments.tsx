import { FileIcon } from '@app/components/attachments/file-icon';
import { UploadButton } from '@app/components/attachments/upload-button';
import { ExternalLink } from '@app/components/link/external-link';
import { displayBytes } from '@app/functions/display';
import { isApiError, isError } from '@app/functions/is-api-error';
import { isErrorMessageKey } from '@app/language/error-messages';
import { useTranslation } from '@app/language/use-translation';
import { AppEventEnum } from '@app/logging/action';
import { appEvent } from '@app/logging/logger';
import type { DeleteAttachmentParams } from '@app/redux-api/case/params';
import type { Attachment } from '@app/redux-api/case/types';
import { TrashIcon, XMarkIcon } from '@navikt/aksel-icons';
import {
  Alert,
  BodyLong,
  Box,
  Button,
  ErrorMessage,
  ErrorSummary,
  HStack,
  Label,
  List,
  VStack,
} from '@navikt/ds-react';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { useState } from 'react';

interface Props {
  attachments: Attachment[];
  onDelete: (attachment: DeleteAttachmentParams) => void;
  basePath: string;
  caseId: string;
  error: string | undefined;
  isSent: boolean;
}

const ATTACHMENTS_ID = 'attachments';
type Errors = Record<string, string[] | FetchBaseQueryError>;

export const AttachmentsSection = ({ attachments, onDelete, basePath, caseId, error, isSent }: Props) => {
  const { skjema } = useTranslation();
  const [attachmentsLoading, setAttachmentsLoading] = useState<boolean>(false);
  const [attachmentErrors, setAttachmentErrors] = useState<Errors>({});

  const title = (
    <Label htmlFor={ATTACHMENTS_ID} as="label">
      {skjema.begrunnelse.attachments.title} ({attachments.length})
      {error === undefined ? null : <ErrorMessage>{error}</ErrorMessage>}
    </Label>
  );

  if (isSent) {
    return (
      <>
        {title}
        <Attachments attachments={attachments} onDelete={onDelete} basePath={basePath} caseId={caseId} isSent />
      </>
    );
  }

  return (
    <>
      {title}
      <BodyLong>{skjema.begrunnelse.attachments.description}</BodyLong>
      <Attachments attachments={attachments} onDelete={onDelete} basePath={basePath} caseId={caseId} isSent={false} />
      <Alert variant="info" inline>
        <BodyLong>{skjema.begrunnelse.attachments.supported_types}</BodyLong>
        <BodyLong>{skjema.begrunnelse.attachments.size_limit}</BodyLong>
      </Alert>
      <ShowErrors errors={attachmentErrors} clear={() => setAttachmentErrors({})} />
      <UploadButton
        setLoading={setAttachmentsLoading}
        caseId={caseId}
        addError={([key, value]) => setAttachmentErrors((prev) => ({ ...prev, [key]: value }))}
        isLoading={attachmentsLoading}
        attachments={attachments}
      />
    </>
  );
};

interface AttachmentsProps {
  attachments: Attachment[];
  onDelete: (attachment: DeleteAttachmentParams) => void;
  basePath: string;
  caseId: string;
  isSent: boolean;
}

const Attachments = ({ attachments, onDelete, basePath, caseId, isSent }: AttachmentsProps) => {
  const { common } = useTranslation();

  const deleteAttachment = (attachmentId: number) => {
    appEvent(AppEventEnum.ATTACHMENT_DELETE);
    onDelete({ caseId, attachmentId });
  };

  return (
    <VStack as="ul" gap="space-8" margin="space-0" padding="space-0" className="list-none" id={ATTACHMENTS_ID}>
      {attachments.map((a) => (
        <HStack as="li" key={a.id} align="center" gap="space-8">
          <AttachmentName isSent={isSent} basePath={basePath} caseId={caseId} {...a} />
          {isSent ? null : (
            <Button
              data-color="danger"
              variant="primary"
              size="xsmall"
              title={`${common.delete} ${a.tittel}`}
              onClick={() => deleteAttachment(a.id)}
              icon={<TrashIcon aria-hidden />}
            />
          )}
        </HStack>
      ))}
    </VStack>
  );
};

interface AttachmentNameProps {
  tittel: string;
  sizeInBytes: number;
  isSent: boolean;
  basePath: string;
  caseId: string;
  id: number;
  contentType: string;
}

const AttachmentName = ({ tittel, sizeInBytes, isSent, basePath, caseId, id, contentType }: AttachmentNameProps) => {
  const content = (
    <>
      <span>
        {tittel} ({displayBytes(sizeInBytes)})
      </span>
      <FileIcon contentType={contentType} />
    </>
  );

  return isSent ? (
    content
  ) : (
    <ExternalLink
      href={`${basePath}/${caseId}/vedlegg/${id}`}
      onClick={() => appEvent(AppEventEnum.ATTACHMENT_DOWNLOAD)}
    >
      <FileIcon contentType={contentType} />
      {content}
    </ExternalLink>
  );
};

interface ShowErrorsProps {
  errors: Errors;
  clear: () => void;
}

const ShowErrors = ({ errors, clear }: ShowErrorsProps) => {
  const errorMessages = useErrorMessages(errors);
  const { skjema } = useTranslation();

  if (errorMessages.length === 0) {
    return null;
  }

  const clearErrors = () => {
    clear();
    appEvent(AppEventEnum.CLEAR_ERRORS);
  };

  return (
    <VStack>
      <Box marginBlock="space-0 space-8">
        <Button size="small" variant="secondary" onClick={clearErrors} icon={<XMarkIcon aria-hidden />}>
          {skjema.begrunnelse.attachments.clear_errors}
        </Button>
      </Box>
      <ErrorSummary>
        {errorMessages.map(([fileName, errors]) => (
          <ErrorSummary.Item key={fileName} href="#upload-attachment" className="wrap-anywhere flex-col items-start">
            <b>{fileName}</b>
            <List>
              {errors.map((error) => (
                <List.Item key={error}>{error}</List.Item>
              ))}
            </List>
          </ErrorSummary.Item>
        ))}
      </ErrorSummary>
    </VStack>
  );
};

const useErrorMessages = (errors: Errors): [string, string[]][] => {
  const { common, error_messages } = useTranslation();

  return Object.entries(errors).map(([fileName, details]): [string, string[]] => {
    if (Array.isArray(details)) {
      return [fileName, details];
    }

    if (isApiError(details)) {
      return [
        fileName,
        [isErrorMessageKey(details.data.detail) ? error_messages[details.data.detail] : common.generic_error],
      ];
    }

    if (isError(details)) {
      return [fileName, [typeof details.data === 'string' ? details.data : common.generic_error]];
    }

    return [fileName, [common.generic_error]];
  });
};
