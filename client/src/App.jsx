// client/src/App.jsx
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import AppRoutes from './routes/AppRoutes';
import Toast from './components/feedback/Toast';

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <AppRoutes />
          <Toast />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
