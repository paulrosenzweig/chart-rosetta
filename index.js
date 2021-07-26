import { h, Component, render } from "/chart-rosetta/esm-deps/preact.js";
import * as d3 from "/chart-rosetta/esm-deps/d3.js";
import * as charts from "/chart-rosetta/charts/index.js";

function ChartItem({ name, versions }) {
  return h(
    "div",
    null,
    h("h3", null, name),
    h(
      "ul",
      null,
      ...Object.entries(versions).map(([versionName]) => {
        const onClick = (e) => {
          plotChart(name, versionName);
          e.preventDefault();
        };
        return h("li", null, h("a", { onClick }, versionName));
      })
    )
  );
}

function ChartList({ charts }) {
  return h(
    "div",
    null,
    ...Object.entries(charts).map(([name, versions]) =>
      h(ChartItem, { name, versions })
    )
  );
}

const PARAM_NAME = "chart";

function setQueryParam(chartName, versionName) {
  const search = new URLSearchParams(location.search);
  search.set(PARAM_NAME, [chartName, versionName].join(":"));
  const url = new URL(location);
  url.search = search;
  window.history.pushState({}, document.title, url.toString());
}

function plotFromQueryParam() {
  const search = new URLSearchParams(location.search);
  const paramValue = search.get(PARAM_NAME);
  if (paramValue !== null) {
    const [chartName, versionName] = paramValue.split(":");
    plotChart(chartName, versionName);
  }
}

function plotChart(chartName, versionName) {
  setQueryParam(chartName, versionName);
  const container = document.querySelector("#chart");
  for (const { name } of container.attributes) {
    if (name !== "id" && name !== "style") {
      container.removeAttribute(name);
    }
  }
  while (container.firstChild) container.firstChild.remove();
  return charts[chartName][versionName](container);
}

render(h(ChartList, { charts }), document.querySelector("#list"));
plotFromQueryParam();
