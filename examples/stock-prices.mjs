// The last ten daily bars of a stock, ETF, index or cryptocurrency.
//
//   export DATAPORIUM_API_KEY="YOUR_API_KEY"
//   node examples/stock-prices.mjs SPY        # or ^GSPC for the S&P 500, BTC-USD for bitcoin
import { DataPorium, rows } from "dataporium";

const ticker = process.argv[2] ?? "AAPL";
const dp = new DataPorium();

const bars = rows(await dp.stockPrice1d({ ticker }), "price_history");
console.log(`${ticker}: ${bars.length} daily bars`);
console.table(bars.slice(0, 10).map(({ date, open, high, low, close, volume }) => ({ date, open, high, low, close, volume })));
