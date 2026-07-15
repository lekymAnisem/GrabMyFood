import * as menuService from '../services/menuService.js';

export function getMenu(req, res) {
  const { restaurantId } = req.params;
  const menu = menuService.getMenuByRestaurantGrouped(restaurantId);

  const totalItems = Object.values(menu).reduce((sum, items) => sum + items.length, 0);

  if (totalItems === 0) {
    return res.status(404).json({
      success: false,
      message: 'Menu not found for this restaurant',
      error: { code: 'NOT_FOUND', details: [] },
    });
  }

  res.json({
    success: true,
    data: {
      restaurantId,
      categories: menu,
    },
    count: totalItems,
  });
}

export function getCategories(req, res) {
  const categories = menuService.getAllCategories();
  res.json({
    success: true,
    data: categories,
    count: categories.length,
  });
}

export function getItemById(req, res) {
  const { itemId } = req.params;
  const item = menuService.getMenuItemById(itemId);
  if (!item) {
    return res.status(404).json({
      success: false,
      message: 'Menu item not found',
      error: { code: 'NOT_FOUND', details: [] },
    });
  }
  res.json({
    success: true,
    data: item,
  });
}

export function getFeaturedItems(req, res) {
  const items = menuService.getFeaturedItems();
  res.json({
    success: true,
    data: items,
    count: items.length,
  });
}
