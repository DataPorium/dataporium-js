// Homes for sale in one ZIP code with a price cut in the last 30 days.
//
//   export DATAPORIUM_API_KEY="YOUR_API_KEY"
//   node examples/housing-search.mjs 92602
import { DataPorium } from "dataporium";

const zip = process.argv[2] ?? "92602";
const dp = new DataPorium();

const answer = await dp.properties({
  zip,
  status: "for_sale",
  price_cut: true,
  price_cut_within_days: 30,
  sort: "biggest_cut",
  limit: 10,
});
console.log(JSON.stringify(answer, null, 2).slice(0, 4000));
