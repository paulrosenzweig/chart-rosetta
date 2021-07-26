import * as d3 from "./esm-deps/d3.js";
import * as echarts from "./esm-deps/echarts.js";
import vegaEmbed from "./esm-deps/vega-embed.js";
import data from "./data/stocks.js";

export async function plotECharts(element) {
  const option = {
    animation: false,
    xAxis: { type: "time" },
    yAxis: { type: "value" },
    series: Array.from(new Set(data.map((d) => d.symbol))).map((symbol) => ({
      type: "line",
      showSymbol: false,
      data: data
        .filter((d) => d.symbol === symbol)
        .map((d) => [d.date, d.price]),
    })),
  };
  echarts.init(element).setOption(option);
}

export async function plotD3(element) {
  const { width, height } = element.getBoundingClientRect();
  const margin = 70;

  const x = d3
    .scaleTime()
    .domain(d3.extent(data, (d) => d.date))
    .rangeRound([margin, width - margin]);
  const y = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d.price)])
    .rangeRound([height - margin, margin])
    .nice();

  const color = d3
    .scaleOrdinal()
    .domain(new Set(data.map((d) => d.symbol)))
    .range(d3.schemeCategory10);

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
    .call(d3.axisBottom(x).ticks(width / 120));

  for (const [symbol, values] of d3.group(data, (d) => d.symbol)) {
    const line = d3
      .line()
      .x((d) => x(d.date))
      .y((d) => y(d.price));

    svg
      .append("path")
      .attr("d", line(values))
      .attr("stroke", color(symbol))
      .attr("fill", "none");
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
    mark: { type: "line" },
    config: {
      view: { stroke: "transparent" },
    },
    encoding: {
      x: {
        field: "date",
        type: "temporal",
        axis: {
          grid: false,
          title: false,
          tickCount: { signal: "ceil(width/100)" },
        },
      },
      y: {
        field: "price",
        type: "quantitative",
        axis: {
          tickCount: { signal: "ceil(height/20)" },
          domain: false,
          ticks: false,
          title: false,
        },
      },
      color: { field: "symbol", legend: false },
    },
  };
  await vegaEmbed(element, spec);
}
