import * as restaurantService from '../services/restaurantService.js';

export function listRestaurants(req, res) {
  let restaurants = restaurantService.getAllRestaurants();

  const { category, search, rating, sort } = req.query;

  if (category) {
    const cat = category.toLowerCase();
    restaurants = restaurants.filter((r) =>
      r.categories.some((c) => c.toLowerCase() === cat)
    );
  }

  if (search) {
    const q = search.toLowerCase();
    restaurants = restaurants.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.cuisineType.toLowerCase().includes(q) ||
        r.categories.some((c) => c.toLowerCase().includes(q))
    );
  }

  if (rating) {
    const minRating = parseFloat(rating);
    if (!isNaN(minRating)) {
      restaurants = restaurants.filter((r) => r.rating >= minRating);
    }
  }

  if (sort) {
    if (sort === 'deliveryTime') {
      restaurants.sort((a, b) => a.deliveryTimeMin - b.deliveryTimeMin);
    } else if (sort === 'rating') {
      restaurants.sort((a, b) => b.rating - a.rating);
    }
  }

  res.json({
    success: true,
    data: restaurants,
    count: restaurants.length,
  });
}

export function getFeaturedRestaurants(req, res) {
  const featured = restaurantService.getFeaturedRestaurants();
  res.json({
    success: true,
    data: featured,
    count: featured.length,
  });
}

export function getCategories(req, res) {
  const categories = restaurantService.getCategories();
  res.json({
    success: true,
    data: categories,
    count: categories.length,
  });
}

export function getRestaurantById(req, res) {
  const { restaurantId } = req.params;
  const restaurant = restaurantService.getRestaurantById(restaurantId);
  if (!restaurant) {
    return res.status(404).json({
      success: false,
      message: 'Restaurant not found',
      error: { code: 'NOT_FOUND', details: [] },
    });
  }
  res.json({
    success: true,
    data: restaurant,
  });
}

export function getReviews(req, res) {
  const { restaurantId } = req.params;
  const restaurant = restaurantService.getRestaurantById(restaurantId);
  if (!restaurant) {
    return res.status(404).json({
      success: false,
      message: 'Restaurant not found',
      error: { code: 'NOT_FOUND', details: [] },
    });
  }
  res.json({
    success: true,
    data: restaurant.reviews || [],
    count: (restaurant.reviews || []).length,
  });
}

export function addReview(req, res) {
  const { restaurantId } = req.params;
  const restaurant = restaurantService.getRestaurantById(restaurantId);
  if (!restaurant) {
    return res.status(404).json({
      success: false,
      message: 'Restaurant not found',
      error: { code: 'NOT_FOUND', details: [] },
    });
  }

  const { rating, comment, userName } = req.validatedBody;
  const newReview = {
    id: `rev-${Date.now()}`,
    userName: userName || req.user?.username || 'Anonymous',
    rating,
    comment,
    createdAt: new Date().toISOString(),
  };

  restaurant.reviews.push(newReview);
  restaurant.reviewCount = (restaurant.reviewCount || 0) + 1;

  const totalRating = restaurant.reviews.reduce((sum, r) => sum + r.rating, 0);
  restaurant.rating = Math.round((totalRating / restaurant.reviews.length) * 10) / 10;

  res.status(201).json({
    success: true,
    data: newReview,
  });
}
