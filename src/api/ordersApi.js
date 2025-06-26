import apiClient from '../axios';

export const ORDER_API = {
    ENDPOINTS: {
        FETCH: '/orders',
    },

    /**
     * Orders Information
     * @param {Object} transaction - Transaction data to update
     * @param {string|number} transaction.transaction_id - Required transaction ID
     * @returns {Promise<Object>} Updated transaction data
     * @throws {Error} Enhanced error with server response details
     */

    async fetchAllOrdersApi(branchId) {
        try {
            const authToken = localStorage.getItem('auth_token');
            if (!authToken) {
                throw new Error('No authentication token found');
            }
            const config = {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                },
            };
            const response = await apiClient.get(
                `${this.ENDPOINTS.FETCH}/${branchId}`,
                config
            );
            if (!response.data) {
                throw new Error('Invalid response from server');
            }
            return response.data;
        } catch (error) {
            console.error('[OrdersAPI] Error fetching orders:', error);

            const enhancedError = new Error('Failed to fetch orders');
            throw enhancedError;
        }
    },
};