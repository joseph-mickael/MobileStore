import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './components/Home';
import PhoneDetails from './components/PhoneDetails';
import Cart from './components/Cart';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import AdminPanel from './components/Admin/AdminPanel';
import ProtectedRoute from './components/ProtectedRoute';
import Footer from './components/Footer';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="App d-flex flex-column min-vh-100">
            <Navbar />
            <main className="flex-grow-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/phone/:id" element={<PhoneDetails />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route 
                  path="/admin" 
                  element={
                    <ProtectedRoute>
                      <AdminPanel />
                    </ProtectedRoute>
                  } 
                />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;