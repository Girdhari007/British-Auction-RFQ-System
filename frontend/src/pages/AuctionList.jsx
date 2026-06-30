import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchData } from '../api';

const demoAuctions = [
  {
    _id: 'demo-1',
    title: 'Demo RFQ - Office Supplies',
    description: 'Stationery and office supplies for HQ',
    status: 'active',
  },
  {
    _id: 'demo-2',
    title: 'Demo RFQ - Logistics',
    description: 'Weekly freight for regional hubs',
    status: 'active',
  },
];

function AuctionList() {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [useDemo, setUseDemo] = useState(false);

  useEffect(() => {
    if (useDemo) {
      setAuctions(demoAuctions);
      setLoading(false);
      setError(null);
      return;
    }

    const loadAuctions = async () => {
      try {
        setLoading(true);
        const data = await fetchData('/rfqs');
        setAuctions(data);
        setError(null);
      } catch (err) {
        setError(err.message);
        setAuctions([]);
      } finally {
        setLoading(false);
      }
    };

    loadAuctions();
  }, [useDemo]);

  if (loading) return <div className="auction-list"><p>Loading auctions...</p></div>;

  return (
    <div className="auction-list">
      <h2>Active Auctions</h2>

      {error && (
        <div style={{ background: '#fff3cd', padding: 12, borderRadius: 6, marginBottom: 16 }}>
          <strong>Backend unreachable:</strong> {error}
          <div style={{ marginTop: 8 }}>
            <button onClick={() => setUseDemo(true)} style={{ marginRight: 8 }}>
              Use demo data
            </button>
            <span style={{ color: '#6c757d' }}>Or start the backend at http://localhost:5000</span>
          </div>
        </div>
      )}

      {auctions.length === 0 ? (
        <p>No auctions available</p>
      ) : (
        <ul>
          {auctions.map((auction) => (
            <li key={auction._id}>
              <Link to={`/auction/${auction._id}`}>
                <h3>{auction.title}</h3>
                <p>{auction.description}</p>
                <p>Status: {auction.status}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default AuctionList;
