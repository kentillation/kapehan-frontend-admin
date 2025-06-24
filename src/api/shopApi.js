import apiClient from '../axios';

export const SHOP_API = {
    ENDPOINTS: {
        FETCH_ALL: '/shops',
        CREATE: '/save-shop',
        DETAILS: '/shop-details'
    },

    async fetchShopsApi() {
        try {
            const authToken = localStorage.getItem('auth_token');
            if (!authToken) throw new Error('Authentication token not found');
            const response = await apiClient.get(this.ENDPOINTS.FETCH_ALL, {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            });
            if (!response.data?.success) {
                throw new Error(response.data?.message || 'Failed to fetch shops');
            }
            return response.data;
        } catch (error) {
            console.error('[ShopService] Error fetching shops:', error);
            throw this._enhanceError(error, 'Failed to fetch shops');
        }
    },

    async createShopApi(shopData) {
        try {
            const authToken = localStorage.getItem('auth_token');
            if (!authToken) throw new Error('Authentication token not found');
            if (!shopData) {
                throw new Error('Shop data is required');
            }
            const response = await apiClient.post(
                this.ENDPOINTS.CREATE,
                shopData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${authToken}`
                    }
                }
            );
            if (!response.data) {
                throw new Error('No data received from server');
            }
            if (response.data.success === false) {
                throw new Error(response.data.message || 'Failed to create shop');
            }
            return response.data;
        } catch (error) {
            console.error('[ShopService] Error creating shop:', error);
            throw this._enhanceError(error, 'Failed to create shop');
        }
    },

    async fetchShopDetails(shopName) {
        try {
            const authToken = localStorage.getItem('auth_token');
            if (!authToken) throw new Error('Authentication token not found');
            if (!shopName) {
                throw new Error('Shop name is required');
            }
            const response = await apiClient.get(
                `${this.ENDPOINTS.DETAILS}/${shopName}`,
                {
                    headers: {
                        Authorization: `Bearer ${authToken}`
                    }
                }
            );
            if (!response.data?.success) {
                throw new Error(response.data?.message || 'Failed to fetch shop details');
            }
            return response.data;
        } catch (error) {
            console.error('[ShopService] Error fetching shop details:', error);
            throw this._enhanceError(error, 'Failed to fetch shop details');
        }
    },

    _enhanceError(error, defaultMessage) {
        const enhancedError = new Error(
            error.response?.data?.message ||
            error.message ||
            defaultMessage
        );
        enhancedError.response = error.response;
        enhancedError.status = error.response?.status;
        enhancedError.isApiError = true;
        return enhancedError;
    }
};