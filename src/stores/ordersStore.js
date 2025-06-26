import { defineStore } from 'pinia';
import { ORDER_API } from '@/api/ordersApi';

export const useOrdersStore = defineStore('orders', {
    state: () => ({
        orders: [],
        loading: false,
        error: null
    }),

    actions: {
        async fetchAllOrdersStore(branchId) {
            this.loading = true;
            this.error = null;
            try {
                if (!ORDER_API || typeof ORDER_API.fetchAllOrdersApi !== 'function') {
                    throw new Error('ORDER_API service is not properly initialized');
                }
                const response = await ORDER_API.fetchAllOrdersApi(branchId);
                if (response && response.status === true) {
                    this.orders = response.data;
                } else {
                    throw new Error('Failed to fetch orders');
                }
            } catch (error) {
                console.error('Error in fetchAllOrdersApi:', error);
                this.error = 'Failed to fetch orders';
                throw error;
            } finally {
                this.loading = false;
            }
        },
    },
});