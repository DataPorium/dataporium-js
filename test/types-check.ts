// Compiled with `tsc --noEmit` by `npm test` to check the method types.
import { DataPorium } from "../src/index.js";

const dp = new DataPorium({ apiKey: "k" });

async function check(): Promise<void> {
  await dp.companyInfo({ symbol: "AAPL" });
  await dp.stockPrice1d({ ticker: "^GSPC" });
  await dp.treasuryYields({ maturity: ["2y", "10y"], date_from: new Date(), limit: 100 });
  await dp.properties({ zip: "92602", price_cut: true });
  await dp.layoffsCompanyTicker({ ticker: "MSFT" });
  await dp.futuresPositioning({ market: "gold", from: "2024-01-01" });
  await dp.get("/anything", { whatever: 1 });

  // @ts-expect-error unknown parameter name
  await dp.companyInfo({ symbl: "AAPL" });
  // @ts-expect-error a path parameter is required
  await dp.layoffsCompanyTicker({});
  // @ts-expect-error unknown method
  await dp.notARealEndpoint();
}

void check;
