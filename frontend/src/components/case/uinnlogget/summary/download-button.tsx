import { useSessionCase } from '@app/components/case/uinnlogget/session-case-context';
import { useInnsendingsytelseName } from '@app/hooks/use-innsendingsytelser';
import { CASE_TYPE_NAMES_LOWER_CASE_EN } from '@app/language/en';
import { CASE_TYPE_NAMES_LOWER_CASE_NB } from '@app/language/nb';
import { CASE_TYPE_NAMES_LOWER_CASE_NN } from '@app/language/nn';
import { Languages } from '@app/language/types';
import { useLanguage } from '@app/language/use-language';
import { useTranslation } from '@app/language/use-translation';
import { AppEventEnum } from '@app/logging/action';
import { apiEvent, appEvent, errorEvent } from '@app/logging/logger';
import { API_PATH } from '@app/redux-api/common';
import { DownloadIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import { format } from 'date-fns';
import { useState } from 'react';
import { useNavigate } from 'react-router';

interface Props {
  validForm?: () => boolean;
  onError: () => void;
  error: boolean;
}

export const DownloadButton = ({ validForm, onError, error }: Props) => {
  const { type, innsendingsytelse, sessionCase } = useSessionCase();
  const { common } = useTranslation();
  const [pdfLoading, setpdfLoading] = useState(false);
  const [title] = useInnsendingsytelseName(innsendingsytelse);
  const navigate = useNavigate();
  const language = useLanguage();

  const submitKlage = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();

    if (typeof validForm === 'function' && !validForm()) {
      return;
    }

    appEvent(AppEventEnum.CASE_DOWNLOAD);

    setpdfLoading(true);

    try {
      const endpoint = `${API_PATH}/pdf/klanke`;
      const method = 'POST';

      const startTime = performance.now();

      const res = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...sessionCase, type, innsendingsytelse, language }),
      });

      if (res.ok) {
        const blob = await res.blob();
        const a = document.createElement('a');
        a.download = `Nav ${CASE_TYPE_NAMES_LOWER_CASE[language][type]} - ${title} - ${format(new Date(), 'yyyy-MM-dd HH-mm-ss')}.pdf`;
        a.href = URL.createObjectURL(blob);
        a.click();

        apiEvent(endpoint, method, startTime, res.status, `Successfully generated PDF for ${type}.`);

        navigate(NEXT_PAGE_URL);
      } else {
        apiEvent(endpoint, method, startTime, res.status, `Failed to generate PDF for ${type}.`);
        onError();
      }
    } catch (e) {
      if (e instanceof Error) {
        errorEvent(`(${type}) ${e.message}`, e.stack);
      } else {
        errorEvent(`Failed to generate PDF for ${type}.`);
      }

      onError();
    }

    setpdfLoading(false);
  };

  return (
    <Button
      variant="primary"
      onClick={submitKlage}
      loading={pdfLoading}
      icon={<DownloadIcon aria-hidden />}
      iconPosition="left"
      aria-errormessage={error ? 'download-error' : undefined}
    >
      {common.download}
    </Button>
  );
};

const NEXT_PAGE_URL = '../innsending';

const CASE_TYPE_NAMES_LOWER_CASE: Record<Languages, typeof CASE_TYPE_NAMES_LOWER_CASE_NB> = {
  [Languages.nb]: CASE_TYPE_NAMES_LOWER_CASE_NB,
  [Languages.nn]: CASE_TYPE_NAMES_LOWER_CASE_NN,
  [Languages.en]: CASE_TYPE_NAMES_LOWER_CASE_EN,
};
