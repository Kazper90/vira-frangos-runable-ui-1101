/**
 * Every service response is wrapped in an envelope that declares its provenance,
 * so the UI can always tell the user whether information is real or mock.
 */

export type DataSource = "MOCK" | "API";

export interface ResponseMeta {
  source: DataSource;
  /** ISO timestamp the payload was produced by its source. */
  generatedAt: string;
}

export interface Envelope<T> {
  data: T;
  meta: ResponseMeta;
}

/** Typed service errors so the UI can choose the correct state. */
export type ServiceErrorKind = "NOT_FOUND" | "UNAVAILABLE" | "NOT_CONNECTED" | "UNKNOWN";

export class ServiceError extends Error {
  readonly kind: ServiceErrorKind;
  constructor(kind: ServiceErrorKind, message: string) {
    super(message);
    this.name = "ServiceError";
    this.kind = kind;
  }
}

export function isServiceError(e: unknown): e is ServiceError {
  return e instanceof ServiceError;
}
