import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, AlertCircle, CheckCircle, ChevronRight } from 'lucide-react';

const Dashboard = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // This is the magic router hook!

  const fetchLogs = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/logs');
      const data = await response.json();
      setLogs(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching logs:", error);
    }
  };

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ padding: '2rem', backgroundColor: '#f9fafb', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <header style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Activity size={32} color="#4f46e5" />
        <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#111827' }}>AI DevOps Monitor</h1>
      </header>

      <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ backgroundColor: '#f3f4f6', color: '#374151', textTransform: 'uppercase', fontSize: '0.75rem' }}>
            <tr>
              <th style={{ padding: '1rem' }}>Build Name</th>
              <th style={{ padding: '1rem' }}>Status</th>
              <th style={{ padding: '1rem' }}>AI Root Cause Analysis</th>
              <th style={{ padding: '1rem' }}>Date</th>
              <th style={{ padding: '1rem' }}></th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr 
                key={log.id} 
                onClick={() => navigate(`/build/${log.id}`)}
                style={{ 
                  borderBottom: '1px solid #e5e7eb', 
                  cursor: 'pointer', // Makes the mouse look like a clicking hand
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
              >
                <td style={{ padding: '1rem', fontWeight: '600' }}>{log.buildName}</td>
                <td style={{ padding: '1rem' }}>
                  <span style={{ 
                    display: 'flex', alignItems: 'center', gap: '0.5rem', 
                    color: log.status === 'COMPLETED' ? '#10b981' : '#f59e0b',
                    fontSize: '0.875rem'
                  }}>
                    {log.status === 'COMPLETED' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                    {log.status}
                  </span>
                </td>
                <td style={{ padding: '1rem', color: '#4b5563', fontSize: '0.9rem', maxWidth: '400px' }}>
                  {log.rootCause || "Analyzing..."}
                </td>
                <td style={{ padding: '1rem', color: '#9ca3af', fontSize: '0.8rem' }}>
                  {new Date(log.createdAt).toLocaleString()}
                </td>
                <td style={{ padding: '1rem' }}>
                  <ChevronRight size={20} color="#4f46e5" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {loading && <p style={{ textAlign: 'center', padding: '2rem' }}>Loading logs...</p>}
      </div>
    </div>
  );
};

export default Dashboard;