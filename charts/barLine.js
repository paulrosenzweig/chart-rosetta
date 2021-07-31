import * as d3 from "/chart-rosetta/esm-deps/d3.js";
import * as echarts from "/chart-rosetta/esm-deps/echarts.js";
import vegaEmbed from "/chart-rosetta/esm-deps/vega-embed.js";
import { ratingDecadeCounts } from "/chart-rosetta/data/movies.js";

export async function plotECharts(element) {
  const [ratedR, ratedPG] = ["R", "PG"].map((rating) =>
    ratingDecadeCounts
      .filter((d) => d.rating === rating)
      .sort((a, b) => d3.ascending(a.decade, b.decade))
      .map((d) => [d.decade, d.worldwideGross])
  );
  const option = {
    xAxis: [{ type: "time" }],
    yAxis: [
      {
        type: "value",
        axisLabel: {
          formatter: (value) => `${Math.floor(value / 1000000000)}G`,
        },
      },
    ],
    series: [
      { type: "bar", data: ratedR },
      { type: "line", data: ratedPG },
    ],
    animation: false,
  };

  echarts.init(element).setOption(option);
}

export async function plotVega(element) {
  const spec = {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    data: { values: ratingDecadeCounts },
    width: "container",
    height: "container",
    config: { view: { stroke: false } },
    padding: 50,
    layer: [
      {
        mark: "bar",
        transform: [{ filter: { field: "rating", equal: "R" } }],
        encoding: {
          x: {
            timeUnit: "year",
            field: "decade",
            type: "ordinal",
            axis: { title: false, domain: false },
          },
          y: {
            field: "worldwideGross",
            type: "quantitative",
            axis: { format: "~s", title: false, domain: false, ticks: false },
          },
        },
      },
      {
        mark: "line",
        transform: [{ filter: { field: "rating", equal: "PG" } }],
        encoding: {
          x: {
            timeUnit: "year",
            field: "decade",
            type: "ordinal",
          },
          y: {
            field: "worldwideGross",
            type: "quantitative",
          },
          color: { value: "green" },
        },
      },
    ],
  };

  await vegaEmbed(element, spec);
}

export async function plotD3(element) {
  const [ratedR, ratedPG] = ["R", "PG"].map((rating) =>
    ratingDecadeCounts
      .filter((d) => d.rating === rating)
      .sort((a, b) => d3.ascending(a.decade, b.decade))
  );

  const { width, height } = element.getBoundingClientRect();
  const margin = 70;

  const xBar = d3
    .scaleBand()
    .domain(ratedR.map((d) => d.decade).sort(d3.ascending))
    .rangeRound([margin, width - margin])
    .padding(0.25);

  const xLine = d3
    .scaleTime()
    .domain([xBar.domain()[0], xBar.domain()[xBar.domain().length - 1]])
    .rangeRound([
      xBar.range()[0] +
        xBar.paddingOuter() * xBar.step() +
        xBar.bandwidth() / 2,
      xBar.range()[1] -
        (xBar.paddingOuter() * xBar.step() + xBar.bandwidth() / 2),
    ]);

  const y = d3
    .scaleLinear()
    .domain([0, d3.max(ratedR.concat(ratedPG), (d) => d.worldwideGross)])
    .rangeRound([height - margin, margin])
    .nice();

  const svg = d3.create("svg").attr("viewBox", `0 0 ${width} ${height}`);

  const xAxis = svg
    .append("g")
    .attr("transform", `translate(0, ${height - margin})`)
    .call(d3.axisBottom(xBar).tickFormat((v) => v.getFullYear()));
  xAxis.select(".domain").remove();

  const yAxis = svg
    .append("g")
    .attr("transform", `translate(${margin}, 0)`)
    .call(d3.axisLeft(y).tickFormat(d3.format("~s")).ticks(5));

  yAxis.select(".domain").remove();
  yAxis
    .selectAll(".tick line")
    .attr("x2", xBar.range()[1] - xBar.range()[0])
    .attr("stroke", "lightgray");

  for (const d of ratedR) {
    svg
      .append("rect")
      .attr("x", xBar(d.decade))
      .attr("y", y(d.worldwideGross))
      .attr("height", y(0) - y(d.worldwideGross))
      .attr("width", xBar.bandwidth())
      .attr("fill", "steelblue");
  }
  const line = d3
    .line()
    .x((d) => xLine(d.decade))
    .y((d) => y(d.worldwideGross));
  svg
    .append("path")
    .attr("d", line(ratedPG))
    .attr("stroke", "green")
    .attr("fill", "none");

  element.append(svg.node());
}
