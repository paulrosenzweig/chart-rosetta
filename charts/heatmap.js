import * as d3 from "./esm-deps/d3.js";
import * as echarts from "./esm-deps/echarts.js";
import vegaEmbed from "./esm-deps/vega-embed.js";

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
      axis: { domain: false, grid: true },
    },
    mark: "rect",
    encoding: {
      x: {
        field: "date",
        timeUnit: "week",
        type: "ordinal",
        axis: { tickBand: "extent", ticks: false, labels: false },
      },
      y: {
        field: "date",
        timeUnit: "day",
        type: "ordinal",
        title: "Day of week",
        axis: { tickBand: "extent", ticks: false },
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
  const [firstDate, lastDate] = d3.extent(data, (d) => d.date);
  const x = d3
    .scaleBand()
    .domain(
      d3.timeWeeks(d3.timeWeek.floor(firstDate), d3.timeWeek.ceil(lastDate))
    )
    .rangeRound([margin, width - margin]);
  const y = d3
    .scaleBand()
    .domain(d3.range(7))
    .rangeRound([margin, height - margin]);
  const color = d3
    .scaleQuantize()
    .domain(d3.extent(data, (d) => d.value))
    .range(d3.schemeYlOrRd[3]);
  const svg = d3.create("svg").attr("viewBox", `0 0 ${width} ${height}`);
  for (const d of data) {
    svg
      .append("rect")
      .attr("x", x(d3.timeWeek.floor(d.date)))
      .attr("y", y(d.date.getDay()))
      .attr("width", x.bandwidth())
      .attr("height", y.bandwidth())
      .attr("fill", color(d.value))
      .attr("stroke", "lightgray");
  }
  const leftAxis = svg.append("g");
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  for (const dayIndex of y.domain()) {
    const yPos = y(dayIndex) + y.bandwidth() / 2;
    leftAxis
      .append("text")
      .attr("transform", `translate(${margin},${yPos})`)
      .attr("text-anchor", "end")
      .attr("font-family", "sans-serif")
      .attr("alignment-baseline", "middle")
      .text(weekdays[dayIndex]);
  }
  element.append(svg.node());
}
