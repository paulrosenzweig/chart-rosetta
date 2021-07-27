import { fetchDataset } from "/chart-rosetta/data/util.js";
import * as d3 from "/chart-rosetta/esm-deps/d3.js";

const data = await fetchDataset("penguins.json");
export default data;

export const binnedByMass = d3
  .bin()(data.map((d) => d["Body Mass (g)"]))
  .map((bin) => ({ start: bin.x0, end: bin.x1, count: bin.length }));
