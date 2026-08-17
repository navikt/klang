import { useTranslation } from '@app/language/use-translation';
import { AppEventEnum } from '@app/logging/action';
import { appEvent } from '@app/logging/logger';
import { useAppSelector } from '@app/redux/configure-store';
import { useGetCaseQuery } from '@app/redux-api/case/api';
import { BodyShort, Modal } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';
import { useEffect } from 'react';

export const CaseSentModal = () => {
  const { skjema } = useTranslation();
  const { id } = useAppSelector(({ caseSentModal }) => caseSentModal);
  const { isSuccess, data } = useGetCaseQuery(id ?? skipToken);

  const show = typeof id === 'string';

  useEffect(() => {
    if (show) {
      appEvent(AppEventEnum.CASE_SENT_MODAL_OPEN);
    }
  }, [show]);

  if (!show || !isSuccess) {
    return null;
  }

  const { title, message } = skjema.begrunnelse.case_done_modal;

  return (
    <Modal open onClose={() => undefined} header={{ heading: title[data.type], closeButton: false }} className="p-3">
      <Modal.Body>
        <BodyShort>{message[data.type]}</BodyShort>
      </Modal.Body>
    </Modal>
  );
};
