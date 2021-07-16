import { h, Component, render } from "/esm-deps/preact.js";
import * as d3 from "/esm-deps/d3.js";
import * as charts from "/charts/index.js";

function plotChart(chartName, versionName) {
  const container = document.querySelector("#chart");
  for (const { name } of container.attributes) {
    if (name !== "id" && name !== "style") {
      container.removeAttribute(name);
    }
  }
  while (container.firstChild) container.firstChild.remove();
  return charts[chartName][versionName](container);
}

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

render(h(ChartList, { charts }), document.querySelector("#list"));
