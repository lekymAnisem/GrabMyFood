import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { RestaurantProvider } from './context/RestaurantContext';
import { OrderProvider } from './context/OrderContext';
import AppRoutes from './routes/AppRoutes';

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <RestaurantProvider>
          <OrderProvider>
            <AppRoutes />
          </OrderProvider>
        </RestaurantProvider>
      </CartProvider>
    </AuthProvider>
  );
}
