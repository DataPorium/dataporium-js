// First request: a company profile.
//
//   export DATAPORIUM_API_KEY="YOUR_API_KEY"
//   node examples/quickstart.mjs AAPL
import { DataPorium, DataPoriumError } from "dataporium";

const symbol = process.argv[2] ?? "AAPL";
const dp = new DataPorium(); // reads DATAPORIUM_API_KEY

try {
  const profile = await dp.companyInfo({ symbol });
  console.log(JSON.stringify(profile, null, 2).slice(0, 3000));
} catch (error) {
  if (error instanceof DataPoriumError) {
    console.error("Request failed:", error.message);
    process.exit(1);
  }
  throw error;
}
