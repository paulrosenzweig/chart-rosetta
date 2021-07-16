import datasets from "/esm-deps/vega-datasets.js";

function localUrl(url) {
  return url
    .replace("https://vega.github.io", "/node_modules")
    .replace(
      "https://cdn.jsdelivr.net/npm/vega-datasets@2.2.0",
      "/node_modules/vega-datasets"
    );
}

const response = await fetch(localUrl(datasets["cars.json"].url));
export default await response.json();
