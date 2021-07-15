import * as d3 from "/esm-deps/d3.js";
import datasets from "/esm-deps/vega-datasets.js";

export default async function plot(element) {
  const carsDataset = await datasets["cars.json"]();
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
