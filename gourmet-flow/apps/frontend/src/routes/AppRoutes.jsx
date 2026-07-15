import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import ProtectedRoute from '../components/ProtectedRoute';
import HomePage from '../pages/HomePage';
import RestaurantDetailsPage from '../pages/RestaurantDetailsPage';
import CartPage from '../pages/CartPage';
import CheckoutPage from '../pages/CheckoutPage';
import PaymentPage from '../pages/PaymentPage';
import OrderTrackingPage from '../pages/OrderTrackingPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import ProfilePage from '../pages/ProfilePage';
import OrderHistoryPage from '../pages/OrderHistoryPage';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout><HomePage /></MainLayout>} />
      <Route path="/restaurants/:id" element={<MainLayout><RestaurantDetailsPage /></MainLayout>} />
      <Route path="/cart" element={<MainLayout><CartPage /></MainLayout>} />
      <Route path="/checkout" element={<MainLayout><CheckoutPage /></MainLayout>} />
      <Route path="/payment" element={<MainLayout><PaymentPage /></MainLayout>} />
      <Route path="/orders/:id/tracking" element={<MainLayout><OrderTrackingPage /></MainLayout>} />
      <Route path="/login" element={<MainLayout><LoginPage /></MainLayout>} />
      <Route path="/register" element={<MainLayout><RegisterPage /></MainLayout>} />
      <Route path="/profile" element={<MainLayout><ProtectedRoute><ProfilePage /></ProtectedRoute></MainLayout>} />
      <Route path="/orders" element={<MainLayout><ProtectedRoute><OrderHistoryPage /></ProtectedRoute></MainLayout>} />
    </Routes>
  );
}
