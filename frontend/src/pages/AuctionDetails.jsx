import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchData } from '../api';
import BidForm from '../components/BidForm';
import BidTable from '../components/BidTable';
import ActivityLog from '../components/ActivityLog';

function AuctionDetails() {
  const { id } = useParams();
  const [auction, setAuction] = useState(null);
  const [bids, setBids] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadAuctionDetails = async () => {
      try {
        setLoading(true);
        const auctionData = await fetchData(`/rfqs/${id}`);
        setAuction(auctionData);

        const bidsData = await fetchData(`/rfqs/${id}/bids`);
        setBids(bidsData);

        const activitiesData = await fetchData(`/rfqs/${id}/activities`);
        setActivities(activitiesData);

        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadAuctionDetails();
  }, [id]);

  const handleBidSubmit = async (bidData) => {
    try {
      const response = await fetch(`/api/bids`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bidData),
      });
      if (response.ok) {
        const newBid = await response.json();
        setBids((prev) => [...prev, newBid]);
      }
    } catch (err) {
      console.error('Error submitting bid:', err);
    }
  };

  if (loading) return <div className="auction-details"><p>Loading...</p></div>;
  if (error) return <div className="auction-details"><p>Error: {error}</p></div>;
  if (!auction) return <div className="auction-details"><p>Auction not found</p></div>;

  return (
    <div className="auction-details">
      <h2>{auction.title}</h2>
      <p>{auction.description}</p>
      <p>Status: {auction.status}</p>

      <section>
        <h3>Submit a Bid</h3>
        <BidForm rfqId={id} onSubmit={handleBidSubmit} />
      </section>

      <section>
        <h3>Current Bids</h3>
        <BidTable bids={bids} />
      </section>

      <section>
        <ActivityLog activities={activities} />
      </section>
    </div>
  );
}

export default AuctionDetails;
