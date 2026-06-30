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
            <th>Amount</th>
            <th>Delivery Date</th>
            <th>Status</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
          {bids.map((bid) => (
            <tr key={bid._id}>
              <td>{bid.supplierId}</td>
              <td>${bid.amount.toFixed(2)}</td>
              <td>{new Date(bid.deliveryDate).toLocaleDateString()}</td>
              <td>{bid.status}</td>
              <td>{bid.notes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default BidTable;
