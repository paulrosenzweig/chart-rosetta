import * as d3 from "/esm-deps/d3.js";
import * as echarts from "/esm-deps/echarts.js";
import vegaEmbed from "/esm-deps/vega-embed.js";
import carsDataset from "/data/cars.js";

export async function plotD3(element) {
  const data = carsDataset
    .map((c) => ({
      x: c.Horsepower,
      y: c.Displacement,
    }))
    .filter((c) => c.x != null && c.y != null);
  const { width, height } = element.getBoundingClientRect();
  const margin = 30;

  const x = d3
    .scaleLinear()
    .domain(d3.extent(data, (d) => d.x))
    .rangeRound([margin, width - margin])
    .nice();
  const y = d3
    .scaleLinear()
    .domain(d3.extent(data, (d) => d.y))
    .rangeRound([height - margin, margin])
    .nice();

  const svg = d3.create("svg").attr("viewBox", `0 0 ${width} ${height}`);

  for (const d of data) {
    svg
      .append("circle")
      .attr("cx", x(d.x))
      .attr("cy", y(d.y))
      .attr("r", 3)
      .attr("fill", "steelblue");
  }

  svg
    .append("g")
    .attr("transform", `translate(${margin}, 0)`)
    .call(d3.axisLeft(y));

  svg
    .append("g")
    .attr("transform", `translate(0, ${height - margin})`)
    .call(d3.axisBottom(x));

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

export async function plotVega(element) {
  const spec = {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    description:
      "A scatterplot showing horsepower and miles per gallons for various cars.",
    data: { values: carsDataset },
    mark: "point",
    encoding: {
      x: { field: "Horsepower", type: "quantitative" },
      y: { field: "Miles_per_Gallon", type: "quantitative" },
    },
  };
  await vegaEmbed(element, spec);
}
