import { useState, useEffect } from 'react';
import { getAllPhones, deletePhone, createPhone } from '../../services/phoneService';
import { phones as localPhones } from '../../data/phones';
import PhoneForm from './PhoneForm';

const AdminPanel = () => {
  const [phones, setPhones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPhone, setEditingPhone] = useState(null);
  const [error, setError] = useState('');
  const [dataSource, setDataSource] = useState('local');
  const [syncingDemo, setSyncingDemo] = useState(false);

  useEffect(() => {
    loadPhones();
  }, []);

  const loadPhones = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Try to load Firebase data first
      try {
        const firebasePhones = await getAllPhones();
        
        // Combine local phones with Firebase phones for editing
        // Local phones will be shown but marked as needing sync
        const allPhones = [...localPhones, ...firebasePhones];
        
        setPhones(allPhones);
        setDataSource('firebase');
        setLoading(false);
      } catch (firebaseError) {
        console.warn('Firebase data not available, using local data:', firebaseError.message);
        // Fall back to local data if Firebase fails
        setPhones(localPhones);
        setDataSource('local');
        setLoading(false);
      }
    } catch (error) {
      setError('Error loading phones: ' + error.message);
      setLoading(false);
    }
  };

  const syncDemoProductToFirebase = async (phone) => {
    try {
      setSyncingDemo(true);
      // Create a copy of the demo product in Firebase
      // Remove the numeric ID since Firebase will generate its own
      const { id, ...phoneWithoutId } = phone;
      const firebasePhone = await createPhone(phoneWithoutId);
      
      // Refresh the phones list to show the synced product
      await loadPhones();
      return firebasePhone;
    } catch (error) {
      setError('Error syncing demo product: ' + error.message);
      throw error;
    } finally {
      setSyncingDemo(false);
    }
  };

  const handleDelete = async (id) => {
    if (dataSource === 'local') {
      alert('Cannot delete from local data. This feature requires Firebase connection.');
      return;
    }

    // Check if it's a demo product (numeric ID)
    if (typeof id === 'number') {
      // For demo products, just remove from local state
      if (window.confirm('Are you sure you want to delete this demo product?')) {
        setPhones(phones.filter(phone => phone.id !== id));
      }
    } else {
      // For Firebase products, delete from Firebase
      if (window.confirm('Are you sure you want to delete this phone?')) {
        try {
          await deletePhone(id);
          setPhones(phones.filter(phone => phone.id !== id));
        } catch (error) {
          setError('Error deleting phone: ' + error.message);
        }
      }
    }
  };

  const handleEdit = async (phone) => {
    if (dataSource === 'local') {
      alert('Cannot edit local data. This feature requires Firebase connection.');
      return;
    }

    // If it's a demo product (numeric ID), sync it to Firebase first
    if (typeof phone.id === 'number') {
      try {
        const syncedPhone = await syncDemoProductToFirebase(phone);
        setEditingPhone(syncedPhone);
        setShowForm(true);
      } catch (error) {
        // Error already handled in syncDemoProductToFirebase
      }
    } else {
      // It's already a Firebase product, edit directly
      setEditingPhone(phone);
      setShowForm(true);
    }
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

  const isFirebaseProduct = (phone) => typeof phone.id === 'string';
  const isDemoProduct = (phone) => typeof phone.id === 'number';

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

      {syncingDemo && (
        <div className="alert alert-info">
          <div className="d-flex align-items-center">
            <div className="spinner-border spinner-border-sm me-2" role="status"></div>
            Syncing demo product to Firebase for editing...
          </div>
        </div>
      )}

      {dataSource === 'local' && (
        <div className="alert alert-info">
          <strong>Demo Mode:</strong> Currently showing local data. Firebase features (add/edit/delete) are disabled. 
          <br />
          <small>To enable full functionality, ensure Firebase Authentication and Firestore are properly configured in your Firebase Console.</small>
        </div>
      )}

      {dataSource === 'firebase' && (
        <div className="alert alert-success">
          <strong>Live Mode:</strong> All products are editable! Demo products will be synced to Firebase when you edit them.
          <br />
          <small>Changes will be visible on the home page immediately after saving.</small>
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
          <div key={`${phone.id}-${isDemoProduct(phone) ? 'demo' : 'firebase'}`} className="col-lg-4 col-md-6 mb-4">
            <div className="card h-100">
              <div className="position-relative">
                <img 
                  src={phone.image} 
                  className="card-img-top" 
                  alt={phone.name}
                  style={{ height: '250px', objectFit: 'cover' }}
                />
                {isDemoProduct(phone) && (
                  <span className="position-absolute top-0 start-0 badge bg-info m-2">
                    Demo Product
                  </span>
                )}
                {isFirebaseProduct(phone) && (
                  <span className="position-absolute top-0 start-0 badge bg-success m-2">
                    Your Product
                  </span>
                )}
              </div>
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
                      title={isDemoProduct(phone) ? 'Will sync to Firebase for editing' : 'Edit this product'}
                    >
                      Edit
                    </button>
                    <button 
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => handleDelete(phone.id)}
                      disabled={dataSource === 'local'}
                      title="Delete this product"
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