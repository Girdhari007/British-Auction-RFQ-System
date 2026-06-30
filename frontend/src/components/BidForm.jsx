import React, { useState } from 'react';

function BidForm({ rfqId, onSubmit }) {
  const [formData, setFormData] = useState({
    supplierId: '',
    amount: '',
    deliveryDate: '',
    notes: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...formData, rfqId });
    setFormData({ supplierId: '', amount: '', deliveryDate: '', notes: '' });
  };

  return (
    <form onSubmit={handleSubmit} className="bid-form">
      <div className="form-group">
        <label htmlFor="supplierId">Supplier ID:</label>
        <input
          id="supplierId"
          type="text"
          name="supplierId"
          value={formData.supplierId}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="amount">Bid Amount:</label>
        <input
          id="amount"
          type="number"
          name="amount"
          step="0.01"
          value={formData.amount}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="deliveryDate">Delivery Date:</label>
        <input
          id="deliveryDate"
          type="date"
          name="deliveryDate"
          value={formData.deliveryDate}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="notes">Notes:</label>
        <textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows="3"
        />
      </div>
      <button type="submit">Submit Bid</button>
    </form>
  );
}

export default BidForm;
