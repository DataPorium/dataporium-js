# Changelog

## 0.1.0

First release.

- `DataPorium` client: every endpoint of the DataPorium Data API is a typed method.
- API key from the `apiKey` option or the `DATAPORIUM_API_KEY` environment variable, sent as a header.
- Typed errors, with automatic retries for rate limits, server errors and network problems.
- `endpoints()` and `describe()` to explore the API from code.
- `rows()` helper to find the rows in an answer.
- Works with `import` and `require` on Node.js 18 or newer.
