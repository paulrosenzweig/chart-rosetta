import * as d3 from "/esm-deps/d3.js";
import * as echarts from "/esm-deps/echarts.js";
import vegaEmbed from "/esm-deps/vega-embed.js";
import { ratingDecadeCounts as data } from "/data/movies.js";

export async function plotECharts(element) {
  const decades = Array.from(new d3.InternSet(data.map((d) => d.decade))).sort(
    d3.ascending
  );
  const option = {
    xAxis: {
      type: "time",
    },
    yAxis: {
      type: "value",
      axisLabel: { formatter: (value) => `${Math.floor(value / 1000000000)}G` },
    },
    series: d3
      .flatGroup(data, (d) => d.rating)
      .map(([rating, values]) => {
        const byDecade = d3.group(values, (d) => d.decade);
        const data = decades.map((dec) => [
          dec,
          byDecade.has(dec) ? byDecade.get(dec)[0].worldwideGross : 0,
        ]);
        return {
          type: "bar",
          barCategoryGap: "10%",
          name: rating,
          data,
        };
      }),
    animation: false,
  };

  echarts.init(element).setOption(option);
}

export async function plotVega(element) {
  const spec = {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    width: 80,
    padding: 45,
    data: { values: data },
    mark: { type: "bar" },
    config: { view: { stroke: "transparent" } },
    encoding: {
      x: {
        field: "rating",
        type: "ordinal",
        axis: { title: null },
      },
      column: {
        field: "decade",
        type: "ordinal",
        timeUnit: "year",
        axis: { title: null },
      },
      y: {
        field: "worldwideGross",
        type: "quantitative",
        axis: {
          format: "s",
          title: false,
          ticks: false,
          domain: false,
          tickCount: 7,
        },
      },
      color: {
        field: "rating",
        legend: null,
      },
    },
  };
  await vegaEmbed(element, spec);
}

export async function plotD3(element) {
  const { width, height } = element.getBoundingClientRect();
  const margin = 70;

  const ratings = new Set(data.map((d) => d.rating));
  const x = d3
    .scaleBand()
    .domain(data.map((d) => d.decade).sort(d3.ascending))
    .rangeRound([margin, width - margin])
    .padding(0.1);
  const xGroup = d3
    .scaleBand()
    .domain(ratings)
    .rangeRound([0, x.bandwidth()])
    .padding(0.1);
  const y = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d.worldwideGross)])
    .rangeRound([height - margin, margin]);
  const color = d3.scaleOrdinal().domain(ratings).range(d3.schemeCategory10);

  const svg = d3.create("svg").attr("viewBox", `0 0 ${width} ${height}`);

  const yAxis = svg
    .append("g")
    .attr("transform", `translate(${margin}, 0)`)
    .call(d3.axisLeft(y).tickFormat(d3.format("~s")));

  yAxis.select(".domain").remove();
  yAxis
    .selectAll(".tick line")
    .attr("x2", x.range()[1] - x.range()[0])
    .attr("stroke", "lightgray");

  const xAxis = svg
    .append("g")
    .attr("transform", `translate(0, ${height - margin})`)
    .call(d3.axisBottom(x).tickFormat((d) => d.getFullYear()));

  for (const d of data) {
    svg
      .append("rect")
      .attr("x", x(d.decade) + xGroup(d.rating))
      .attr("y", y(d.worldwideGross))
      .attr("width", xGroup.bandwidth())
      .attr("height", y(0) - y(d.worldwideGross))
      .attr("fill", color(d.rating));
  }

  element.append(svg.node());
}
