import { useState } from "react";
import STLChart from "./STLChart";

interface Props {
  trend: number[];
  seasonal: number[];
  resid: number[];
}

const STLTabs: React.FC<Props> = ({ trend, seasonal, resid }) => {
  const [activeTab, setActiveTab] = useState<"trend" | "seasonal" | "resid">("trend");

  console.log("🧪 STLTabs loaded", {
    trendLength: trend.length,
    seasonalLength: seasonal.length,
    residLength: resid.length,
  });

  return (
    <div style={{ marginTop: "2rem", border: "2px solid #ccc", padding: "1rem", borderRadius: "8px" }}>
      {/* Tab Buttons */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "1rem" }}>
        {["trend", "seasonal", "resid"].map((key) => (
          <button
            key={key}
            onClick={() => setActiveTab(key as "trend" | "seasonal" | "resid")}
            style={{
              padding: "10px 16px",
              backgroundColor: activeTab === key ? "#3B82F6" : "#E5E7EB",
              color: activeTab === key ? "#fff" : "#1F2937",
              border: "none",
              borderRadius: "4px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            {key.charAt(0).toUpperCase() + key.slice(1)}
          </button>
        ))}
      </div>

      {/* Chart Renderer */}
      <div>
        {activeTab === "trend" && <STLChart label="Trend" data={trend} />}
        {activeTab === "seasonal" && <STLChart label="Seasonal" data={seasonal} />}
        {activeTab === "resid" && <STLChart label="Residual" data={resid} />}
      </div>
    </div>
  );
};

export default STLTabs;
