import { fetchDataset } from "/data/util.js";
import * as d3 from "/esm-deps/d3.js";

const rawData = await fetchDataset("movies.json");
const data = rawData.map((d) => ({
  ...d,
  "Release Date": new Date(d["Release Date"]),
}));
export default data;

function getDecade(d) {
  const year = d.getFullYear();
  const decade = 10 * Math.floor(year / 10);
  return new Date(decade, 0, 1);
}

const ratingDecadeCountsUnfiltered = d3
  .flatRollup(
    data,
    (v) => d3.sum(v, (d) => d["Worldwide Gross"]),
    (d) => getDecade(d["Release Date"]),
    (d) => d["MPAA Rating"]
  )
  .map(([decade, rating, worldwideGross]) => ({
    worldwideGross,
    decade,
    rating,
  }));

const decadeCounts = d3.rollup(
  data,
  (v) => v.length,
  (d) => getDecade(d["Release Date"])
);

export const ratingDecadeCounts = ratingDecadeCountsUnfiltered
  .filter((r) => decadeCounts.get(r.decade) > 20)
  .filter((r) => r.rating !== null);
