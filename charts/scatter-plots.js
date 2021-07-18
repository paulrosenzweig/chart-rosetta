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
    .domain([0, d3.max(data, (d) => d.x)])
    .rangeRound([margin, width - margin])
    .nice();
  const y = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d.y)])
    .rangeRound([height - margin, margin])
    .nice();

  const svg = d3.create("svg").attr("viewBox", `0 0 ${width} ${height}`);

  for (const tick of x.ticks()) {
    const [y1, y2] = y.domain().map(y);
    svg
      .append("line")
      .attr("x1", x(tick))
      .attr("x2", x(tick))
      .attr("y1", y1)
      .attr("y2", y2)
      .attr("stroke", "lightgray");
  }

  for (const tick of y.ticks()) {
    const [x1, x2] = x.domain().map(x);
    svg
      .append("line")
      .attr("y1", y(tick))
      .attr("y2", y(tick))
      .attr("x1", x1)
      .attr("x2", x2)
      .attr("stroke", "lightgray");
  }

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
    xAxis: { name: "Horsepower", nameLocation: "center" },
    yAxis: { name: "Displacement", nameLocation: "center" },
    series: [{ symbolSize: 5, data, type: "scatter" }],
  };

  myChart.setOption(option);
}

export async function plotVega(element) {
  const spec = {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    description:
      "A scatterplot showing horsepower and miles per gallons for various cars.",
    width: "container",
    height: "container",
    data: { values: carsDataset },
    mark: { type: "point", filled: true },
    encoding: {
      x: { field: "Horsepower", type: "quantitative" },
      y: { field: "Displacement", type: "quantitative" },
    },
  };
  await vegaEmbed(element, spec);
}
