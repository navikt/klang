import { useTranslation } from '@app/language/use-translation';
import { AppEventEnum } from '@app/logging/action';
import { appEvent } from '@app/logging/logger';
import { TrashIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import { useState } from 'react';

interface Props {
  onDelete: () => void;
  isLoading: boolean;
  title: string;
}

export const DeleteCaseButton = ({ onDelete, isLoading, title }: Props) => {
  const { common } = useTranslation();
  const [showConfirm, setShowConfirm] = useState(false);

  if (!showConfirm) {
    return (
      <Button
        variant="danger"
        size="medium"
        onClick={() => setShowConfirm(true)}
        title={title}
        icon={<TrashIcon aria-hidden />}
      />
    );
  }

  const deleteCase = () => {
    appEvent(AppEventEnum.CASE_DELETE);
    onDelete();
  };

  return (
    <>
      <Button
        variant="danger"
        size="medium"
        onClick={deleteCase}
        loading={isLoading}
        disabled={isLoading}
        title="Bekreft sletting"
        icon={<TrashIcon aria-hidden />}
      />
      <Button variant="secondary" size="medium" onClick={() => setShowConfirm(false)}>
        {common.cancel}
      </Button>
    </>
  );
};
