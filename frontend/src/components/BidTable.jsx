import React from 'react';

function BidTable({ bids }) {
  if (!bids || bids.length === 0) {
    return <div className="bid-table"><p>No bids available</p></div>;
  }

  return (
    <div className="bid-table">
      <table>
        <thead>
          <tr>
            <th>Supplier ID</th>
            <th>Carrier</th>
            <th>Amount</th>
            <th>Freight</th>
            <th>Origin</th>
            <th>Destination</th>
            <th>Transit</th>
            <th>Validity</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {bids.map((bid) => (
            <tr key={bid._id}>
              <td>{bid.supplierId}</td>
              <td>{bid.carrierName}</td>
              <td>${bid.amount.toFixed(2)}</td>
              <td>${bid.freightCharges?.toFixed(2) || '0.00'}</td>
              <td>${bid.originCharges?.toFixed(2) || '0.00'}</td>
              <td>${bid.destinationCharges?.toFixed(2) || '0.00'}</td>
              <td>{bid.transitTime || '—'}</td>
              <td>{bid.validityDays || '—'} days</td>
              <td>{bid.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default BidTable;
