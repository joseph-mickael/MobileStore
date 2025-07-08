import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { phones as localPhones } from '../data/phones';
import { getAllPhones } from '../services/phoneService';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const [phonesData, setPhonesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [firebasePhones, setFirebasePhones] = useState([]);
  const [hasFirebaseData, setHasFirebaseData] = useState(false);
  const { addToCart } = useCart();
  const { firebaseAvailable } = useAuth();

  useEffect(() => {
    loadPhones();
  }, []);

  const loadPhones = async () => {
    try {
      setLoading(true);
      
      // Always start with local phones
      let allPhones = [...localPhones];
      
      // Try to load Firebase data and combine with local
      try {
        const fbPhones = await getAllPhones();
        setFirebasePhones(fbPhones);
        setHasFirebaseData(true);
        
        // Combine local phones with Firebase phones
        // Firebase phones will have string IDs, local phones have number IDs
        allPhones = [...localPhones, ...fbPhones];
      } catch (firebaseError) {
        console.warn('Firebase data not available:', firebaseError.message);
        setHasFirebaseData(false);
        // allPhones already contains local phones
      }
      
      setPhonesData(allPhones);
    } catch (error) {
      console.error('Error loading phones:', error);
      // Fallback to local data only on any error
      setPhonesData(localPhones);
      setHasFirebaseData(false);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (phone) => {
    addToCart(phone);
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
      {!firebaseAvailable && (
        <div className="alert alert-info mb-4">
          <strong>Demo Mode:</strong> Firebase configuration required for full functionality. Currently showing local demo products only.
        </div>
      )}
      
      {firebaseAvailable && hasFirebaseData && firebasePhones.length > 0 && (
        <div className="alert alert-success mb-4">
          <strong>Live Data:</strong> Showing {localPhones.length} demo products + {firebasePhones.length} products from your store. Add more via Admin Panel!
        </div>
      )}
      
      {firebaseAvailable && !hasFirebaseData && (
        <div className="alert alert-warning mb-4">
          <strong>Local Products:</strong> Showing {localPhones.length} demo products. Add your own products via Admin Panel to see them here!
        </div>
      )}
      
      <div className="row mb-4">
        <div className="col-12">
          <h1 className="text-center mb-4">Mobile Phones for Sale</h1>
          <p className="text-center text-muted">Discover our collection of the latest smartphones</p>
        </div>
      </div>
      
      <div className="row">
        {phonesData.map(phone => (
          <div key={phone.id} className="col-lg-4 col-md-6 mb-4">
            <div className="card h-100 shadow-sm">
              <img 
                src={phone.image} 
                className="card-img-top" 
                alt={phone.name}
                style={{ height: '350px', objectFit: 'cover', width: '100%' }}
              />
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{phone.name}</h5>
                <p className="card-text text-muted mb-2">{phone.brand}</p>
                <p className="card-text">{phone.description}</p>
                {hasFirebaseData && typeof phone.id === 'string' && (
                  <small className="text-success mb-2">✓ Your Product</small>
                )}
                <div className="mt-auto">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span className="h5 mb-0 text-primary">₹{phone.price.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="d-grid gap-2">
                    <Link 
                      to={`/phone/${phone.id}`} 
                      className="btn btn-outline-primary"
                    >
                      View Details
                    </Link>
                    <button 
                      className="btn btn-primary"
                      onClick={() => handleAddToCart(phone)}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;