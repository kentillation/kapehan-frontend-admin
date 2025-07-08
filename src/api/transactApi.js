import apiClient from '../axios';

export const TRANSACT_API = {
    ENDPOINTS: {
        FETCH: '/transactions',
        FETCH_SALES_BY_DATE: '/sales-by-date',
        FETCH_SALES: '/sales-only',
        FETCH_ORDERS: '/orders-only',
        FETCH_PRODUCTS: '/products-only',
        FETCH_STOCKS: '/stocks-only',
        FETCH_SALES_BY_MONTH: '/sales-by-month',

    },

    async fetchAllTransactionsApi(branchId, dateFilterId = null) {
        try {
            const authToken = localStorage.getItem('auth_token');
            if (!authToken) {
                throw new Error('No authentication token found');
            }
            let endpoint = `${this.ENDPOINTS.FETCH}/${branchId}`;
            if (dateFilterId) {
                endpoint += `?date_filter=${dateFilterId}`;
            }
            const response = await apiClient.get(endpoint, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                },
            });
            if (!response.data) {
                throw new Error('Invalid response from server');
            }
            return response.data;
        } catch (error) {
            console.error('[fetchAllTransactionsApi] Error fetching transactions:', error);
            throw error;
        }
    },

    async fetchSalesByDateApi(branchId, dateFilterId = null) {
        try {
            const authToken = localStorage.getItem('auth_token');
            if (!authToken) {
                throw new Error('No authentication token found');
            }
            let endpoint = `${this.ENDPOINTS.FETCH_SALES_BY_DATE}/${branchId}`;
            if (dateFilterId) {
                endpoint += `?date_filter=${dateFilterId}`;
            }
            const response = await apiClient.get(endpoint, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                },
            });
            if (!response.data) {
                throw new Error('Invalid response from server');
            }
            return response.data;
        } catch (error) {
            console.error('[fetchSalesByDateApi] Error fetching sales:', error);
            throw error;
        }
    },

    async fetchSalesOnlyApi(branchId, dateFilterId = null) {
        try {
            const authToken = localStorage.getItem('auth_token');
            if (!authToken) throw new Error('No authentication token found');
            let endpoint = `${this.ENDPOINTS.FETCH_SALES}/${branchId}`;
            if (dateFilterId) {
                endpoint += `?date_filter=${dateFilterId}`;
            }
            const response = await apiClient.get(endpoint, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                },
            });
            if (!response.data) {
                throw new Error('Invalid response from server');
            }
            return response.data;
        } catch (error) {
            console.error('[fetchSalesOnlyApi] Error fetching sales:', error);
            throw error;
        }
    },
    
    async fetchOrdersOnlyApi(branchId) {
        try {
            const authToken = localStorage.getItem('auth_token');
            if (!authToken) {
                throw new Error('No authentication token found');
            }
            let endpoint = `${this.ENDPOINTS.FETCH_ORDERS}/${branchId}`;
            const response = await apiClient.get(endpoint, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                },
            });
            if (!response.data) {
                throw new Error('Invalid response from server');
            }
            return response.data;
        } catch (error) {
            console.error('[fetchOrdersOnlyApi] Error fetching sales:', error);
            throw error;
        }
    },

    async fetchProductsOnlyApi(branchId) {
        try {
            const authToken = localStorage.getItem('auth_token');
            if (!authToken) {
                throw new Error('No authentication token found');
            }
            let endpoint = `${this.ENDPOINTS.FETCH_PRODUCTS}/${branchId}`;
            const response = await apiClient.get(endpoint, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                },
            });
            if (!response.data) {
                throw new Error('Invalid response from server');
            }
            return response.data;
        } catch (error) {
            console.error('[fetchProductsOnlyApi] Error fetching sales:', error);
            throw error;
        }
    },

    async fetchStocksOnlyApi(branchId) {
        try {
            const authToken = localStorage.getItem('auth_token');
            if (!authToken) {
                throw new Error('No authentication token found');
            }
            let endpoint = `${this.ENDPOINTS.FETCH_STOCKS}/${branchId}`;
            const response = await apiClient.get(endpoint, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                },
            });
            if (!response.data) {
                throw new Error('Invalid response from server');
            }
            return response.data;
        } catch (error) {
            console.error('[fetchProductsOnlyApi] Error fetching sales:', error);
            throw error;
        }
    },

    async fetchSalesByMonthApi(branchId, dateFilterId = null) {
        try {
            const authToken = localStorage.getItem('auth_token');
            if (!authToken) throw new Error('No authentication token found');
            let endpoint = `${this.ENDPOINTS.FETCH_SALES_BY_MONTH}/${branchId}`;
            if (dateFilterId) {
                endpoint += `?date_filter=${dateFilterId}`;
            }
            const response = await apiClient.get(endpoint, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                },
            });
            if (!response.data) {
                throw new Error('Invalid response from server');
            }
            return response.data;
        } catch (error) {
            console.error('[fetchSalesByMonthApi] Error fetching sales:', error);
            throw error;
        }
    }
};