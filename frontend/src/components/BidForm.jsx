import React, { useState } from 'react';

function BidForm({ rfqId, onSubmit }) {
  const [formData, setFormData] = useState({
    supplierId: '',
    carrierName: '',
    amount: '',
    freightCharges: '',
    originCharges: '',
    destinationCharges: '',
    transitTime: '',
    validityDays: '',
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
    onSubmit({
      ...formData,
      rfqId,
      amount: Number(formData.amount),
      freightCharges: Number(formData.freightCharges || 0),
      originCharges: Number(formData.originCharges || 0),
      destinationCharges: Number(formData.destinationCharges || 0),
      validityDays: Number(formData.validityDays || 7),
    });
    setFormData({
      supplierId: '',
      carrierName: '',
      amount: '',
      freightCharges: '',
      originCharges: '',
      destinationCharges: '',
      transitTime: '',
      validityDays: '',
      deliveryDate: '',
      notes: '',
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bid-form">
      <div className="form-group">
        <label htmlFor="supplierId">Supplier ID:</label>
        <input id="supplierId" type="text" name="supplierId" value={formData.supplierId} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label htmlFor="carrierName">Carrier Name:</label>
        <input id="carrierName" type="text" name="carrierName" value={formData.carrierName} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label htmlFor="amount">Bid Amount:</label>
        <input id="amount" type="number" name="amount" step="0.01" value={formData.amount} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label htmlFor="freightCharges">Freight Charges:</label>
        <input id="freightCharges" type="number" name="freightCharges" step="0.01" value={formData.freightCharges} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label htmlFor="originCharges">Origin Charges:</label>
        <input id="originCharges" type="number" name="originCharges" step="0.01" value={formData.originCharges} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label htmlFor="destinationCharges">Destination Charges:</label>
        <input id="destinationCharges" type="number" name="destinationCharges" step="0.01" value={formData.destinationCharges} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label htmlFor="transitTime">Transit Time:</label>
        <input id="transitTime" type="text" name="transitTime" value={formData.transitTime} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label htmlFor="validityDays">Quote Validity (Days):</label>
        <input id="validityDays" type="number" name="validityDays" value={formData.validityDays} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label htmlFor="deliveryDate">Delivery Date:</label>
        <input id="deliveryDate" type="date" name="deliveryDate" value={formData.deliveryDate} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label htmlFor="notes">Notes:</label>
        <textarea id="notes" name="notes" value={formData.notes} onChange={handleChange} rows="3" />
      </div>
      <button type="submit">Submit Bid</button>
    </form>
  );
}

export default BidForm;
