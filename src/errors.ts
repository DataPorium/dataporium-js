/** Base class for every error thrown by this library. */
export class DataPoriumError extends Error {
  constructor(message: string) {
    super(message);
    this.name = new.target.name;
  }
}

/** No API key was given and DATAPORIUM_API_KEY is not set. */
export class MissingAPIKeyError extends DataPoriumError {}

/** The method name is not in the endpoint list shipped with this library. */
export class UnknownEndpointError extends DataPoriumError {}

/** The request never got an answer (network problem or timeout). */
export class APIConnectionError extends DataPoriumError {}

/** The API answered with an error status. */
export class APIError extends DataPoriumError {
  /** HTTP status of the answer. */
  readonly status: number;
  /** The "detail" text sent by the API, when there is one. */
  readonly detail: string;
  /** The decoded answer body, for debugging. */
  readonly body: unknown;

  constructor(status: number, detail: string, body?: unknown) {
    super(`HTTP ${status}: ${detail}`);
    this.status = status;
    this.detail = detail;
    this.body = body;
  }
}

/** 401: the request had no API key. */
export class AuthenticationError extends APIError {}
/** 403: the API key is not valid, has expired, or the subscription is not active. */
export class PermissionDeniedError extends APIError {}
/** 404: the path does not exist. */
export class NotFoundError extends APIError {}
/** 429: more than 600 requests in a minute. */
export class RateLimitError extends APIError {}
/** 500 and above: the API had a problem. These are retried automatically before this is thrown. */
export class ServerError extends APIError {}

export function errorForStatus(status: number, detail: string, body: unknown): APIError {
  switch (status) {
    case 401: return new AuthenticationError(status, detail, body);
    case 403: return new PermissionDeniedError(status, detail, body);
    case 404: return new NotFoundError(status, detail, body);
    case 429: return new RateLimitError(status, detail, body);
    default: return status >= 500 ? new ServerError(status, detail, body) : new APIError(status, detail, body);
  }
}
