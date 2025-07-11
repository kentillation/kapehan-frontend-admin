import { defineStore } from 'pinia';
import { TRANSACT_API } from '@/api/transactApi';

export const useTransactStore = defineStore('transactions', {
    state: () => ({
        transactions: [],
        salesByDate: [],
        total_sales: null,
        salesByMonth: [],
        grossSales: '',
        ordersOnly: '',
        productsOnly: '',
        stocksOnly: '',
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

        async fetchSalesByDateStore(branchId, dateFilterId = null) {
            this.loading = true;
            this.error = null;
            try {
                const response = await TRANSACT_API.fetchSalesByDateApi(branchId, dateFilterId);
                if (response && response.status === true) {
                    this.salesByDate = response.data;
                    this.total_sales = response.total_sales
                } else {
                    throw new Error(response?.message || 'Failed to fetch sales');
                }
            } catch (error) {
                console.error('Error in fetchSalesByDateApi:', error);
                this.error = error.message || 'Failed to fetch sales';
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async fetchGrossSalesStore(branchId, dateFilterId = null) {
            this.loading = true;
            this.error = null;
            try {
                const response = await TRANSACT_API.fetchGrossSalesApi(branchId, dateFilterId);
                if (response && response.status === true) {
                    this.grossSales = response.data;
                } else {
                    throw new Error(response?.message || 'Failed to fetch sales');
                }
            } catch (error) {
                console.error('Error in fetchGrossSalesApi:', error);
                this.error = error.message || 'Failed to fetch sales';
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async fetchOrdersOnlyStore(branchId, dateFilterId = null) {
            this.loading = true;
            this.error = null;
            try {
                const response = await TRANSACT_API.fetchOrdersOnlyApi(branchId, dateFilterId);
                if (response && response.status === true) {
                    this.ordersOnly = response.data;
                } else {
                    throw new Error(response?.message || 'Failed to fetch sales');
                }
            } catch (error) {
                console.error('Error in fetchOrdersOnlyApi:', error);
                this.error = error.message || 'Failed to fetch sales';
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async fetchProductsOnlyStore(branchId) {
            this.loading = true;
            this.error = null;
            try {
                const response = await TRANSACT_API.fetchProductsOnlyApi(branchId);
                if (response && response.status === true) {
                    this.productsOnly = response.data;
                } else {
                    throw new Error(response?.message || 'Failed to fetch products');
                }
            } catch (error) {
                console.error('Error in fetchProductsOnlyApi:', error);
                this.error = error.message || 'Failed to fetch products';
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async fetchStocksOnlyStore(branchId) {
            this.loading = true;
            this.error = null;
            try {
                const response = await TRANSACT_API.fetchStocksOnlyApi(branchId);
                if (response && response.status === true) {
                    this.stocksOnly = response.data;
                } else {
                    throw new Error(response?.message || 'Failed to fetch products');
                }
            } catch (error) {
                console.error('Error in fetchStocksOnlyApi:', error);
                this.error = error.message || 'Failed to fetch products';
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async fetchSalesByMonthStore(branchId, dateFilterId = null) {
            this.loading = true;
            this.error = null;
            try {
                const response = await TRANSACT_API.fetchSalesByMonthApi(branchId, dateFilterId);
                if (response && response.status === true) {
                    this.salesByMonth = response.data;
                } else {
                    throw new Error(response?.message || 'Failed to fetch sales');
                }
            } catch (error) {
                console.error('Error in fetchSalesByMonthApi:', error);
                this.error = error.message || 'Failed to fetch sales';
                throw error;
            } finally {
                this.loading = false;
            }
        }

    },
});