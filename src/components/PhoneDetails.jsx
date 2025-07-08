import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { phones as localPhones } from '../data/phones';
import { getPhoneById } from '../services/phoneService';
import { useCart } from '../context/CartContext';

const PhoneDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [phone, setPhone] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { addToCart } = useCart();
  
  useEffect(() => {
    const loadPhone = async () => {
      try {
        setLoading(true);
        
        // Try to load from Firebase first
        try {
          const firebasePhone = await getPhoneById(id);
          setPhone(firebasePhone);
        } catch (firebaseError) {
          // Fall back to local data
          const foundPhone = localPhones.find(p => p.id === parseInt(id));
          if (foundPhone) {
            setPhone(foundPhone);
          } else {
            setError('Phone not found');
          }
        }
        
        setLoading(false);
      } catch (error) {
        setError('Error loading phone details');
        setLoading(false);
      }
    };

    loadPhone();
  }, [id]);
  
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

  if (error || !phone) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger">{error}</div>
        <button 
          className="btn btn-primary"
          onClick={() => navigate('/')}
        >
          ← Back to Home
        </button>
      </div>
    );
  }
  
  const handleAddToCart = () => {
    addToCart(phone);
  };
  
  return (
    <div className="container mt-4">
      <button 
        className="btn btn-outline-secondary mb-3"
        onClick={() => navigate('/')}
      >
        ← Back to Home
      </button>
      
      <div className="row">
        <div className="col-md-6">
          <img 
            src={phone.image} 
            alt={phone.name}
            className="img-fluid rounded shadow"
            style={{ height: '600px', width: '100%', objectFit: 'cover' }}
          />
        </div>
        
        <div className="col-md-6">
          <h1 className="mb-3">{phone.name}</h1>
          <h4 className="text-muted mb-3">{phone.brand}</h4>
          <p className="mb-4">{phone.description}</p>
          
          <div className="mb-4">
            <h3 className="text-primary">₹{phone.price.toLocaleString('en-IN')}</h3>
          </div>
          
          <div className="mb-4">
            <h5>Specifications</h5>
            <ul className="list-unstyled">
              <li><strong>Display:</strong> {phone.specs.display}</li>
              <li><strong>Processor:</strong> {phone.specs.processor}</li>
              <li><strong>Camera:</strong> {phone.specs.camera}</li>
              <li><strong>Battery:</strong> {phone.specs.battery}</li>
              <li><strong>Storage:</strong> {phone.specs.storage}</li>
            </ul>
          </div>
          
          <div className="d-grid gap-2">
            <button 
              className="btn btn-primary btn-lg"
              onClick={handleAddToCart}
            >
              Add to Cart
            </button>
            <button 
              className="btn btn-outline-secondary"
              onClick={() => navigate('/cart')}
            >
              View Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhoneDetails;