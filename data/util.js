import datasets from "/esm-deps/vega-datasets.js";
import * as d3 from "/esm-deps/d3.js";

function localUrl(url) {
  return url
    .replace("https://vega.github.io", "/node_modules")
    .replace(
      "https://cdn.jsdelivr.net/npm/vega-datasets@2.2.0",
      "/node_modules/vega-datasets"
    );
}

export async function fetchDataset(name) {
  const result = await fetch(localUrl(datasets[name].url));

  if (name.endsWith(".json")) {
    return result.json();
  } else if (name.endsWith(".csv")) {
    return d3.csvParse(await result.text(), d3.autoType);
  } else {
    return result.text();
  }
}
