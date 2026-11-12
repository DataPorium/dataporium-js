// Today's US Treasury yield curve next to the curve one month and one year ago.
//
//   export DATAPORIUM_API_KEY="YOUR_API_KEY"
//   node examples/yield-curve.mjs
import { DataPorium } from "dataporium";

const dp = new DataPorium();
const answer = await dp.treasuryYieldsCurve({ compare: ["1m", "1y"] });

console.log("As of:", answer.as_of);
for (const curve of answer.curves ?? []) {
  console.log(`${curve.label} (${curve.date}): 10y-2y spread ${curve.spread_10y_2y}, inverted: ${curve.inverted_10y_2y}`);
}
