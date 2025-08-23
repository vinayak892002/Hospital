import React, { useMemo } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine } from 'recharts';

const RevenueOverTime = (props) => {
  const { bills } = props;

  const data = useMemo(() => {
    const byDate = {};
    bills.forEach(b => {
      const d = new Date(b.created_at).toISOString().slice(0, 10);
      byDate[d] = (byDate[d] || 0) + (b.total_amount || 0);
    });
    return Object.keys(byDate)
      .sort()
      .map(d => ({ date: d, revenue: byDate[d] }));
  }, [bills]);

  const avg = useMemo(() => {
    if (!data.length) return 0;
    const sum = data.reduce((s, x) => s + x.revenue, 0);
    return Math.round((sum / data.length) * 100) / 100;
  }, [data]);

  return (
    <div style={{ border: '1px solid #eee', borderRadius: 8, padding: 8 }}>
      <div style={{ marginBottom: 8, fontWeight: 600 }}>Revenue Over Time</div>
      <div style={{ width: '100%', height: 260 }}>
        <ResponsiveContainer>
          <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis tickFormatter={(v) => `₹ ${v}`} tick={{ fontSize: 12 }} />
            <Tooltip formatter={(v) => {`₹ ${Number(v).toLocaleString()}, 'Revenue'`}} />
            {avg > 0 && (
              <ReferenceLine y={avg} stroke="#9e9e9e" strokeDasharray="4 4" label={{ value: `Avg ₹ ${avg}`, position: 'right', fontSize: 10 }} />
)}
            <Line type="monotone" dataKey="revenue" stroke="#1976d2" strokeWidth={2} dot={{ r: 2 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export { RevenueOverTime }