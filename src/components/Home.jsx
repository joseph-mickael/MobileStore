import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { phones as localPhones } from '../data/phones';
import { getAllPhones } from '../services/phoneService';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const [phonesData, setPhonesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { firebaseAvailable } = useAuth();

  useEffect(() => {
    loadPhones();
  }, []);

  const loadPhones = async () => {
    try {
      setLoading(true);
      
      // Try to load Firebase data and combine with local
      try {
        const fbPhones = await getAllPhones();
        
        // Create a map to track which demo products have been synced to Firebase
        const syncedDemoIds = new Set();
        const firebaseProducts = [];
        
        fbPhones.forEach(fbPhone => {
          // Check if this Firebase product corresponds to a demo product
          const matchingDemo = localPhones.find(localPhone => 
            localPhone.name === fbPhone.name && 
            localPhone.brand === fbPhone.brand
          );
          
          if (matchingDemo) {
            syncedDemoIds.add(matchingDemo.id);
          }
          firebaseProducts.push(fbPhone);
        });
        
        // Include demo products that haven't been synced to Firebase
        const unsyncedDemoProducts = localPhones.filter(localPhone => 
          !syncedDemoIds.has(localPhone.id)
        );
        
        // Combine unsynced demo products with Firebase products
        const allPhones = [...unsyncedDemoProducts, ...firebaseProducts];
        setPhonesData(allPhones);
      } catch (firebaseError) {
        console.warn('Firebase data not available:', firebaseError.message);
        // Fallback to local data only
        setPhonesData(localPhones);
      }
    } catch (error) {
      console.error('Error loading phones:', error);
      // Fallback to local data only on any error
      setPhonesData(localPhones);
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
          <strong>Demo Mode:</strong> Firebase configuration required for full functionality.
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