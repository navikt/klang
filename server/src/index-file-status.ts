/** Client error status codes klang can respond with for case files: from klage-dittnav-api, or 404 for invalid IDs. */
const KNOWN_CLIENT_ERROR_STATUSES = [400, 403, 404, 410] as const;

type KnownClientErrorStatus = (typeof KNOWN_CLIENT_ERROR_STATUSES)[number];

/** Index HTML variant for other client errors. The response keeps the real status code. */
export const UNKNOWN_CLIENT_ERROR = 'client_error';

type UnknownClientError = typeof UNKNOWN_CLIENT_ERROR;

/** Variants of the index HTML, by the value of the `data-status` attribute on `<html>`. */
export const INDEX_FILE_STATUSES = [200, ...KNOWN_CLIENT_ERROR_STATUSES, 502, UNKNOWN_CLIENT_ERROR] as const;

export type IndexFileStatus = (typeof INDEX_FILE_STATUSES)[number];

export const isClientErrorStatus = (statusCode: number): boolean => statusCode >= 400 && statusCode <= 499;

const isKnownClientErrorStatus = (statusCode: number): statusCode is KnownClientErrorStatus =>
  KNOWN_CLIENT_ERROR_STATUSES.some((status) => status === statusCode);

/** The index HTML variant for a client error status code. */
export const getClientErrorIndexFileStatus = (statusCode: number): KnownClientErrorStatus | UnknownClientError =>
  isKnownClientErrorStatus(statusCode) ? statusCode : UNKNOWN_CLIENT_ERROR;
