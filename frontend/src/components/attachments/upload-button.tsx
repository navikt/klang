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
const MAX_SIZE_MIB_SINGLE = 8;
const MAX_SIZE_MIB_TOTAL = 32;
const OVERHEAD_BYTES = 288;
const MAX_SIZE_BYTES_SINGLE = MAX_SIZE_MIB_SINGLE * BYTES_PER_MIB - OVERHEAD_BYTES;
const MAX_SIZE_BYTES_TOTAL = MAX_SIZE_MIB_TOTAL * BYTES_PER_MIB;

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

    appEvent(AppEventEnum.UPLOAD_FILES_START);

    const { files } = event.target;

    if (files === null || files.length === 0) {
      return;
    }

    let pickedSize = 0;

    for (const file of files) {
      pickedSize += file.size;

      if (file.size > MAX_SIZE_BYTES_SINGLE) {
        addError(`${file.name}: ${error_messages[ErrorMessageKeys.TOO_LARGE]}`);
        return;
      }
    }

    const uploadedSize = attachments.reduce((total, attachment) => total + attachment.sizeInBytes, 0);
    const overhead = files.length * OVERHEAD_BYTES;

    if (uploadedSize + pickedSize + overhead > MAX_SIZE_BYTES_TOTAL) {
      addError(error_messages[ErrorMessageKeys.TOTAL_TOO_LARGE]);
      return;
    }

    setLoading(true);

    const uploads = Array.from(files).map(async (file) => {
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
        accept="image/png, image/jpeg, image/jpg, .pdf"
        ref={fileInput}
        onChange={(e) => {
          upload(e);
          e.currentTarget.value = '';
        }}
      />
    </>
  );
};
