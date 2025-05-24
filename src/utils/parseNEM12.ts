export interface IntervalData {
  date: string;       // Format: "YYYYMMDD"
  values: number[];   // 48 half-hour readings
  quality: string;    // e.g., "A"
}

export interface ParsedNEM12 {
  nmi: string;
  uom: string;
  intervalLength: number;
  intervals: IntervalData[];
  startDate: string;  // ISO 8601
  endDate: string;    // ISO 8601
}

export function parseNEM12(csvText: string): ParsedNEM12 | null {
  const lines = csvText.split(/\r?\n/).filter(line => line.trim() !== "");

  let currentNMI = "";
  let uom = "";
  let intervalLength = 30;
  const intervals: IntervalData[] = [];

  const dateSet = new Set<string>();

  for (const line of lines) {
    const fields = line.split(",");

    if (fields[0] === "200") {
      currentNMI = fields[1]?.trim() || "";
      uom = fields[7]?.trim() || "";
      intervalLength = parseInt(fields[8], 10) || 30;
    }

    if (fields[0] === "300") {
      const date = fields[1];
      if (!date) continue;

      const values: number[] = [];

      // Extract numerical readings (excluding last 2 fields)
      for (let i = 2; i < fields.length - 2; i++) {
        const val = parseFloat(fields[i]);
        values.push(isNaN(val) ? 0 : val); // fallback to 0 if invalid
      }

      const quality = fields[fields.length - 2]?.trim() || "U"; // U = Unknown fallback

      intervals.push({ date, values, quality });
      dateSet.add(date);
    }
  }

  if (!currentNMI || intervals.length === 0) return null;

  // Sort dates to determine start and end
  const sortedDates = Array.from(dateSet).sort();
  const startDate = formatDateToISO(sortedDates[0], "start");
  const endDate = formatDateToISO(sortedDates[sortedDates.length - 1], "end");

  return {
    nmi: currentNMI,
    uom,
    intervalLength,
    intervals,
    startDate,
    endDate,
  };
}

// Helper: Convert YYYYMMDD to ISO string
function formatDateToISO(dateStr: string, type: "start" | "end"): string {
  const year = dateStr.slice(0, 4);
  const month = dateStr.slice(4, 6);
  const day = dateStr.slice(6, 8);
  const date = new Date(`${year}-${month}-${day}T00:00:00`);
  if (type === "end") date.setHours(23, 30, 0, 0);
  return date.toISOString();
}
