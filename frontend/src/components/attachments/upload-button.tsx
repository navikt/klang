import { MAX_SIZE_UPLOAD_MIB_SINGLE, MAX_SIZE_UPLOAD_MIB_TOTAL } from '@app/constants';
import { isError } from '@app/functions/is-api-error';
import { ErrorMessageKeys } from '@app/language/error-messages';
import { useTranslation } from '@app/language/use-translation';
import { AppEventEnum } from '@app/logging/action';
import { appEvent } from '@app/logging/logger';
import { useUploadAttachmentMutation } from '@app/redux-api/case/api';
import type { Attachment } from '@app/redux-api/case/types';
import { UploadIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { useRef } from 'react';

const BYTES_PER_KB = 1_024;
const BYTES_PER_MIB = BYTES_PER_KB * BYTES_PER_KB;
const OVERHEAD_BYTES = 288;
const MAX_SIZE_BYTES_SINGLE = MAX_SIZE_UPLOAD_MIB_SINGLE * BYTES_PER_MIB - OVERHEAD_BYTES;
const MAX_SIZE_BYTES_TOTAL = MAX_SIZE_UPLOAD_MIB_TOTAL * BYTES_PER_MIB;

const FORMATTER = new Intl.NumberFormat('nb-NO');

const VALID_FILE_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf'];

interface Props {
  caseId: string;
  inputId: string;
  setLoading: (loading: boolean) => void;
  isLoading: boolean;
  addError: (error: FetchBaseQueryError | string) => void;
  attachments: Attachment[];
}

export const UploadButton = ({ inputId, setLoading, isLoading, addError, caseId, attachments }: Props) => {
  const { skjema, error_messages } = useTranslation();
  const fileInput = useRef<HTMLInputElement>(null);
  const [uploadAttachment] = useUploadAttachmentMutation();

  const handleAttachmentClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    appEvent(AppEventEnum.UPLOAD_FILES_CLICK);
    fileInput.current?.click();
  };

  const upload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();

    const files = Array.from(event.target.files ?? []);

    appEvent(AppEventEnum.UPLOAD_FILES_START, {
      file_count: files.length,
      files: files.map((file) => ({
        size_kib: `${FORMATTER.format(file.size / BYTES_PER_KB)}`,
        type: file.type,
      })),
    });

    if (files.length === 0) {
      return;
    }

    const uploadedSize = attachments.reduce((total, attachment) => total + attachment.sizeInBytes, 0);
    const includedFiles: File[] = [];
    const exclusionReasons: string[] = [];
    let pickedSize = 0;

    for (const file of files) {
      if (!VALID_FILE_TYPES.includes(file.type)) {
        addError(`${file.name}: ${error_messages[ErrorMessageKeys.FILE_COULD_NOT_BE_CONVERTED]}`);
        exclusionReasons.push(`Invalid type: ${file.type}`);
        continue;
      }

      if (file.size > MAX_SIZE_BYTES_SINGLE) {
        addError(`${file.name}: ${error_messages[ErrorMessageKeys.TOO_LARGE]}`);
        exclusionReasons.push(`File too large: ${FORMATTER.format(file.size / BYTES_PER_KB)} KiB`);
        continue;
      }

      const overhead = (includedFiles.length + 1) * OVERHEAD_BYTES;

      if (uploadedSize + pickedSize + overhead + file.size > MAX_SIZE_BYTES_TOTAL) {
        addError(`${error_messages.could_not_add} ${file.name}. ${error_messages[ErrorMessageKeys.TOTAL_TOO_LARGE]}`);
        exclusionReasons.push(
          `Total size exceeded. Could not add file of size: ${FORMATTER.format(file.size / BYTES_PER_KB)} KiB. Used: ${FORMATTER.format((uploadedSize + pickedSize + overhead) / BYTES_PER_KB)} KiB.`,
        );
        continue;
      }

      pickedSize += file.size;
      includedFiles.push(file);
    }

    if (exclusionReasons.length > 0) {
      appEvent(AppEventEnum.UPLOAD_FILES_ERROR, { exclusions: exclusionReasons });
    }

    if (includedFiles.length === 0) {
      return;
    }

    setLoading(true);

    const uploads = includedFiles.map(async (file) => {
      try {
        await uploadAttachment({ caseId, file }).unwrap();
      } catch (err) {
        if (isError(err)) {
          addError(err);
        }

        return null;
      }
    });

    await Promise.all(uploads);
    setLoading(false);
    appEvent(AppEventEnum.UPLOAD_FILES_DONE);
  };

  return (
    <>
      <Button
        className="self-start"
        variant="secondary"
        onClick={handleAttachmentClick}
        loading={isLoading}
        id="upload-attachment"
        icon={<UploadIcon aria-hidden />}
      >
        {skjema.begrunnelse.attachments.upload_button_text}
      </Button>
      <input
        className="hidden"
        id={inputId}
        type="file"
        multiple
        accept={[...VALID_FILE_TYPES, '.pdf'].join(',')}
        ref={fileInput}
        onChange={(e) => {
          upload(e);
          e.currentTarget.value = '';
        }}
      />
    </>
  );
};
