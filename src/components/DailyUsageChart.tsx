import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import { ParsedNEM12 } from "../utils/parseNEM12";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

interface Props {
  parsed: ParsedNEM12;
}

const DailyUsageChart: React.FC<Props> = ({ parsed }) => {
  const labels = parsed.intervals.map(entry => entry.date);
  const dailyTotals = parsed.intervals.map(entry =>
    entry.values.reduce((sum, val) => sum + val, 0)
  );

  const data = {
    labels,
    datasets: [
      {
        label: `Daily Usage (${parsed.uom})`,
        data: dailyTotals,
        fill: true,
        tension: 0.3,
      },
    ],
  };

  return (
    <div className="mt-8 bg-white p-4 rounded shadow">
      <h2 className="text-xl font-semibold mb-2">Daily Energy Usage</h2>
      <Line data={data} />
    </div>
  );
};

export default DailyUsageChart;
