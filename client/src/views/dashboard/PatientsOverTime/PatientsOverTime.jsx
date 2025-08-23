import React, { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const PatientsOverTime = (props) => {
  const { appts } = props;

  const data = useMemo(() => {
    const byDate = {};
    appts.forEach((a) => {
      const d = new Date(a.appointment_date).toISOString().slice(0, 10);
      byDate[d] = (byDate[d] || 0) + (a.status === "Completed" ? 1 : 0);
    });
    return Object.keys(byDate)
      .sort()
      .map((d) => ({ date: d, patients: byDate[d] }));
  }, [appts]);

  return (
    <div style={{ border: "1px solid #eee", borderRadius: 8, padding: 8 }}>
      <div style={{ marginBottom: 8, fontWeight: 600 }}>
        Patients Seen Over Time
      </div>
      <div style={{ width: "100%", height: 260 }}>
        <ResponsiveContainer>
          <LineChart
            data={data}
            margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="patients"
              stroke="#2e7d32"
              strokeWidth={2}
              dot={{ r: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export { PatientsOverTime };
