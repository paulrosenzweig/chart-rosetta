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
  };

  await vegaEmbed(element, spec);
}

export async function plotD3(element) {
  const { width, height } = element.getBoundingClientRect();
  const margin = 70;
  element.append(svg.node());
}
