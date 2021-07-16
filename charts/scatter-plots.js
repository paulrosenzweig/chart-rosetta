import * as d3 from "/esm-deps/d3.js";
import * as echarts from "/esm-deps/echarts.js";
import datasets from "/esm-deps/vega-datasets.js";

const carsDataset = await datasets["cars.json"]();

export async function plotD3(element) {
  const data = carsDataset
    .map((c) => ({
      x: c.Horsepower,
      y: c.Displacement,
    }))
    .filter((c) => c.x != null && c.y != null);
  const { width, height } = element.getBoundingClientRect();
  const margin = 20;

  const x = d3
    .scaleLinear()
    .domain(d3.extent(data, (d) => d.x))
    .range([margin, width - margin]);
  const y = d3
    .scaleLinear()
    .domain(d3.extent(data, (d) => d.y))
    .range([height - margin, margin]);

  const svg = d3.create("svg").attr("viewBox", `0 0 ${width} ${height}`);

  for (const d of data) {
    svg
      .append("circle")
      .attr("cx", x(d.x))
      .attr("cy", y(d.y))
      .attr("r", 3)
      .attr("fill", "steelblue");
  }

  element.append(svg.node());
}

export async function plotECharts(element) {
  const myChart = echarts.init(element);
  const data = carsDataset.map((c) => [c.Horsepower, c.Displacement]);

  const option = {
    xAxis: {},
    yAxis: {},
    series: [{ symbolSize: 5, data, type: "scatter" }],
  };

  myChart.setOption(option);
}
