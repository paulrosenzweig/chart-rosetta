import * as d3 from "/esm-deps/d3.js";
import * as echarts from "/esm-deps/echarts.js";
import vegaEmbed from "/esm-deps/vega-embed.js";
import { ratingDecadeCounts as data } from "/data/movies.js";

export async function plotECharts(element) {
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
      .map(([rating, data]) => ({
        type: "bar",
        name: rating,
        stack: "foo",
        data: data.map((d) => [d.decade, d.worldwideGross]),
      })),
    animation: false,
  };

  echarts.init(element).setOption(option);
}

export async function plotVega(element) {
  const spec = {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    width: "container",
    height: "container",
    padding: 45,
    data: { values: data },
    mark: { type: "bar" },
    config: { view: { stroke: "transparent" } },
    encoding: {
      x: {
        field: "decade",
        type: "ordinal",
        timeUnit: "year",
        axis: {
          title: false,
          grid: false,
        },
      },
      y: {
        field: "worldwideGross",
        type: "quantitative",
        axis: {
          format: "s",
          title: false,
          ticks: false,
          domain: false,
        },
      },
      color: {
        field: "rating",
        legend: false,
      },
    },
  };
  await vegaEmbed(element, spec);
}
