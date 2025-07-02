import { defineStore } from 'pinia';
import { TRANSACT_API } from '@/api/transactApi';

export const useTransactStore = defineStore('transactions', {
    state: () => ({
        transactions: [],
        salesData: [],
        loading: false,
        error: null
    }),

    actions: {
        async fetchAllTransactionsStore(branchId, dateFilterId = null) {
            this.loading = true;
            this.error = null;
            try {
                const response = await TRANSACT_API.fetchAllTransactionsApi(branchId, dateFilterId);
                if (response && response.status === true) {
                    this.transactions = response.data;
                } else {
                    throw new Error(response?.message || 'Failed to fetch transactions');
                }
            } catch (error) {
                console.error('Error in fetchAllTransactionsApi:', error);
                this.error = error.message || 'Failed to fetch transactions';
                throw error;
            } finally {
                this.loading = false;
            }
        },
        async fetchSalesStore(branchId, dateFilterId = null) {
            this.loading = true;
            this.error = null;
            try {
                const response = await TRANSACT_API.fetchSalesApi(branchId, dateFilterId);
                if (response && response.status === true) {
                    this.salesData = response.data;
                } else {
                    throw new Error(response?.message || 'Failed to fetch sales');
                }
            } catch (error) {
                console.error('Error in fetchSalesApi:', error);
                this.error = error.message || 'Failed to fetch sales';
                throw error;
            } finally {
                this.loading = false;
            }
        },
    },
});