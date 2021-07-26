import { fetchDataset } from "/chart-rosetta/data/util.js";
import * as d3 from "/chart-rosetta/esm-deps/d3.js";

const rawData = await fetchDataset("stocks.csv");
const data = rawData.map((d) => ({ ...d, date: new Date(d.date) }));
export default data;

export const maxPriceForTicker = d3
  .flatRollup(
    data,
    (v) => d3.max(v, (d) => d.price),
    (d) => d.symbol
  )
  .map(([symbol, maxPrice]) => ({ symbol, maxPrice }));
