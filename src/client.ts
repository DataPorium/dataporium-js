import { ENDPOINTS } from "./endpoints.js";
import { APIConnectionError, APIError, MissingAPIKeyError, UnknownEndpointError, errorForStatus } from "./errors.js";
import { DataPoriumEndpoints } from "./generated.js";
import type { Endpoint, QueryValue } from "./types.js";

export const DEFAULT_BASE_URL = "https://api.dataporium.io";
export const ENV_API_KEY = "DATAPORIUM_API_KEY";
const RETRY_STATUSES = new Set([429, 500, 502, 503, 504]);

type FetchLike = (input: string, init?: any) => Promise<any>;

export interface DataPoriumOptions {
  /** Your own API key. If left out, the DATAPORIUM_API_KEY environment variable is used (Node.js). */
  apiKey?: string;
  /** Address of the API. Change it only for testing. */
  baseUrl?: string;
  /** Milliseconds to wait for each answer. Default 30000. */
  timeout?: number;
  /** How many times a failed request is tried again (429, 5xx and network problems only). Default 2. */
  maxRetries?: number;
  /** A fetch function to use instead of the global one. */
  fetch?: FetchLike;
}

function readEnvKey(): string | undefined {
  const env = (globalThis as any).process?.env;
  return env ? env[ENV_API_KEY] : undefined;
}

function pad(n: number): string {
  return n < 10 ? `0${n}` : String(n);
}

/** Turns a JavaScript value into the text the API expects. */
export function formatValue(value: QueryValue): string {
  if (value instanceof Date) return `${value.getUTCFullYear()}-${pad(value.getUTCMonth() + 1)}-${pad(value.getUTCDate())}`;
  if (Array.isArray(value)) return value.map((v) => formatValue(v as QueryValue)).join(",");
  if (typeof value === "boolean") return value ? "true" : "false";
  return String(value);
}

function cleanParams(params: Record<string, QueryValue | undefined> = {}): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [name, value] of Object.entries(params)) {
    if (value === undefined || value === null) continue;
    out[name] = formatValue(value);
  }
  return out;
}

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/**
 * Client for the DataPorium Data API. Every endpoint is a method:
 *
 * ```ts
 * import { DataPorium } from "dataporium";
 *
 * const dp = new DataPorium();               // reads DATAPORIUM_API_KEY
 * const profile = await dp.companyInfo({ symbol: "AAPL" });
 * ```
 */
export class DataPorium extends DataPoriumEndpoints {
  readonly baseUrl: string;
  readonly timeout: number;
  readonly maxRetries: number;
  readonly #apiKey: string;
  readonly #fetch: FetchLike;
  /** Waits between retries. Replaced in tests. */
  protected sleep: (ms: number) => Promise<void> = wait;

  constructor(options: DataPoriumOptions = {}) {
    super();
    const apiKey = options.apiKey ?? readEnvKey();
    if (!apiKey) {
      throw new MissingAPIKeyError(
        `No API key. Pass new DataPorium({ apiKey }) or set the ${ENV_API_KEY} environment variable. ` +
          "Get a key at https://dataporium.tech/pricing",
      );
    }
    const fetchFn = options.fetch ?? (globalThis as any).fetch;
    if (typeof fetchFn !== "function") {
      throw new APIConnectionError("No fetch function found. Use Node.js 18 or newer, or pass new DataPorium({ fetch }).");
    }
    this.#apiKey = apiKey;
    this.#fetch = options.fetch ?? fetchFn.bind(globalThis);
    this.baseUrl = (options.baseUrl ?? DEFAULT_BASE_URL).replace(/\/+$/, "");
    this.timeout = options.timeout ?? 30_000;
    this.maxRetries = Math.max(0, Math.floor(options.maxRetries ?? 2));
  }

  /** Calls an endpoint by its method name, for example `dp.call("companyInfo", { symbol: "AAPL" })`. */
  call(method: string, params: Record<string, QueryValue | undefined> = {}): Promise<any> {
    let endpoint: Endpoint & { method: string };
    try {
      endpoint = this.describe(method);
    } catch (error) {
      return Promise.reject(error);
    }
    const query = cleanParams(params);
    let path = endpoint.path;
    for (const p of endpoint.params) {
      if (p.in !== "path") continue;
      const value = query[p.name];
      if (value === undefined) {
        return Promise.reject(new TypeError(`${endpoint.method}() needs "${p.name}", because it is part of the path ${endpoint.path}`));
      }
      path = path.replace(`{${p.name}}`, encodeURIComponent(value));
      delete query[p.name];
    }
    return this.#request(path, query);
  }

  /**
   * Calls any path of the API. `dp.get("/company-info", { symbol: "AAPL" })` is the same as
   * `dp.companyInfo({ symbol: "AAPL" })`. Use it for a path newer than this version of the library.
   */
  get(path: string, params: Record<string, QueryValue | undefined> = {}): Promise<any> {
    return this.#request("/" + path.replace(/^\/+/, ""), cleanParams(params));
  }

