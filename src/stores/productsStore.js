import { defineStore } from 'pinia';
import { PRODUCTS_API } from '@/api/productsApi';

export const useProductsStore = defineStore('products', {
    state: () => ({
        products: [],
        loading: false,
        error: null
    }),

    actions: {
        async fetchAllProductsStore(branchId) {
            this.loading = true;
            this.error = null;
            try {
                if (!PRODUCTS_API || typeof PRODUCTS_API.fetchAllProductsApi !== 'function') {
                    throw new Error('PRODUCTS_API service is not properly initialized');
                }
                const response = await PRODUCTS_API.fetchAllProductsApi(branchId);
                if (response && response.status === true) {
                    this.products = response.data;
                } else {
                    throw new Error('Failed to fetch products');
                }
            } catch (error) {
                console.error('Error in fetchAllProductsApi:', error);
                this.error = 'Failed to fetch products';
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async saveProductsStore(products) {
            this.loading = true;
            this.error = null;
            try {
                if (!PRODUCTS_API || typeof PRODUCTS_API.saveProductsApi !== 'function') {
                    throw new Error('PRODUCTS_API service is not properly initialized');
                }
                const response = await PRODUCTS_API.saveProductsApi(products);
                if (response && (response.status === true)) {
                    return response;
                } else {
                    throw new Error('Failed to save products');
                }
            } catch (error) {
                console.error('Error in saveProductsApi:', error);
                this.error = 'Failed to save products';
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async saveProductIngredientsStore(products) {
            this.loading = true;
            this.error = null;
            try {
                if (!PRODUCTS_API || typeof PRODUCTS_API.saveProductIngredientsApi !== 'function') {
                    throw new Error('PRODUCTS_API service is not properly initialized');
                }
                const response = await PRODUCTS_API.saveProductIngredientsApi(products);
                if (response && (response.status === true)) {
                    return response;
                } else {
                    throw new Error('Failed to save product ingredients');
                }
            } catch (error) {
                console.error('Error in saveProductIngredientsApi:', error);
                this.error = 'Failed to save product ingredients';
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async updateProductStore(product) {
            this.loading = true;
            this.error = null;
            try {
                if (!PRODUCTS_API || typeof PRODUCTS_API.updateProductApi !== 'function') {
                    throw new Error('PRODUCTS_API service is not properly initialized');
                }
                const response = await PRODUCTS_API.updateProductApi(product);
                if (response && (response.status === true || response.status === "true" || response.status === 1)) {
                    return response;
                } else {
                    throw new Error('Failed to save product');
                }
            } catch (error) {
                console.error('Error in updateProductApi:', error);
                this.error = 'Failed to save product';
                throw error;
            } finally {
                this.loading = false;
            }
        },
    },
});