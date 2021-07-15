import * as echarts from "/esm-deps/echarts.js";
import data from "/esm-deps/vega-datasets.js";

export default async function plot(element) {
  const myChart = echarts.init(element);
  const cars = await data["cars.json"]();
  const data = cars.map((c) => [c.Horsepower, c.Displacement]);

  const option = {
    xAxis: {},
    yAxis: {},
    series: [{ symbolSize: 5, data, type: "scatter" }],
  };

  myChart.setOption(option);
}
