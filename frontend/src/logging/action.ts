export enum AppEventEnum {
  ATTACHMENT_DELETE = 'Delete attachment',
  ATTACHMENT_DOWNLOAD = 'Download attachment',
  CASE_CREATE_FROM_SESSION_STORAGE = 'Create case from session storage',
  CASE_CREATE_OR_RESUME = 'Create or resume case',
  CASE_CREATE_SESSION = 'Create session case',
  CASE_DELETE = 'Delete case',
  CASE_DOWNLOAD = 'Click download button',
  CASE_FINALIZE_CLICK = 'Click finalize button',
  CASE_FINALIZE_DONE = 'Case finalized',
  CASE_INVALID = 'Invalid case data',
  CASE_JOURNALFØRT = 'Case journalført',
  CASE_RESUME_SESSION = 'Resume session case',
  CASE_RESUME_SESSION_WITH_SAKSNUMMER = 'Resume session case with internal saksnummer',
  CASE_SUBMIT = 'Click submit button',
  CASE_VALID = 'Valid case data',
  CLEAR_ERRORS = 'Clear errors',
  SESSION_UPGRADE = 'Upgrade session',
  SSE_CLOSE = 'SSE close',
  SSE_ERROR = 'SSE error',
  SSE_EVENT_RECEIVED = 'SSE event received',
  SSE_OPEN = 'SSE open',
  UPLOAD_FILES_CLICK = 'Click upload attachment',
  UPLOAD_FILES_DONE = 'Done uploading files',
  UPLOAD_FILES_START = 'Start uploading files',
  USER_LOGIN = 'Login',
}
