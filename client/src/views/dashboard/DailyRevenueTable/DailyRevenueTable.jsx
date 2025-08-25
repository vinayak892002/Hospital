import React, { useMemo } from 'react';
import { ExportButtons } from '../ExportButtons';

const DailyRevenueTable = (props) => {
  const { bills, appts } = props;

  const rows = useMemo(() => {
    const map = {};
    bills.forEach(b => {
      const d = new Date(b.created_at).toISOString().slice(0, 10);
      if (!map[d]) map[d] = { date: d, revenue: 0, paid: 0, unpaid: 0, patients: 0 };
      map[d].revenue += b.total_amount || 0;
      if (b.payment_status === 'Paid') map[d].paid += b.total_amount || 0;
      else map[d].unpaid += b.total_amount || 0;
    });
    appts.forEach(a => {
      if (a.status !== 'Completed') return;
      const d = new Date(a.appointment_date).toISOString().slice(0, 10);
      if (!map[d]) map[d] = { date: d, revenue: 0, paid: 0, unpaid: 0, patients: 0 };
      map[d].patients += 1;
    });
    return Object.values(map).sort((a, b) => a.date.localeCompare(b.date));
  }, [bills, appts]);

  return (
    <div style={{ border: '1px solid #eee', borderRadius: 8, padding: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <div style={{ fontWeight: 600 }}>Daily Revenue</div>
        <ExportButtons rows={rows} filename="daily-revenue.csv" />
      </div>
      <div style={{ maxHeight: 320, overflow: 'auto' }}>
        <table width="100%" cellPadding="8" style={{ borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#fafafa' }}>
              <th align="left">Date</th>
              <th align="right">Revenue</th>
              <th align="right">Paid</th>
              <th align="right">Unpaid</th>
              <th align="right">Patients</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} style={{ borderTop: '1px solid #eee' }}>
                <td>{r.date}</td>
                <td align="right">₹ {r.revenue.toLocaleString()}</td>
                <td align="right">₹ {r.paid.toLocaleString()}</td>
                <td align="right">₹ {r.unpaid.toLocaleString()}</td>
                <td align="right">{r.patients}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export {DailyRevenueTable}