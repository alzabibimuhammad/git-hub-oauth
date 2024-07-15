import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

const DevTimeChart = ({ weeklyData }) => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    if (weeklyData.length > 0) {
      const ctx = chartRef.current.getContext("2d");
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
      chartInstanceRef.current = new Chart(ctx, {
        type: "bar",
        data: {
          labels: weeklyData.map((data) => data.week),
          datasets: [
            {
              label: "Average Development Time (hours)",
              data: weeklyData.map((data) => data.averageDevTime / 3600),
              backgroundColor: "#392467",
              borderColor: "rgba(0, 0, 0, 1)",
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    }
  }, [weeklyData]);

  return <canvas ref={chartRef}></canvas>;
};

export default DevTimeChart;
