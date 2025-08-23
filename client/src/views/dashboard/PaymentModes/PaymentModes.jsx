import React, { useMemo } from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COLORS = ['#1976d2', '#9c27b0', '#ff9800', '#26a69a', '#ef5350', '#7e57c2'];

const PaymentModes = (props) => {
  const { bills } = props;

  const data = useMemo(() => {
    const map = {};
    bills.forEach(b => {
      const k = b.payment_mode || 'Unknown';
      map[k] = (map[k] || 0) + 1;
    });
    return Object.keys(map).map(k => ({ mode: k, count: map[k] }));
  }, [bills]);

  return (
    <div style={{ border: '1px solid #eee', borderRadius: 8, padding: 8 }}>
      <div style={{ marginBottom: 8, fontWeight: 600 }}>Payment Modes</div>
      <div style={{ width: '100%', height: 260 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie data={data} dataKey="count" nameKey="mode" innerRadius={55} outerRadius={85} paddingAngle={2} >
              {data.map((entry, i) => (
                <Cell key={`cell - ${i}`} fill={COLORS[i % COLORS.length]} />
))}
            </Pie>
            <Tooltip />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export { PaymentModes }