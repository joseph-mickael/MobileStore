import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const { items, updateQuantity, removeFromCart, clearCart, getTotalPrice } = useCart();
  const navigate = useNavigate();
  
  if (items.length === 0) {
    return (
      <div className="container mt-4">
        <div className="text-center">
          <h2>Your Cart is Empty</h2>
          <p className="text-muted">Add some phones to your cart to see them here.</p>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/')}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-12">
          <h2 className="mb-4">Shopping Cart</h2>
        </div>
      </div>
      
      <div className="row">
        <div className="col-md-8">
          {items.map(item => (
            <div key={item.id} className="card mb-3">
              <div className="row g-0">
                <div className="col-md-4">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="img-fluid rounded-start"
                    style={{ height: '250px', objectFit: 'cover', width: '100%' }}
                  />
                </div>
                <div className="col-md-8">
                  <div className="card-body">
                    <h5 className="card-title">{item.name}</h5>
                    <p className="card-text text-muted">{item.brand}</p>
                    <p className="card-text"><strong>₹{item.price.toLocaleString('en-IN')}</strong></p>
                    
                    <div className="row align-items-center">
                      <div className="col-md-6">
                        <div className="input-group" style={{ width: '140px' }}>
                          <button 
                            className="btn btn-outline-secondary"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            -
                          </button>
                          <span className="form-control text-center bg-light">
                            {item.quantity}
                          </span>
                          <button 
                            className="btn btn-outline-secondary"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <button 
                          className="btn btn-danger btn-sm"
                          onClick={() => removeFromCart(item.id)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Order Summary</h5>
              <hr />
              <div className="d-flex justify-content-between mb-2">
                <span>Total Items:</span>
                <span>{items.reduce((total, item) => total + item.quantity, 0)}</span>
              </div>
              <div className="d-flex justify-content-between mb-3">
                <span><strong>Total Price:</strong></span>
                <span><strong>₹{getTotalPrice().toLocaleString('en-IN')}</strong></span>
              </div>
              <div className="d-grid gap-2">
                <button className="btn btn-success">
                  Proceed to Checkout
                </button>
                <button 
                  className="btn btn-outline-secondary"
                  onClick={() => navigate('/')}
                >
                  Continue Shopping
                </button>
                <button 
                  className="btn btn-outline-danger"
                  onClick={clearCart}
                >
                  Clear Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;