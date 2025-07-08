import { useState, useEffect } from 'react';
import { getAllPhones, deletePhone } from '../../services/phoneService';
import { phones as localPhones } from '../../data/phones';
import PhoneForm from './PhoneForm';

const AdminPanel = () => {
  const [phones, setPhones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPhone, setEditingPhone] = useState(null);
  const [error, setError] = useState('');
  const [dataSource, setDataSource] = useState('local'); // 'local' or 'firebase'

  useEffect(() => {
    loadPhones();
  }, []);

  const loadPhones = async () => {
    try {
      setLoading(true);
      setError('');
      
      // First, show local data immediately for fast loading
      setPhones(localPhones);
      setDataSource('local');
      setLoading(false);
      
      // Then try to load Firebase data in the background
      try {
        const firebasePhones = await getAllPhones();
        if (firebasePhones && firebasePhones.length > 0) {
          setPhones(firebasePhones);
          setDataSource('firebase');
        }
      } catch (firebaseError) {
        console.warn('Firebase data not available, using local data:', firebaseError);
        // Keep using local data if Firebase fails
      }
    } catch (error) {
      setError('Error loading phones: ' + error.message);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (dataSource === 'local') {
      alert('Cannot delete from local data. This feature requires Firebase connection.');
      return;
    }

    if (window.confirm('Are you sure you want to delete this phone?')) {
      try {
        await deletePhone(id);
        setPhones(phones.filter(phone => phone.id !== id));
      } catch (error) {
        setError('Error deleting phone: ' + error.message);
      }
    }
  };

  const handleEdit = (phone) => {
    if (dataSource === 'local') {
      alert('Cannot edit local data. This feature requires Firebase connection.');
      return;
    }
    setEditingPhone(phone);
    setShowForm(true);
  };

  const handleAddNew = () => {
    if (dataSource === 'local') {
      alert('Cannot add to local data. This feature requires Firebase connection.');
      return;
    }
    setShowForm(true);
  };

  const handleFormSave = () => {
    setShowForm(false);
    setEditingPhone(null);
    loadPhones();
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingPhone(null);
  };

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>Admin Panel - Manage Phones</h2>
          <small className="text-muted">
            Data Source: {dataSource === 'local' ? 'Local Data (Read-only)' : 'Firebase (Full CRUD)'}
          </small>
        </div>
        <button 
          className="btn btn-primary"
          onClick={handleAddNew}
          disabled={dataSource === 'local'}
        >
          Add New Phone
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {dataSource === 'local' && (
        <div className="alert alert-info">
          <strong>Note:</strong> Currently showing local data. Firebase features (add/edit/delete) are disabled. 
          Check your Firebase configuration if you need full admin functionality.
        </div>
      )}

      {showForm && dataSource === 'firebase' && (
        <div className="mb-4">
          <PhoneForm 
            phone={editingPhone}
            onSave={handleFormSave}
            onCancel={handleFormCancel}
          />
        </div>
      )}

      <div className="row">
        {phones.map(phone => (
          <div key={phone.id} className="col-lg-4 col-md-6 mb-4">
            <div className="card h-100">
              <img 
                src={phone.image} 
                className="card-img-top" 
                alt={phone.name}
                style={{ height: '250px', objectFit: 'cover' }}
              />
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{phone.name}</h5>
                <p className="card-text text-muted">{phone.brand}</p>
                <p className="card-text">₹{phone.price?.toLocaleString('en-IN')}</p>
                <div className="mt-auto">
                  <div className="d-flex gap-2">
                    <button 
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => handleEdit(phone)}
                      disabled={dataSource === 'local'}
                    >
                      Edit
                    </button>
                    <button 
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => handleDelete(phone.id)}
                      disabled={dataSource === 'local'}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {phones.length === 0 && (
        <div className="text-center mt-5">
          <p className="text-muted">No phones found. Add some phones to get started.</p>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;