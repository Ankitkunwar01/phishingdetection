import React, { useState, useEffect, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getUserUrls } from '../services/api';
import Navbar from '../components/Navbar';
import '../styles/global.css';

const UserDashboard = () => {
  const { isAuthenticated, isAdmin } = useContext(AuthContext);
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchUrls = async () => {
      try {
        const data = await getUserUrls();
        setUrls(data.urls);
      } catch (err) {
        setError('Failed to fetch your URLs');
      } finally {
        setLoading(false);
      }
    };
    if (isAuthenticated) {
      fetchUrls();
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) return <Navigate to="/login" />;
  if (isAdmin) return <Navigate to="/admin" />;

  // Pagination logic
  const indexOfLastUrl = currentPage * itemsPerPage;
  const indexOfFirstUrl = indexOfLastUrl - itemsPerPage;
  const currentUrls = urls.slice(indexOfFirstUrl, indexOfLastUrl);
  const totalPages = Math.ceil(urls.length / itemsPerPage);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="dashboard-page">
      <Navbar />
      <div className="container" style={{ marginTop: '80px', padding: '20px' }}>
        <h2>My Scanned URLs</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {loading ? (
          <p>Loading...</p>
        ) : urls.length === 0 ? (
          <p>You haven't scanned any URLs yet.</p>
        ) : (
          <div className="table-wrapper" style={{ overflowX: 'auto', marginTop: '20px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', borderRadius: '8px', overflow: 'hidden' }}>
              <thead style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                <tr>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold' }}>URL</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold' }}>Status</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold' }}>Risk Score</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold' }}>Date</th>
                </tr>
              </thead>
              <tbody>
                {currentUrls.map((u) => (
                  <tr key={u.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '12px', wordBreak: 'break-all' }}>{u.url}</td>
                    <td style={{ padding: '12px' }}>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '14px',
                        backgroundColor: u.isPhishing ? '#fee2e2' : '#dcfce3',
                        color: u.isPhishing ? '#ef4444' : '#22c55e',
                        fontWeight: 'bold'
                      }}>
                        {u.isPhishing ? 'Phishing' : 'Safe'}
                      </span>
                    </td>
                    <td style={{ padding: '12px' }}>{u.riskScore.toFixed(2)}%</td>
                    <td style={{ padding: '12px' }}>{new Date(u.analyzedAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', gap: '10px' }}>
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  style={{ padding: '8px 16px', borderRadius: '4px', border: '1px solid #ccc', backgroundColor: currentPage === 1 ? '#f3f4f6' : 'white', cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
                >
                  Previous
                </button>
                <span style={{ padding: '8px' }}>Page {currentPage} of {totalPages}</span>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  style={{ padding: '8px 16px', borderRadius: '4px', border: '1px solid #ccc', backgroundColor: currentPage === totalPages ? '#f3f4f6' : 'white', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
