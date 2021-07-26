import * as d3 from "./esm-deps/d3.js";
import * as echarts from "./esm-deps/echarts.js";
import vegaEmbed from "./esm-deps/vega-embed.js";
import { maxPriceForTicker as data } from "./data/stocks.js";

export async function plotECharts(element) {
  const option = {
    xAxis: {
      type: "category",
      axisLabel: { interval: 0, rotate: 45 },
    },
    yAxis: {},
    series: { type: "bar", data: data.map((d) => [d.symbol, d.maxPrice]) },
    animation: false,
  };

  echarts.init(element).setOption(option);
}

export async function plotD3(element) {
  const { width, height } = element.getBoundingClientRect();
  const margin = 70;

  const x = d3
    .scaleBand()
    .domain(data.map((d) => d.symbol))
    .rangeRound([margin, width - margin])
    .padding(0.25);
  const y = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d.maxPrice)])
    .rangeRound([height - margin, margin])
    .nice();

  const svg = d3.create("svg").attr("viewBox", `0 0 ${width} ${height}`);

  const yAxis = svg
    .append("g")
    .attr("transform", `translate(${margin}, 0)`)
    .call(d3.axisLeft(y));

  yAxis.select(".domain").remove();
  yAxis
    .selectAll(".tick line")
    .attr("x2", x.range()[1] - x.range()[0])
    .attr("stroke", "lightgray");

  const xAxis = svg
    .append("g")
    .attr("transform", `translate(0, ${height - margin})`)
    .call(d3.axisBottom(x));

  xAxis
    .selectAll(".tick text")
    .attr("transform", "translate(-7, -3) rotate(-45)")
    .attr("text-anchor", "end");
  xAxis.selectAll(".tick line").remove();
  for (const tick of x.domain().slice(1)) {
    xAxis
      .append("line")
      .attr("y2", 4)
      .attr("stroke", "currentColor")
      .attr(
        "transform",
        `translate(${x(tick) - (x.step() * x.paddingInner()) / 2},0)`
      );
  }

  for (const d of data) {
    svg
      .append("rect")
      .attr("x", x(d.symbol))
      .attr("y", y(d.maxPrice))
      .attr("height", y(0) - y(d.maxPrice))
      .attr("width", x.bandwidth())
      .attr("fill", "steelblue");
  }

  element.append(svg.node());
}

export async function plotVega(element) {
  const spec = {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    width: "container",
    height: "container",
    padding: 45,
    data: { values: data },
    mark: { type: "bar" },
    config: {
      view: { stroke: "transparent" },
    },
    encoding: {
      x: {
        field: "symbol",
        type: "ordinal",
        sort: null,
        axis: {
          title: false,
          labelAngle: -45,
          tickBand: "extent",
          grid: false,
        },
      },
      y: {
        field: "maxPrice",
        type: "quantitative",
        axis: {
          title: false,
          tickCount: 10,
          ticks: false,
          domain: false,
        },
      },
    },
  };
  await vegaEmbed(element, spec);
}