  /** Lists the endpoints. `search` keeps those whose method name, category or summary contains the text. */
  endpoints(search?: string): Array<Endpoint & { method: string }> {
    const all = Object.entries(ENDPOINTS).map(([method, e]) => ({ method, ...e }));
    if (!search) return all;
    const text = search.toLowerCase();
    return all.filter((e) =>
      e.method.toLowerCase().includes(text) || e.name.includes(text) ||
      e.category.toLowerCase().includes(text) || e.summary.toLowerCase().includes(text));
  }

  /** Returns one endpoint with its path and parameters. Accepts "companyInfo" or "company_info". */
  describe(method: string): Endpoint & { method: string } {
    const direct = ENDPOINTS[method];
    if (direct) return { method, ...direct };
    const found = Object.entries(ENDPOINTS).find(([, e]) => e.name === method);
    if (found) return { method: found[0], ...found[1] };
    throw new UnknownEndpointError(
      `"${method}" is not a DataPorium endpoint. Use dp.endpoints() to list them, or dp.get("/path", ...) for a path that is not in the list.`,
    );
  }

  /** Never shows the API key. */
  toJSON(): object {
    return { baseUrl: this.baseUrl, timeout: this.timeout, maxRetries: this.maxRetries };
  }

  async #request(path: string, query: Record<string, string>): Promise<any> {
    const search = new URLSearchParams(query).toString();
    const url = this.baseUrl + path + (search ? `?${search}` : "");
    const headers: Record<string, string> = {
      apikey: this.#apiKey, // sent as a header, so the key stays out of URLs and logs
      Accept: "application/json",
    };

    for (let attempt = 0; ; attempt++) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.timeout);
      let response: any;
      try {
        response = await this.#fetch(url, { method: "GET", headers, signal: controller.signal });
      } catch (error) {
        clearTimeout(timer);
        if (attempt < this.maxRetries) {
          await this.sleep(this.#delay(attempt, null));
          continue;
        }
        const reason = (error as any)?.name === "AbortError" ? "timed out" : "network error";
        throw new APIConnectionError(`Could not reach ${this.baseUrl} (${reason})`);
      }
      clearTimeout(timer);

      if (RETRY_STATUSES.has(response.status) && attempt < this.maxRetries) {
        await this.sleep(this.#delay(attempt, response.headers?.get?.("retry-after") ?? null));
        continue;
      }
      return this.#decode(response);
    }
  }

  #delay(attempt: number, retryAfter: string | null): number {
    const seconds = retryAfter === null ? NaN : Number(retryAfter);
    if (Number.isFinite(seconds) && seconds >= 0) return Math.min(seconds, 60) * 1000;
    return Math.min(2 ** attempt, 30) * 1000; // 1s, 2s, 4s ...
  }

  async #decode(response: any): Promise<any> {
    const text: string = await response.text();
    let body: unknown = text;
    try {
      body = text ? JSON.parse(text) : null;
    } catch {
      // not JSON
    }
    if (response.status < 400) {
      if (typeof body === "string") throw new APIError(response.status, "The answer was not JSON", body.slice(0, 500));
      return body;
    }
    const detail = body && typeof body === "object" && typeof (body as any).detail === "string"
      ? (body as any).detail
      : response.statusText || "Request failed";
    throw errorForStatus(response.status, detail, body);
  }
}

/**
 * Finds the list of rows in an answer. Many answers are a list of rows; some hold their rows inside a
 * record, for example the daily prices under "price_history" or paged answers under "rows".
 *
 * ```ts
 * rows(await dp.economicMetrics({ economic_metrics: "GDP" }))
 * rows(await dp.stockPrice1d({ ticker: "AAPL" }), "price_history")
 * ```
 */
export function rows(data: unknown, key?: string): any[] {
  const nested = (record: any): any[] | undefined => {
    if (!record || typeof record !== "object" || Array.isArray(record)) return undefined;
    if (key !== undefined) return Array.isArray(record[key]) ? record[key] : undefined;
    for (const name of ["rows", "data", "results", "items", "price_history"]) {
      if (Array.isArray(record[name])) return record[name];
    }
    const lists = Object.values(record).filter((v) => Array.isArray(v) && v.length > 0 && typeof v[0] === "object");
    return lists.length === 1 ? (lists[0] as any[]) : undefined;
  };

  if (Array.isArray(data)) {
    if (key !== undefined) {
      return data.flatMap((record) => {
        const found = nested(record);
        if (!found) throw new TypeError(`The answer has no list under "${key}"`);
        return found;
      });
    }
    if (data.length === 1) return nested(data[0]) ?? data;
    return data;
  }
  const found = nested(data);
  if (found) return found;
  if (key !== undefined) throw new TypeError(`The answer has no list under "${key}"`);
  return data === null || data === undefined ? [] : [data];
}
