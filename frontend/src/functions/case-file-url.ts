import type { Languages } from '@app/language/types';

// Served by the server, which streams the file or shows an error page. Opened in a new tab.

export const getAttachmentUrl = (lang: Languages, caseId: string, attachmentId: string): string =>
  `/${lang}/sak/${caseId}/vedlegg/${attachmentId}`;

/** The case PDF. After the case is sent in, this is the journalført PDF. */
export const getCasePdfUrl = (lang: Languages, caseId: string): string => `/${lang}/sak/${caseId}/pdf`;

/** The case PDF with a cover page, for sending in by post. */
export const getCaseInnsendingPdfUrl = (lang: Languages, caseId: string): string =>
  `/${lang}/sak/${caseId}/pdf/innsending`;
