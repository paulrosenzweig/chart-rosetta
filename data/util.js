import datasets from "/chart-rosetta/esm-deps/vega-datasets.js";
import * as d3 from "/chart-rosetta/esm-deps/d3.js";

function getUrl(name) {
  const url = datasets[name].url;
  if (location.host.match(/^localhost(:\d+)?$/) !== null) {
    // if we're running locally, grab the local file
    return url
      .replace("https://vega.github.io", "/chart-rosetta/node_modules")
      .replace(
        "https://cdn.jsdelivr.net/npm/vega-datasets@2.2.0",
        "/chart-rosetta/node_modules/vega-datasets"
      );
  }
  return url;
}

export async function fetchDataset(name) {
  const result = await fetch(getUrl(name));

  if (name.endsWith(".json")) {
    return result.json();
  } else if (name.endsWith(".csv")) {
    return d3.csvParse(await result.text(), d3.autoType);
  } else {
    return result.text();
  }
}
