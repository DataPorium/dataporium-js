// Tests for the client. They never call the real API: a fake fetch stands in for it.
import assert from "node:assert/strict";
import { test } from "node:test";
import { createRequire } from "node:module";

import {
  APIConnectionError,
  AuthenticationError,
  DataPorium,
  MissingAPIKeyError,
  NotFoundError,
  PermissionDeniedError,
  RateLimitError,
  ServerError,
  UnknownEndpointError,
  rows,
} from "../dist/esm/index.js";

function answer(status, body, headers = {}) {
  const text = typeof body === "string" ? body : JSON.stringify(body);
  return {
    status,
    statusText: "reason",
    headers: { get: (name) => headers[name.toLowerCase()] ?? null },
    text: async () => text,
  };
}

function make(answers, options = {}) {
  const calls = [];
  const queue = [...answers];
  const fetch = async (url, init) => {
    calls.push({ url: new URL(url), init });
    const next = queue.shift();
    if (next instanceof Error) throw next;
    return next;
  };
  const dp = new DataPorium({ apiKey: "test-key", fetch, ...options });
  const slept = [];
  dp.sleep = async (ms) => { slept.push(ms); };
  return { dp, calls, slept };
}

test("needs a key", () => {
  const saved = process.env.DATAPORIUM_API_KEY;
  delete process.env.DATAPORIUM_API_KEY;
  try {
    assert.throws(() => new DataPorium({ fetch: async () => {} }), MissingAPIKeyError);
  } finally {
    if (saved !== undefined) process.env.DATAPORIUM_API_KEY = saved;
  }
});

test("reads the key from the environment", async () => {
  process.env.DATAPORIUM_API_KEY = "env-key";
  try {
    let seen;
    const dp = new DataPorium({ fetch: async (url, init) => { seen = init.headers.apikey; return answer(200, {}); } });
    await dp.companyInfo({ symbol: "AAPL" });
    assert.equal(seen, "env-key");
  } finally {
    delete process.env.DATAPORIUM_API_KEY;
  }
});

test("sends the key in a header, never in the address or JSON", async () => {
  const { dp, calls } = make([answer(200, { symbol: "AAPL" })]);
  assert.deepEqual(await dp.companyInfo({ symbol: "AAPL" }), { symbol: "AAPL" });
  const { url, init } = calls[0];
  assert.equal(url.origin + url.pathname, "https://api.dataporium.io/company-info");
  assert.equal(url.searchParams.get("symbol"), "AAPL");
  assert.equal(url.searchParams.has("apikey"), false);
  assert.equal(init.headers.apikey, "test-key");
  assert.equal(JSON.stringify(dp).includes("test-key"), false);
});

test("cleans values", async () => {
  const { dp, calls } = make([answer(200, {}), answer(200, {})]);
  await dp.properties({ zip: [92602, 92603], price_cut: true, new_construction: false, beds_min: 3, city: undefined, county: null });
  assert.deepEqual(Object.fromEntries(calls[0].url.searchParams), {
    zip: "92602,92603", price_cut: "true", new_construction: "false", beds_min: "3",
  });
  await dp.treasuryYields({ date_from: new Date(Date.UTC(2024, 0, 1)), maturity: ["2y", "10y"] });
  assert.deepEqual(Object.fromEntries(calls[1].url.searchParams), { date_from: "2024-01-01", maturity: "2y,10y" });
});

test("encodes index tickers", async () => {
  const { dp, calls } = make([answer(200, [])]);
  await dp.stockPrice1d({ ticker: "^GSPC" });
  assert.ok(calls[0].url.href.endsWith("/stock-price-1d?ticker=%5EGSPC"));
});

test("fills path parameters", async () => {
  const { dp, calls } = make([answer(200, {})]);
  await dp.layoffsCompanyTicker({ ticker: "MSFT" });
  assert.equal(calls[0].url.href, "https://api.dataporium.io/layoffs/company/MSFT");
  await assert.rejects(dp.call("layoffsCompanyTicker", {}), TypeError);
});

