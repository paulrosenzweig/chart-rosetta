import * as d3 from "/esm-deps/d3.js";
import * as echarts from "/esm-deps/echarts.js";
import vegaEmbed from "/esm-deps/vega-embed.js";

const data = new Array(365).fill(0).map((d, i) => ({
  value: Math.floor(Math.random() * 100),
  date: new Date(2021, 0, i + 1),
}));

export async function plotECharts(element) {
  const option = {
    tooltip: {},
    visualMap: {
      min: 0,
      max: 100,
      type: "piecewise",
      orient: "horizontal",
      left: "center",
      top: 65,
    },
    calendar: {
      top: 120,
      left: 30,
      right: 30,
      cellSize: ["auto", 13],
      range: "2021",
      itemStyle: {
        borderWidth: 0.5,
      },
      yearLabel: { show: false },
    },
    series: {
      type: "heatmap",
      coordinateSystem: "calendar",
      data: data.map(({ value, date }) => [date, value]),
    },
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
    config: {
      view: { strokeWidth: 0 },
      axis: { domain: false },
    },
    mark: "rect",
    encoding: {
      x: {
        field: "date",
        timeUnit: "week",
        type: "ordinal",
        axis: false,
      },
      y: {
        field: "date",
        timeUnit: "day",
        type: "ordinal",
        title: "Day of week",
      },
      color: {
        field: "value",
        type: "quantitative",
        scale: { type: "quantize", scheme: "yelloworangered" },
        legend: { orient: "top" },
      },
    },
  };
  await vegaEmbed(element, spec);
}

export async function plotD3(element) {
  const { width, height } = element.getBoundingClientRect();
  const margin = 70;
  const svg = d3.create("svg").attr("viewBox", `0 0 ${width} ${height}`);
  element.append(svg.node());
}
