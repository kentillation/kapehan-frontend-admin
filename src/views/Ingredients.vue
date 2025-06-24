<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <v-container>
        <h1>Ingredients</h1>
        <v-data-table :headers="headers" :items="ingredients" :loading="loading" class="elevation-1 hover-table">
            <template v-slot:top>
                <v-toolbar flat>
                    <v-toolbar-title>List of all Ingredients</v-toolbar-title>
                    <v-divider class="mx-4" inset vertical></v-divider>
                    <div class="text-right">
                        <v-btn :disabled="loading" append-icon="mdi-refresh" class="me-3 pe-7" variant="outlined"
                            @click="onRefresh"></v-btn>
                    </div>
                </v-toolbar>
            </template>
        </v-data-table>
        <Snackbar ref="snackbarRef" />
    </v-container>
</template>

<script>
import apiClient from '../axios';
import Snackbar from '@/components/Snackbar.vue';

export default {
    // eslint-disable-next-line vue/multi-word-component-names
    name: 'Ingredients',
    components: {
        Snackbar
    },
    data() {
        return {
            loading: true,
            ingredients: [],
            headers: [
                { title: 'Ingredient', value: 'stock_ingredient' },
                { title: 'Product', value: 'product_name' },
                { title: 'Category', value: 'category_label' },
                { title: 'Availability', value: 'availability_label' },
                { title: 'Created', value: 'created_at' },
                { title: 'Updated', value: 'updated_at' },
            ],
        };
    },
    mounted() {
        this.fetchIngredients();
    },
    methods: {
        async fetchIngredients() {
            try {
                const response = await apiClient.get('/ingredients', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('auth_token')}`
                    }
                });
                this.ingredients = response.data.map(product => ({
                    ...product,
                    product_name: product.product_name + ' ' + product.temp_label + ' ' + product.size_label,
                    created_at: this.formatDate(product.created_at),
                    updated_at: this.formatDate(product.updated_at),
                }));
            } catch (error) {
                console.error('Error fetching ingredients:', error);
                this.$refs.snackbarRef.showSnackbar("Error fetching ingredients!", "error");
            } finally {
                this.loading = false;
            }
        },
        onRefresh() {
            this.loading = true
            setTimeout(() => {
                this.loading = false
                this.fetchIngredients()
            }, 3000)
        },
        formatDate(date) {
            if (!date) return 'Invalid date';
            const parsedDate = new Date(date);
            if (isNaN(parsedDate.getTime())) {
                return 'Invalid date';
            }
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            return new Intl.DateTimeFormat('en-US', options).format(parsedDate);
        },
    }
};
</script>