import React, { useMemo } from 'react';
import { ExportButtons } from '../ExportButtons';

const TopDoctorsTable = (props) => {
  const { appts, doctors, bills } = props;

  // Optional: compute revenue by doctor if your bills include doctor_id.
  const revenueByDoctor = useMemo(() => {
    const map = {};
    bills.forEach(b => {
      if (b.doctor_id) {
        map[b.doctor_id] = (map[b.doctor_id] || 0) + (b.total_amount || 0);
      }
    });
    return map;
  }, [bills]);

  const rows = useMemo(() => {
    const countMap = {};
    appts.forEach(a => {
      if (a.status !== 'Completed') return;
      countMap[a.doctor_id] = (countMap[a.doctor_id] || 0) + 1;
    });
    const byId = {};
    doctors.forEach(d => { byId[d.doctor_id] = d; });

    const arr = Object.keys(countMap).map(docId => ({
      doctor: (byId[docId] && byId[docId].name) || docId,
      patients: countMap[docId],
      revenue: revenueByDoctor[docId] || 0
    }));
    arr.sort((a, b) => b.patients - a.patients);
    return arr.slice(0, 10);
  }, [appts, doctors, revenueByDoctor]);

  return (
    <div style={{ border: '1px solid #eee', borderRadius: 8, padding: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <div style={{ fontWeight: 600 }}>Top Doctors</div>
        <ExportButtons rows={rows} filename="top-doctors.csv" />
      </div>
      <div style={{ maxHeight: 320, overflow: 'auto' }}>
        <table width="100%" cellPadding="8" style={{ borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#fafafa' }}>
              <th align="left">Doctor</th>
              <th align="right">Patients</th>
              <th align="right">Revenue</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} style={{ borderTop: '1px solid #eee' }}>
                <td>{r.doctor}</td>
                <td align="right">{r.patients}</td>
                <td align="right">₹ {r.revenue.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export {TopDoctorsTable}