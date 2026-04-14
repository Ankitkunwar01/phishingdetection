import React, { useState, useEffect, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getAdminUrls, getAdminStats } from '../services/api';
import Navbar from '../components/Navbar';
import '../styles/global.css';

const AdminDashboard = () => {
  const { isAuthenticated, isAdmin } = useContext(AuthContext);
  const [urls, setUrls] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [urlsData, statsData] = await Promise.all([
          getAdminUrls(),
          getAdminStats()
        ]);
        setUrls(urlsData.analyses);
        setStats(statsData);
      } catch (err) {
        setError('Failed to fetch dashboard data');
      } finally {
        setLoading(false);
      }
    };
    if (isAuthenticated && isAdmin) {
      fetchData();
    }
  }, [isAuthenticated, isAdmin]);

  if (!isAuthenticated) return <Navigate to="/login" />;
  if (!isAdmin) return <Navigate to="/dashboard" />;

  // Pagination logic
  const indexOfLastUrl = currentPage * itemsPerPage;
  const indexOfFirstUrl = indexOfLastUrl - itemsPerPage;
  const currentUrls = urls.slice(indexOfFirstUrl, indexOfLastUrl);
  const totalPages = Math.ceil(urls.length / itemsPerPage);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  const StatCard = ({ title, value, color, icon }) => (
    <div style={{
      backgroundColor: 'white',
      padding: '24px',
      borderRadius: '16px',
      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
      borderLeft: `4px solid ${color}`,
      display: 'flex',
      flexDirection: 'column',
      gap: '8px'
    }}>
      <span style={{ fontSize: '14px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{title}</span>
      <span style={{ fontSize: '32px', fontWeight: 'bold', color: '#111827' }}>{value}</span>
    </div>
  );

  return (
    <div className="dashboard-page" style={{ backgroundColor: '#f3f4f6', minHeight: '100vh' }}>
      <Navbar />
      <div className="container" style={{ paddingTop: '100px', paddingBottom: '60px' }}>
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '30px', fontWeight: 'bold', color: '#111827' }}>Admin Intelligence Center</h1>
          <p style={{ color: '#6b7280' }}>Comprehensive overview of system threats and community activity.</p>
        </div>

        {error && (
          <div style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '16px', borderRadius: '8px', marginBottom: '24px' }}>
            {error}
          </div>
        )}

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '100px' }}>
            <div className="spinner"></div>
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            {stats && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '24px',
                marginBottom: '40px'
              }}>
                <StatCard title="Total Scans" value={stats.totalScans} color="#3b82f6" />
                <StatCard title="Phishing Detected" value={stats.phishingDetected} color="#ef4444" />
                <StatCard title="Safe URLs" value={stats.safeUrls} color="#10b981" />
                <StatCard title="Community Comments" value={stats.totalComments} color="#8b5cf6" />
                <StatCard title="Registered Users" value={stats.totalUsers} color="#f59e0b" />
              </div>
            )}

            {/* Table Section */}
            <div style={{ backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
              <div style={{ padding: '24px', borderBottom: '1px solid #f3f4f6' }}>
                <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#111827' }}>Complete Scan Logs</h2>
              </div>

              <div className="table-wrapper" style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead style={{ backgroundColor: '#f9fafb' }}>
                    <tr>
                      <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#374151', textTransform: 'uppercase' }}>Scan ID</th>
                      <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#374151', textTransform: 'uppercase' }}>User</th>
                      <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#374151', textTransform: 'uppercase' }}>URL</th>
                      <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#374151', textTransform: 'uppercase' }}>Status</th>
                      <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#374151', textTransform: 'uppercase' }}>Risk</th>
                      <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#374151', textTransform: 'uppercase' }}>Date</th>
                    </tr>
                  </thead>
                  <tbody style={{ divideY: '1px solid #f3f4f6' }}>
                    {currentUrls.map((u) => (
                      <tr key={u.id} style={{ borderBottom: '1px solid #f3f4f6', transition: 'background-color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                        <td style={{ padding: '16px 24px', fontSize: '14px', color: '#6b7280' }}>#{u.id}</td>
                        <td style={{ padding: '16px 24px', fontSize: '14px', fontWeight: '600', color: '#111827' }}>{u.user}</td>
                        <td style={{ padding: '16px 24px', fontSize: '14px', color: '#374151', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.url}</td>
                        <td style={{ padding: '16px 24px' }}>
                          <span style={{
                            padding: '4px 12px',
                            borderRadius: '9999px',
                            fontSize: '12px',
                            fontWeight: '600',
                            backgroundColor: u.isPhishing ? '#fee2e2' : '#d1fae5',
                            color: u.isPhishing ? '#ef4444' : '#059669'
                          }}>
                            {u.isPhishing ? 'Malicious' : 'Safe'}
                          </span>
                        </td>
                        <td style={{ padding: '16px 24px', fontSize: '14px', fontWeight: '600' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ width: '40px', height: '8px', backgroundColor: '#e5e7eb', borderRadius: '4px', overflow: 'hidden' }}>
                              <div style={{ width: `${u.riskScore}%`, height: '100%', backgroundColor: u.riskScore > 70 ? '#ef4444' : u.riskScore > 40 ? '#f59e0b' : '#10b981' }}></div>
                            </div>
                            {u.riskScore.toFixed(0)}%
                          </div>
                        </td>
                        <td style={{ padding: '16px 24px', fontSize: '14px', color: '#6b7280' }}>{new Date(u.analyzedAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {urls.length === 0 && (
                  <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>
                    No system-wide scan data available yet.
                  </div>
                )}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div style={{ padding: '20px 24px', borderTop: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '14px', color: '#6b7280' }}>
                    Showing page {currentPage} of {totalPages}
                  </span>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '8px',
                        border: '1px solid #e5e7eb',
                        backgroundColor: currentPage === 1 ? '#f9fafb' : 'white',
                        cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                        fontSize: '14px',
                        fontWeight: '500'
                      }}
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '8px',
                        border: '1px solid #e5e7eb',
                        backgroundColor: currentPage === totalPages ? '#f9fafb' : 'white',
                        cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                        fontSize: '14px',
                        fontWeight: '500'
                      }}
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
