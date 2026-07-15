import { createContext, useState, useCallback } from 'react';
import api from '../services/api';

export const RestaurantContext = createContext(null);

export function RestaurantProvider({ children }) {
  const [restaurants, setRestaurants] = useState([]);
  const [featuredRestaurants, setFeaturedRestaurants] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRestaurants = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/restaurants', { params: filters });
      setRestaurants(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch restaurants');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchFeatured = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/restaurants/featured');
      setFeaturedRestaurants(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch featured restaurants');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await api.get('/restaurants/categories');
      setCategories(res.data);
    } catch {}
  }, []);

  const fetchRestaurant = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/restaurants/${id}`);
      setSelectedRestaurant(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch restaurant');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMenu = useCallback(async (restaurantId) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/menu/${restaurantId}`);
      setMenuItems(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch menu');
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <RestaurantContext.Provider value={{
      restaurants, featuredRestaurants, categories, selectedRestaurant, menuItems, loading, error,
      fetchRestaurants, fetchFeatured, fetchCategories, fetchRestaurant, fetchMenu, setSelectedRestaurant,
    }}>
      {children}
    </RestaurantContext.Provider>
  );
}
