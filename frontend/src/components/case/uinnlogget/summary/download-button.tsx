import type { ISessionCase } from '@app/components/case/uinnlogget/types';
import { useInnsendingsytelseName } from '@app/hooks/use-innsendingsytelser';
import { useLanguage } from '@app/language/use-language';
import { useTranslation } from '@app/language/use-translation';
import { AppEventEnum } from '@app/logging/action';
import { apiEvent, appEvent, errorEvent } from '@app/logging/logger';
import { CaseType } from '@app/redux-api/case/types';
import { API_PATH } from '@app/redux-api/common';
import { DownloadIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import { format } from 'date-fns';
import { useState } from 'react';
import { useNavigate } from 'react-router';

interface Props {
  caseData: ISessionCase;
  validForm?: () => boolean;
}

export const DownloadButton = ({ caseData, validForm }: Props) => {
  const { common } = useTranslation();
  const [pdfLoading, setpdfLoading] = useState(false);
  const [title] = useInnsendingsytelseName(caseData.innsendingsytelse);
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
        body: JSON.stringify({ ...caseData, language }),
      });

      if (res.ok) {
        const blob = await res.blob();
        const a = document.createElement('a');
        a.download = `Nav ${getTypeString(caseData.type)} - ${title} - ${format(new Date(), 'yyyy-MM-dd HH-mm-ss')}.pdf`;
        a.href = URL.createObjectURL(blob);
        a.click();

        apiEvent(endpoint, method, startTime, res.status, `Successfully generated PDF for ${caseData.type}.`);

        navigate(NEXT_PAGE_URL);
      } else {
        apiEvent(endpoint, method, startTime, res.status, `Failed to generate PDF for ${caseData.type}.`);
      }
    } catch (e) {
      if (e instanceof Error) {
        errorEvent(`(${caseData.type}) ${e.message}`, e.stack);
      } else {
        errorEvent(`Failed to generate PDF for ${caseData.type}.`);
      }
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
    >
      {common.download}
    </Button>
  );
};

const NEXT_PAGE_URL = '../innsending';

const getTypeString = (type: CaseType): string => {
  switch (type) {
    case CaseType.KLAGE:
      return 'klage';
    case CaseType.ANKE:
      return 'anke';
    case CaseType.ETTERSENDELSE_KLAGE:
    case CaseType.ETTERSENDELSE_ANKE:
      return 'ettersendelse';
  }
};
