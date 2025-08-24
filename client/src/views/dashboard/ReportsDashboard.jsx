import React, { useEffect, useMemo, useRef, useState } from 'react'

import apiService from '../../utility/apis/api';
// import billing from '../../mock-data/billing.json';
import appointments from '../../mock-data/appointments.json';
import departments from '../../mock-data/departments.json';
import doctors from '../../mock-data/doctors.json';
// import hospitals from '../../mock-data/hospitals.json';


import {FiltersBar} from './FiltersBar';
import {KPICard} from './KPICard';
import {RevenueOverTime} from './RevenueOverTime';
import {PatientsOverTime} from './PatientsOverTime';
import {PaymentModes} from './PaymentModes';
import {TopDepartments} from './TopDepartments';
import {DailyRevenueTable} from './DailyRevenueTable';
import {TopDoctorsTable} from './TopDoctorsTable';

const ReportsDashboard = () => {

  // Replace this with your Redux auth (role, hospitalId) if available
  const [role, setRole] = useState('ADMIN'); // 'ADMIN' | 'SUPER_ADMIN'
  // const adminHospitalId = 'hosp1';

  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().setDate(new Date().getDate() - 7)),
    end: new Date()
  });
  // const [selectedHospital, setSelectedHospital] = useState(role === 'ADMIN' ? adminHospitalId : 'All');
  const [selectedDepartment, setSelectedDepartment] = useState('');

  const containerRef = useRef(null);
  const [billing, setBilling] = useState([]);
  // const [appointments, setAppointments] = useState([]);
  // const [departments, setDepartments] = useState([]);
  // const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [billingData] = await Promise.all([
          apiService.getBillings(),
          // apiService.getDepartments(),
          // apiService.getDoctors(),
          // apiService.getAppointments(),
        ]);
        
        setBilling(billingData);
        // setAppointments(appointmentData);
        // setDepartments(departmentData);
        // setDoctors(doctorData);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  const inRange = (iso) => {
    const t = new Date(iso).getTime();
    return t >= dateRange.start.getTime() && t <= dateRange.end.getTime();
  };

  const applyScope = (arr) => {
    let out = arr;
    // if (role === 'ADMIN') {
    //   out = out.filter(x => x.hospital_id === adminHospitalId);
    // }
    //  else if (selectedHospital && selectedHospital !== 'All') {
    //   out = out.filter(x => x.hospital_id === selectedHospital);
    // }
    if (selectedDepartment) {
      out = out.filter(x => x.department_id === selectedDepartment);
    }
    return out;
  };
  console.log("Billing data in dashboard:", billing);
  const scopedBills = useMemo(
    () => applyScope(billing).filter(b => inRange(b.created_at)),
    // eslint-disable-next-line
    // [role, selectedDepartment, dateRange]
    [billing, selectedDepartment, dateRange]
  );

  const scopedAppts = useMemo(
    () => applyScope(appointments).filter(a => inRange(a.appointment_date)),
    // eslint-disable-next-line
    // [role, selectedDepartment, dateRange]
    [appointments, selectedDepartment, dateRange]
  );

  const kpis = useMemo(() => {
    const revenue = scopedBills.reduce((s, b) => s + (b.total_amount || 0), 0);
    const patientsSeen = scopedAppts.filter(a => a.status === 'Completed').length;
    const outstanding = scopedBills.filter(b => b.payment_status !== 'Paid').reduce((s, b) => s + (b.total_amount || 0), 0);
    const avgBilling = patientsSeen ? Math.round((revenue / patientsSeen) * 100) / 100 : 0;
    return { revenue, patientsSeen, outstanding, avgBilling };
  }, [scopedBills, scopedAppts]);

  const onExportDashboardPdf = async () => {
    // Lightweight html2canvas + jsPDF import for on-demand PDF
    const el = containerRef.current;
    if (!el) return;
    const html2canvas = (await import('html2canvas')).default;
    const jsPDF = (await import('jspdf')).default;
    const canvas = await html2canvas(el, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, Math.min(imgHeight, pdf.internal.pageSize.getHeight()));
    pdf.save('reports-dashboard.pdf');
  };

  // Ensure hospital selection resets properly when switching roles
  const roleChanged = (nextRole) => {
    setRole(nextRole);
    // if (nextRole === 'ADMIN') {
    //   setSelectedHospital(adminHospitalId);
    // } else {
    //   setSelectedHospital('All');
    // }
  };

  if (loading) return <div>Loading dashboard data...</div>;
  if (error) return <div>Error loading data: {error}</div>;

  return (
    <div ref={containerRef} style={{ padding: 16 }}>
      <div style={{ marginBottom: 12, display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
        <FiltersBar
          role={role}
          setRole={roleChanged}
          departments={departments}
          dateRange={dateRange}
          setDateRange={setDateRange}
          selectedDepartment={selectedDepartment}
          setSelectedDepartment={setSelectedDepartment}
        />
        <button onClick={onExportDashboardPdf}>Export Dashboard PDF</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 16 }}>
        <KPICard title="Revenue" value={`₹ ${kpis.revenue.toLocaleString()}`} />
        <KPICard title="Patients Seen" value={kpis.patientsSeen} />
        <KPICard title="Outstanding" value={`₹ ${kpis.outstanding.toLocaleString()}`} />
        <KPICard title="Avg Billing" value={`₹ ${kpis.avgBilling.toLocaleString()}`} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
        <RevenueOverTime bills={scopedBills} />
        <PatientsOverTime appts={scopedAppts} />
        <PaymentModes bills={scopedBills} />
        <TopDepartments bills={scopedBills} departments={departments} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <DailyRevenueTable bills={scopedBills} appts={scopedAppts} />
        <TopDoctorsTable appts={scopedAppts} doctors={doctors} bills={scopedBills} />
      </div>
    </div>
  );
};
export {ReportsDashboard}
