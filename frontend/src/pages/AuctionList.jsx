import React, { useEffect, useState } from 'react';
import { fetchData } from '../api';

function AuctionList() {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
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
  }, []);

  if (loading) return <div className="auction-list"><p>Loading auctions...</p></div>;
  if (error) return <div className="auction-list"><p>Error: {error}</p></div>;

  return (
    <div className="auction-list">
      <h2>Active Auctions</h2>
      {auctions.length === 0 ? (
        <p>No auctions available</p>
      ) : (
        <ul>
          {auctions.map((auction) => (
            <li key={auction._id}>
              <a href={`/auction/${auction._id}`}>
                <h3>{auction.title}</h3>
                <p>{auction.description}</p>
                <p>Status: {auction.status}</p>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default AuctionList;
