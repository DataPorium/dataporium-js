# DataPorium JavaScript and TypeScript client

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

The official JavaScript and TypeScript client for the [DataPorium](https://dataporium.tech) Data API, a REST financial data API with real-time and historical market data across stocks, ETFs, crypto, forex and commodities, plus company fundamentals, news, the US economy and US housing.

The API has 203 endpoints in 42 categories, and every one of them is a typed method on the client. You use your own API key:

```js
import { DataPorium } from "dataporium";

const dp = new DataPorium({ apiKey: "YOUR_API_KEY" });

const profile = await dp.companyInfo({ symbol: "AAPL" });          // company profile
const prices = await dp.stockPrice1d({ ticker: "AAPL" });          // daily prices (stocks, ETFs, indexes, crypto)
const curve = await dp.treasuryYieldsCurve();                      // US Treasury yield curve
const homes = await dp.properties({ zip: "92602", beds_min: 3 });  // homes for sale in a ZIP code
```

The same data is available to AI assistants through the [DataPorium MCP server](#use-dataporium-with-ai-assistants-mcp), with the same key. There is also a [Python client](https://github.com/DataPorium/dataporium-python) and [examples in other languages](https://github.com/DataPorium/financial-data-api).

## Install

```bash
npm install github:DataPorium/dataporium-js
```

Node.js 18 or newer. The library has no runtime dependencies; it uses the built-in `fetch`. It works with `import` and `require`, and ships its own TypeScript types.

## Get an API key

1. Sign up at [dataporium.tech](https://dataporium.tech/pricing).
2. Subscribe to the Premium plan. It includes the REST API (600 calls per minute) and the MCP server with the same key. The [pricing page](https://dataporium.tech/pricing) has the current price.
3. Your API key is in your account settings once you subscribe.

The safest way to give the key to the library is an environment variable, so it never ends up in your code:

```bash
export DATAPORIUM_API_KEY="YOUR_API_KEY"     # macOS and Linux
setx DATAPORIUM_API_KEY "YOUR_API_KEY"       # Windows
```

```js
const dp = new DataPorium();   // reads DATAPORIUM_API_KEY
```

The API accepts the key in an `apikey` request header or as a `?apikey=` query parameter. The header is recommended, because a key in a URL can end up in server and proxy logs. This library always uses the header.

**Use the library on a server, not in a web page.** Code that runs in a browser is visible to every visitor, so your key would be too. Call the API from your own backend, a serverless function or a script, and send only the results to the browser.

## CommonJS

```js
const { DataPorium } = require("dataporium");
```

## What you can get

| Area | Examples | Methods to start with |
|---|---|---|
| Stocks, ETFs, indexes and crypto | Daily and 5-minute prices, performance, news | `stockPrice1d`, `stockPrice5m`, `gainLoss`, `stockNews` |
| Companies | Profile, business segments, SEC filings, earnings transcripts, insiders, shareholders, short interest, options | `companyInfo`, `businessSegments`, `secFilings`, `shortInterest` |
| Financial statements | Income statement, balance sheet, cash flow | `incomeStatements`, `balanceSheetStatements`, `cashFlowStatements` |
| Forex and commodities | Currency pairs, gold, oil and other futures, futures positioning | `fx`, `commodityPrice1d`, `futuresPositioning` |
| US economy | GDP, inflation, jobs, Treasury yields, Fed decisions, trade | `economicMetrics`, `treasuryYields`, `fedDecisions` |
| US housing | Homes for sale, pending, for rent and sold, price cuts, property tax, mortgage lending | `properties`, `realestatePriceChanges`, `propertyTax` |
| Local economy and layoffs | Jobs, pay, building permits and migration by area; layoff notices by company, state and industry | `localJobs`, `localWages`, `layoffsEvents` |
| Government and politics | Stock trades reported by members of Congress, federal contracts, lobbying, US election results | `politicianTrades`, `governmentContracts`, `lobbying`, `electionsResults` |
| Industries | Healthcare providers, banks, energy, transportation, agriculture, colleges, recalls and more | `healthcareHospitals`, `banks`, `electricityRates` |

The full list is in [docs/endpoints.md](docs/endpoints.md).

## Method and parameter names

Method names are the API paths in camelCase: `/company-info` is `dp.companyInfo(...)`, and `/treasury-yields/curve` is `dp.treasuryYieldsCurve(...)`.

Parameter names are the API's own, exactly as in the [API documentation](https://dataporium.tech/api-docs), so they stay in snake_case: `{ economic_metrics: "GDP" }`, `{ beds_min: 3 }`. In TypeScript every method knows its parameters, so your editor completes them and flags a misspelled name.

The library converts JavaScript values for you:

| You pass | The API receives |
|---|---|
| `true` / `false` | `true` / `false` |
| `["2y", "10y"]` | `2y,10y` |
| `new Date(Date.UTC(2024, 0, 1))` | `2024-01-01` (the UTC date) |
| `undefined` or `null` | nothing (the parameter is left out) |

```js
const yields = await dp.treasuryYields({
  maturity: ["2y", "10y"],
  date_from: "2024-01-01",
  frequency: "monthly",
  order: "asc",
});
```

## Find an endpoint

```js
for (const endpoint of dp.endpoints("treasury")) {
  console.log(endpoint.method, "-", endpoint.summary);
}

console.log(dp.describe("treasuryYields"));   // path, parameters and examples
```

If the API gains a path that this version of the library does not list yet, call it directly:

```js
await dp.get("/some-new-path", { symbol: "AAPL" });
```

## Answers

Every endpoint returns structured JSON, which you get back as plain objects and arrays. The fields differ between endpoints, so log an answer once to see what it holds. The [API documentation](https://dataporium.tech/api-docs) describes every endpoint.

```js
const [record] = await dp.stockPrice1d({ ticker: "AAPL" });
console.log(record.name, record.regular_market_price);
console.log(record.price_history[0]);        // newest daily bar: date, open, high, low, close, volume

const rates = await dp.economicMetrics({ economic_metrics: "federal_Funds" });
console.log(rates[0].date, rates[0].value);  // newest value
```

`rows()` finds the list of rows in an answer, including rows nested inside a record:

```js
import { DataPorium, rows } from "dataporium";

const bars = rows(await dp.stockPrice1d({ ticker: "AAPL" }), "price_history");
const lines = rows(await dp.incomeStatementsSummary({ symbol: "AAPL", fiscal_year_qtr: "2025Q4" }), "income_statement");
```

## Examples

Crypto uses the same price method, with `-USD` after the symbol:

```js
const [bitcoin] = await dp.stockPrice1d({ ticker: "BTC-USD" });
console.log(bitcoin.price_history[0].close);
```

The latest lines of a company's income statement:

```js
const [period] = await dp.incomeStatementsSummary({ symbol: "AAPL", fiscal_year_qtr: "2025Q4" });
const lines = Object.fromEntries(period.income_statement.map((line) => [line.metric, line.value]));
console.log(period.period_end, lines["Total Revenue"], lines["Net Income"]);
```

The yield curve today compared with a month and a year ago:

```js
const { curves } = await dp.treasuryYieldsCurve({ compare: ["1m", "1y"] });
for (const c of curves) console.log(c.label, c.date, c.spread_10y_2y, c.inverted_10y_2y);
```

Homes with a recent price cut:

```js
const homes = await dp.properties({
  city: "Irvine",
  state: "CA",
  price_cut: true,
  price_cut_within_days: 7,
  sort: "biggest_cut",
  limit: 25,
});
```

Runnable scripts are in [examples/](examples).

## Errors and retries

```js
import { DataPorium, DataPoriumError, PermissionDeniedError, RateLimitError } from "dataporium";

try {
  const data = await dp.companyInfo({ symbol: "AAPL" });
} catch (error) {
  if (error instanceof PermissionDeniedError) {
    console.log("The API key is not valid, has expired, or the subscription is not active.");
  } else if (error instanceof RateLimitError) {
    console.log("Too many requests. The limit is 600 requests per minute.");
  } else if (error instanceof DataPoriumError) {
    console.log("Request failed:", error.message);
  } else {
    throw error;
  }
}
```

| Error | HTTP status | Meaning |
|---|---|---|
| `MissingAPIKeyError` | none | No key was given and `DATAPORIUM_API_KEY` is not set |
| `AuthenticationError` | 401 | API key required. The request had no API key |
| `PermissionDeniedError` | 403 | Invalid or expired API key, or subscription inactive |
| `NotFoundError` | 404 | The path does not exist |
| `RateLimitError` | 429 | Rate limit exceeded. The maximum is 600 requests per minute |
| `ServerError` | 500 and above | Internal server error. Try again or contact support |
| `APIConnectionError` | none | No answer (network problem or timeout) |

All of them extend `DataPoriumError`. The API errors carry `status`, `detail` (the API's message) and `body`.

Rate-limit answers, server errors and network problems are retried automatically, twice by default, waiting 1 and then 2 seconds (or as long as the API's `Retry-After` header asks). Change this with `new DataPorium({ maxRetries: 5 })`, or switch it off with `maxRetries: 0`. Each request waits up to 30 seconds by default: `new DataPorium({ timeout: 60_000 })`.

## Use DataPorium with AI assistants (MCP)

DataPorium runs a Model Context Protocol (MCP) server with 46 tools. Connect it once and Claude, ChatGPT, Claude Code, Cursor, Gemini CLI and other MCP clients can query the same data in plain language, with the same API key and no code:

```
https://mcp.dataporium.io/mcp
```

The setup for each app is on the [MCP page](https://dataporium.tech/mcp) and in [dataporium-mcp](https://github.com/DataPorium/dataporium-mcp).

## Keep your key safe

- Do not put the key in code that you commit or share. Use the environment variable.
- Do not put the key in a web page or a mobile app. Call the API from your own server.
- If a key leaks, create a new key in your account settings. The old one stops working.

## Development

```bash
git clone https://github.com/DataPorium/dataporium-js.git
cd dataporium-js
npm install
npm test
```

The tests never call the real API. `src/endpoints.ts`, `src/generated.ts` and `docs/endpoints.md` are generated from the public OpenAPI file; run `npm run generate` to refresh them after the API changes.

## Links

- Website: <https://dataporium.tech>
- API documentation: <https://dataporium.tech/api-docs>
- MCP server: <https://dataporium.tech/mcp>
- Pricing: <https://dataporium.tech/pricing>
- Python client: <https://github.com/DataPorium/dataporium-python>
- Examples in other languages: <https://github.com/DataPorium/financial-data-api>
- Questions: [open an issue](https://github.com/DataPorium/dataporium-js/issues) or write to info@dataporium.tech

## License and disclaimer

The code in this repository is released under the [MIT License](LICENSE). Use of the API and its data is governed by the DataPorium [Terms of Use](https://dataporium.tech/terms-of-use).

Data is for information only and is not investment advice.
