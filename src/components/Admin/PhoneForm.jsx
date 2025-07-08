import { useState, useEffect } from 'react';
import { createPhone, updatePhone } from '../../services/phoneService';

const PhoneForm = ({ phone, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    price: '',
    image: '',
    description: '',
    specs: {
      display: '',
      processor: '',
      camera: '',
      battery: '',
      storage: ''
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (phone) {
      setFormData(phone);
    }
  }, [phone]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('specs.')) {
      const specKey = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        specs: {
          ...prev.specs,
          [specKey]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setLoading(true);
    setError('');

    try {
      // Quick validation
      if (!formData.name?.trim() || !formData.brand?.trim() || !formData.price) {
        throw new Error('Please fill in all required fields');
      }

      if (isNaN(formData.price) || formData.price <= 0) {
        throw new Error('Please enter a valid price');
      }

      if (phone) {
        await updatePhone(phone.id, formData);
      } else {
        await createPhone(formData);
      }
      
      onSave();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title">{phone ? 'Edit Phone' : 'Add New Phone'}</h5>
        {error && <div className="alert alert-danger">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6">
              <div className="mb-3">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="mb-3">
                <label className="form-label">Brand</label>
                <input
                  type="text"
                  className="form-control"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6">
              <div className="mb-3">
                <label className="form-label">Price (₹)</label>
                <input
                  type="number"
                  className="form-control"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="mb-3">
                <label className="form-label">Image URL</label>
                <input
                  type="url"
                  className="form-control"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea
              className="form-control"
              name="description"
              rows="3"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          <h6>Specifications</h6>
          <div className="row">
            <div className="col-md-6">
              <div className="mb-3">
                <label className="form-label">Display</label>
                <input
                  type="text"
                  className="form-control"
                  name="specs.display"
                  value={formData.specs.display}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="mb-3">
                <label className="form-label">Processor</label>
                <input
                  type="text"
                  className="form-control"
                  name="specs.processor"
                  value={formData.specs.processor}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-4">
              <div className="mb-3">
                <label className="form-label">Camera</label>
                <input
                  type="text"
                  className="form-control"
                  name="specs.camera"
                  value={formData.specs.camera}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="mb-3">
                <label className="form-label">Battery</label>
                <input
                  type="text"
                  className="form-control"
                  name="specs.battery"
                  value={formData.specs.battery}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="mb-3">
                <label className="form-label">Storage</label>
                <input
                  type="text"
                  className="form-control"
                  name="specs.storage"
                  value={formData.specs.storage}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          <div className="d-flex gap-2">
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Phone'}
            </button>
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={onCancel}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PhoneForm;