import api from './api.js';

/**
 * Inventory API service — wraps all /api/inventory endpoints.
 */
export const inventoryService = {
  /**
   * Create a new inventory item.
   * @param {object} data - Item details
   */
  createInventoryItem: async (data) => {
    const response = await api.post('/inventory', data);
    return response.data;
  },

  /**
   * Get all inventory items with filters and pagination.
   * @param {object} params - { page, limit, search, category, status, sort }
   */
  getInventoryItems: async (params) => {
    const response = await api.get('/inventory', { params });
    return response.data;
  },

  /**
   * Get a single inventory item by ID.
   * @param {string} id - Inventory item ID
   */
  getInventoryItemById: async (id) => {
    const response = await api.get(`/inventory/${id}`);
    return response.data;
  },

  /**
   * Update an inventory item.
   * @param {string} id - Inventory item ID
   * @param {object} data - Updated details
   */
  updateInventoryItem: async (id, data) => {
    const response = await api.put(`/inventory/${id}`, data);
    return response.data;
  },

  /**
   * Update inventory quantity.
   * @param {string} id - Inventory item ID
   * @param {object} data - { quantityChange, reason }
   */
  updateQuantity: async (id, data) => {
    const response = await api.put(`/inventory/${id}/quantity`, data);
    return response.data;
  },

  /**
   * Delete an inventory item.
   * @param {string} id - Inventory item ID
   */
  deleteInventoryItem: async (id) => {
    const response = await api.delete(`/inventory/${id}`);
    return response.data;
  },

  /**
   * Get low stock items.
   */
  getLowStockItems: async () => {
    const response = await api.get('/inventory/alerts/low-stock');
    return response.data;
  },

  /**
   * Get out of stock items.
   */
  getOutOfStockItems: async () => {
    const response = await api.get('/inventory/alerts/out-of-stock');
    return response.data;
  },

  /**
   * Get expiring items.
   */
  getExpiringItems: async () => {
    const response = await api.get('/inventory/alerts/expiring');
    return response.data;
  },

  /**
   * Get expired items.
   */
  getExpiredItems: async () => {
    const response = await api.get('/inventory/alerts/expired');
    return response.data;
  },

  /**
   * Get inventory statistics.
   */
  getInventoryStats: async () => {
    const response = await api.get('/inventory/stats');
    return response.data;
  },

  /**
   * Get inventory by category.
   * @param {string} category - Category name
   * @param {object} params - { page, limit }
   */
  getInventoryByCategory: async (category, params) => {
    const response = await api.get(`/inventory/category/${category}`, { params });
    return response.data;
  },
};

export default inventoryService;
