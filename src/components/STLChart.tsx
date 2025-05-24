import { Line, Scatter } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import React from "react";

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend, Filler);

interface Props {
  label: "Trend" | "Seasonal" | "Residual";
  data: number[];
}

// ⏬ Downsampling to improve rendering performance
function downsample(data: number[], maxPoints = 300): number[] {
  if (data.length <= maxPoints) return data;
  const step = Math.ceil(data.length / maxPoints);
  return data.filter((_, i) => i % step === 0);
}

const STLChart: React.FC<Props> = ({ label, data }) => {
  const average = data.reduce((sum, val) => sum + val, 0) / data.length;
  const sampled = downsample(data);
  const labels = sampled.map((_, i) => i.toString());

  const lineChartData = {
    labels,
    datasets: [
      {
        label: `${label} (avg: ${average.toFixed(2)})`,
        data: sampled,
        borderColor: "rgba(75,192,192,1)",
        pointRadius: 0,
        tension: 0,
        borderWidth: 2,
        fill: false,
      },
    ],
  };

  const scatterData = {
    datasets: [
      {
        label: "Residual",
        data: sampled.map((y, x) => ({ x, y })),
        backgroundColor: "rgba(255,99,132,0.8)",
        pointRadius: 2,
      },
    ],
  };

  const chartOptions = {
    animation: {
      duration: 0,
    },
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { display: true },
      y: { display: true },
    },
    plugins: {
      legend: {
        labels: {
          font: { size: 12 },
        },
      },
    },
  };

  return (
    <div className="my-8 p-4 bg-white shadow rounded" style={{ height: "400px" }}>
      <h2 className="text-lg font-semibold mb-2">{label}</h2>

      {label === "Residual" ? (
        <Scatter data={scatterData} options={chartOptions} />
      ) : (
        <Line data={lineChartData} options={chartOptions} />
      )}

      {label !== "Residual" && (
        <p className="mt-2 text-sm text-gray-600">
          ⚡ Average Daily Consumption: {average.toFixed(2)} kWh
        </p>
      )}
    </div>
  );
};

export default React.memo(STLChart);
