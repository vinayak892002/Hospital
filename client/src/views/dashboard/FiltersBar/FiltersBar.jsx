

const FiltersBar = (props) => {
  const {
    role, setRole, departments,
    dateRange, setDateRange,
    selectedDepartment, setSelectedDepartment,
    adminHospitalId
  } = props;

  const onDateChange = (e, which) => {
    const value = e.target.value;
    setDateRange(prev => ({ ...prev, [which]: new Date(value) }));
  };

  const isAdmin = role === 'ADMIN';

  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
      <select value={role} onChange={e => setRole(e.target.value)}>
        <option value="ADMIN">ADMIN</option>
        <option value="SUPER_ADMIN">SUPER_ADMIN</option>
      </select>

      {/* {!isAdmin && (
        <select value={selectedHospital} onChange={e => setSelectedHospital(e.target.value)}>
          <option value="All">All Hospitals</option>
          {hospitals.map(h => (
            <option key={h.hospital_id} value={h.hospital_id}>{h.name}</option>
          ))}
        </select>
      )}
      {isAdmin && (
        <input value={`Hospital: ${adminHospitalId}`} readOnly style={{ width: 180 }} />
      )} */}

      <select value={selectedDepartment} onChange={e => setSelectedDepartment(e.target.value)}>
        <option value="">All Departments</option>
        {departments.map(d => (
          <option key={d.department_id} value={d.department_id}>{d.name}</option>
        ))}
      </select>

      <input
        type="date"
        value={dateRange.start.toISOString().slice(0, 10)}
        onChange={e => onDateChange(e, 'start')}
      />
      <input
        type="date"
        value={dateRange.end.toISOString().slice(0, 10)}
        onChange={e => onDateChange(e, 'end')}
      />
    </div>
  );
};

export {FiltersBar}