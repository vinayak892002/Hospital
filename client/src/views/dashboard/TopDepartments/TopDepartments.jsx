import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LabelList } from 'recharts';

const TopDepartments = (props) => {
  const { bills, departments } = props;

  const nameById = useMemo(() => {
    const m = {};
    departments.forEach(d => { m[d.department_id] = d.name; });
    return m;
  }, [departments]);

  const data = useMemo(() => {
    const map = {};
    bills.forEach(b => {
      const dep = b.department_id || (b.services && b.services && b.services.department_id);
      if (!dep) return;
      map[dep] = (map[dep] || 0) + (b.total_amount || 0);
    });
    const arr = Object.keys(map).map(dep => ({
      department: nameById[dep] || dep,
      revenue: map[dep]
    }));
    arr.sort((a, b) => b.revenue - a.revenue);
    return arr.slice(0, 5);
  }, [bills, nameById]);

  const maxRevenue = useMemo(() => (data.length ? Math.max(...data.map(d => d.revenue)) : 0), [data]);

  return (
    <div style={{ border: '1px solid #eee', borderRadius: 8, padding: 8 }}>
      <div style={{ marginBottom: 8, fontWeight: 600 }}>Top Departments (by Revenue)</div>
      <div style={{ width: '100%', height: 260 }}>
        <ResponsiveContainer>
          <BarChart data={data} layout="vertical" margin={{ top: 10, right: 24, left: 10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" tickFormatter={(v) => `₹ ${v}`} domain={[0, Math.ceil(maxRevenue * 1.17)]} />
            <YAxis type="category" dataKey="department" width={120} />
            <Tooltip formatter={(v) => [`₹ ${Number(v).toLocaleString()}`, 'Revenue']} />
            <Bar dataKey="revenue" fill="#0288d1" barSize={24}>
              <LabelList dataKey="revenue" position="right" formatter={(v) => `₹ ${Number(v).toLocaleString()}`} style={{ fontSize: 11 }} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export { TopDepartments }