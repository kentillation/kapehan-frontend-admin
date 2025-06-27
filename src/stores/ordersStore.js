import { defineStore } from 'pinia';
import { ORDER_API } from '@/api/ordersApi';

export const useOrdersStore = defineStore('orders', {
    state: () => ({
        orders: [],
        loading: false,
        error: null
    }),

    actions: {
        async fetchAllOrdersStore(branchId, dateFilterId = null) {
            this.loading = true;
            this.error = null;
            try {
                const response = await ORDER_API.fetchAllOrdersApi(branchId, dateFilterId);
                if (response && response.status === true) {
                    this.orders = response.data;
                } else {
                    throw new Error(response?.message || 'Failed to fetch orders');
                }
            } catch (error) {
                console.error('Error in fetchAllOrdersApi:', error);
                this.error = error.message || 'Failed to fetch orders';
                throw error;
            } finally {
                this.loading = false;
            }
        },
    },
});