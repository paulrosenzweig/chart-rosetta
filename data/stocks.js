import { fetchDataset } from "/data/util.js";
import * as d3 from "/esm-deps/d3.js";

const data = await fetchDataset("stocks.csv");
export default data;

export const maxPriceForTicker = d3
  .flatRollup(
    data,
    (v) => d3.max(v, (d) => d.price),
    (d) => d.symbol
  )
  .map(([symbol, maxPrice]) => ({ symbol, maxPrice }));
