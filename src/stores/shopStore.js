import { defineStore } from 'pinia';
import { SHOP_API } from '@/api/shopApi';

export const useShopStore = defineStore('shops', {
    state: () => ({
        shops: [],
        currentShop: null,
        loading: false,
        validatingShop: false,
        error: null
    }),

    actions: {
        async fetchAllShop() {
            this.loading = true;
            this.error = null;
            try {
                if (!SHOP_API || typeof SHOP_API.fetchShopsApi !== 'function') {
                    throw new Error('SHOP_API service is not properly initialized');
                }
                const response = await SHOP_API.fetchShopsApi();
                if (response && response.success) {
                    this.shops = response.shops || [];
                } else {
                    throw new Error(response?.message || 'Failed to fetch shops');
                }
            } catch (error) {
                console.error('Error in fetchShopsApi:', error);
                this.error = error.message || 'Failed to fetch shops';
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async createShop() {
            this.validatingShop = true;
            this.error = null;
            try {
                if (!SHOP_API || typeof SHOP_API.createShopApi !== 'function') {
                    throw new Error('SHOP_API service is not properly initialized');
                }
                const response = await SHOP_API.createShopApi();
                if (response && response.message) {
                    await this.fetchAllShop();
                    return response;
                }
                throw new Error('Failed to create shop');
            } catch (error) {
                console.error('Error in createShopApi:', error);
                this.error = 'Failed to create shop';
                throw error;
            } finally {
                this.validatingShop = false;
            }
        },

        async fetchShopDetails(shopName) {
            this.loading = true;
            this.error = null;
            try {
                if (!SHOP_API || typeof SHOP_API.fetchShopDetails !== 'function') {
                    throw new Error('SHOP_API service is not properly initialized');
                }
                const response = await SHOP_API.fetchShopDetails(shopName);
                if (response && response.success) {
                    this.currentShop = response.data || null;
                    return response;
                }
                throw new Error(response?.message || 'Failed to fetch shop details');
            } catch (error) {
                console.error('Error in fetchShopDetails:', error);
                this.error = error.message || 'Failed to fetch shop details';
                throw error;
            } finally {
                this.loading = false;
            }
        }
    },

    getters: {
        getShopNames: (state) => {
            return state.shops.map(shop => [
                typeof shop === 'object' ? shop.shop_name : shop,
                'mdi-store-outline'
            ]);
        },
        getShopById: (state) => (id) => {
            return state.shops.find(shop => shop.id === id);
        }
    }
});