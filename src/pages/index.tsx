import { useState } from "react";
import FileUploader from "../components/FileUploader";
import { parseNEM12, ParsedNEM12 } from "../utils/parseNEM12";
import DailyUsageChart from "../components/DailyUsageChart";
import STLTabs from "../components/STLTabs";

export default function Home() {
  const [parsed, setParsed] = useState<ParsedNEM12 | null>(null);
  const [trend, setTrend] = useState<number[] | null>(null);
  const [seasonal, setSeasonal] = useState<number[] | null>(null);
  const [resid, setResid] = useState<number[] | null>(null);

  const handleFileRead = async (file: File) => {
    console.log("📁 File received:", file);

    const text = await file.text();
    const parsedResult = parseNEM12(text);
    console.log("✅ Parsed Result:", parsedResult);
    setParsed(parsedResult);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/decompose", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const result = await response.json();
      console.log("📊 STL Result:", result);
      setTrend(result.trend || []);
      setSeasonal(result.seasonal || []);
      setResid(result.resid || []);
    } catch (err) {
      console.error("❌ Failed to fetch STL:", err);
    }
  };

  const stlReady =
    trend && trend.length > 0 && seasonal && seasonal.length > 0 && resid && resid.length > 0;

  if (stlReady) {
    console.log("🔥 Rendering STLTabs", {
      trendLength: trend?.length,
      seasonalLength: seasonal?.length,
      residLength: resid?.length,
    });
  }

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-4">NEM12 Viewer</h1>

      <FileUploader onFileRead={handleFileRead} />

      {parsed && (
        <>
          <div className="mt-6 p-4 bg-white shadow rounded-lg">
            <h2 className="text-xl font-semibold mb-2">✅ NEM12 Parsed</h2>
            <p>
              <strong>NMI:</strong> {parsed.nmi}
            </p>
            <p>
              <strong>Unit:</strong> {parsed.uom}
            </p>
            <p>
              <strong>Interval Length:</strong> {parsed.intervalLength} minutes
            </p>
            <p>
              <strong>Days Loaded:</strong> {parsed.intervals.length}
            </p>
          </div>

          <DailyUsageChart parsed={parsed} />

          {stlReady && (
            <STLTabs trend={trend!} seasonal={seasonal!} resid={resid!} />
          )}
        </>
      )}
    </main>
  );
}