test("calls any path and accepts snake_case names", async () => {
  const { dp, calls } = make([answer(200, [1, 2]), answer(200, {})]);
  assert.deepEqual(await dp.get("company-info", { symbol: "AAPL" }), [1, 2]);
  assert.equal(calls[0].url.pathname, "/company-info");
  await dp.call("company_info", { symbol: "AAPL" });
  assert.equal(calls[1].url.pathname, "/company-info");
});

for (const [status, ErrorClass] of [[401, AuthenticationError], [403, PermissionDeniedError], [404, NotFoundError]]) {
  test(`${status} is not retried`, async () => {
    const { dp, calls } = make([answer(status, { detail: "nope" })]);
    await assert.rejects(dp.companyInfo({ symbol: "AAPL" }), (error) => {
      assert.ok(error instanceof ErrorClass);
      assert.equal(error.status, status);
      assert.equal(error.detail, "nope");
      return true;
    });
    assert.equal(calls.length, 1);
  });
}

test("rate limit is retried, honouring Retry-After", async () => {
  const { dp, slept } = make([answer(429, { detail: "slow down" }, { "retry-after": "3" }), answer(200, { ok: true })]);
  assert.deepEqual(await dp.companyInfo({ symbol: "AAPL" }), { ok: true });
  assert.deepEqual(slept, [3000]);
});

test("server error after the retries run out", async () => {
  const { dp, calls } = make([answer(503, "down"), answer(503, "down"), answer(503, "down")]);
  await assert.rejects(dp.companyInfo({ symbol: "AAPL" }), ServerError);
  assert.equal(calls.length, 3);
});

test("rate limit error without retries", async () => {
  const { dp } = make([answer(429, { detail: "slow down" })], { maxRetries: 0 });
  await assert.rejects(dp.companyInfo({ symbol: "AAPL" }), RateLimitError);
});

test("network error does not leak the key", async () => {
  const boom = new TypeError("failed for apikey=test-key");
  const { dp } = make([boom, boom, boom]);
  await assert.rejects(dp.companyInfo({ symbol: "AAPL" }), (error) => {
    assert.ok(error instanceof APIConnectionError);
    assert.equal(error.message.includes("test-key"), false);
    return true;
  });
});

test("unknown endpoint", async () => {
  const { dp } = make([]);
  await assert.rejects(dp.call("notARealEndpoint"), UnknownEndpointError);
  assert.throws(() => dp.describe("notARealEndpoint"), UnknownEndpointError);
});

test("discovery", () => {
  const { dp } = make([]);
  assert.ok(dp.endpoints().length > 150);
  assert.ok(dp.endpoints("treasury").some((e) => e.method === "treasuryYields"));
  const fx = dp.describe("fx");
  assert.equal(fx.path, "/fx");
  assert.ok(fx.params.some((p) => p.name === "currency_conversion"));
  assert.equal(dp.describe("company_info").method, "companyInfo");
});

test("rows finds nested rows", () => {
  const prices = [{ ticker: "AAPL", price_history: [{ date: "2026-01-02", close: 1 }, { date: "2026-01-01", close: 2 }] }];
  assert.deepEqual(rows(prices).map((r) => r.close), [1, 2]);
  assert.deepEqual(rows(prices, "price_history").map((r) => r.date), ["2026-01-02", "2026-01-01"]);
  const periods = [
    { fiscal_year_qtr: "2024Q2", income_statement: [{ metric: "Total Revenue", value: 10 }] },
    { fiscal_year_qtr: "2024Q1", income_statement: [{ metric: "Total Revenue", value: 9 }] },
  ];
  assert.equal(rows(periods).length, 2);
  assert.deepEqual(rows(periods, "income_statement").map((r) => r.value), [10, 9]);
  assert.deepEqual(rows({ total: 2, rows: [{ a: 1 }, { a: 2 }] }).length, 2);
  assert.throws(() => rows(prices, "missing"), TypeError);
});

test("works with require()", () => {
  const require = createRequire(import.meta.url);
  const cjs = require("../dist/cjs/index.js");
  assert.equal(typeof cjs.DataPorium, "function");
  assert.equal(new cjs.DataPorium({ apiKey: "k", fetch: async () => {} }).describe("fx").path, "/fx");
});
