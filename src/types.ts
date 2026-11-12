/** A value the API accepts for a parameter. Arrays are sent comma-separated and dates as YYYY-MM-DD. */
export type QueryValue = string | number | boolean | Date | ReadonlyArray<string | number> | null;

/** One parameter of an endpoint. */
export interface Parameter {
  readonly name: string;
  /** "query" or "path" */
  readonly in: string;
  readonly description: string;
  readonly example?: unknown;
}

/** One endpoint of the API, as listed in the public OpenAPI file. */
export interface Endpoint {
  /** Name in the API reference, for example "company_info". */
  readonly name: string;
  readonly path: string;
  readonly summary: string;
  readonly description: string;
  readonly category: string;
  readonly params: ReadonlyArray<Parameter>;
}
