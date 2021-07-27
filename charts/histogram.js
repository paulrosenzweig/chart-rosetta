import * as d3 from "/chart-rosetta/esm-deps/d3.js";
import * as echarts from "/chart-rosetta/esm-deps/echarts.js";
import vegaEmbed from "/chart-rosetta/esm-deps/vega-embed.js";
import { binnedByMass as data } from "/chart-rosetta/data/penguins.js";

export async function plotECharts(element) {
  const option = {
    xAxis: {
      min: (value) => value.min - 250,
      max: (value) => value.max + 250,
      splitLine: { show: false },
    },
    yAxis: {
      axisLine: { show: false },
      axisTick: { show: false },
    },
    series: {
      type: "bar",
      data: data.map((d) => [(d.start + d.end) / 2, d.count]),
      barWidth: "99.3%",
    },
    animation: false,
  };

  echarts.init(element).setOption(option);
}

export async function plotD3(element) {
  const { width, height } = element.getBoundingClientRect();
  const margin = 70;

  const x = d3
    .scaleLinear()
    .domain([data[0].start, data[data.length - 1].end])
    .rangeRound([margin, width - margin]);
  const y = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d.count)])
    .rangeRound([height - margin, margin])
    .nice();

  const svg = d3.create("svg").attr("viewBox", `0 0 ${width} ${height}`);

  const yAxis = svg
    .append("g")
    .attr("transform", `translate(${margin}, 0)`)
    .call(d3.axisLeft(y).ticks(5));

  yAxis.select(".domain").remove();
  yAxis
    .selectAll(".tick line")
    .attr("x2", x.range()[1] - x.range()[0])
    .attr("stroke", "lightgray");

  const xAxis = svg
    .append("g")
    .attr("transform", `translate(0, ${height - margin})`)
    .call(d3.axisBottom(x));

  xAxis.selectAll(".tick line").remove();

  for (const d of data) {
    svg
      .append("rect")
      .attr("x", x(d.start))
      .attr("y", y(d.count))
      .attr("height", y(0) - y(d.count))
      .attr("width", x(d.end) - x(d.start) - 1)
      .attr("fill", "steelblue");
  }

  element.append(svg.node());
}

export async function plotVega(element) {
  const [{ start, end }] = data;
  const step = end - start;
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
        field: "start",
        bin: { binned: true, step },
        axis: {
          title: false,
          grid: false,
        },
      },
      x2: {
        field: "end",
      },
      y: {
        field: "count",
        type: "quantitative",
        axis: {
          title: false,
          ticks: false,
          domain: false,
        },
      },
    },
  };
  await vegaEmbed(element, spec);
}
