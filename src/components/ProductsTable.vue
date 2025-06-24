<template>
    <v-text-field class="to-hide" density="comfortable" v-model="searchProduct"
        :placeholder="`Search product in ${branchName}`" clearable variant="outlined"></v-text-field>
    <v-text-field class="to-show" density="comfortable" v-model="searchProduct" :placeholder="`Search product`" clearable
        variant="outlined"></v-text-field>
    <v-data-table :headers="filteredHeaders" :items="products" :loading="loading" :items-per-page="10"
        :sort-by="[{ key: 'display_product_name', order: 'asc' }]" class="elevation-1 hover-table"
        density="comfortable">
        <template v-slot:top>
            <v-toolbar flat color="transparent">
                <v-toolbar-title class="text-h6 font-weight-medium">
                    <span class="to-hide">List of all Products</span>
                    <span class="to-show">List</span>
                </v-toolbar-title>

                <v-spacer></v-spacer>

                <!-- <v-btn :disabled="hasCheck" @click="toEditPage" prepend-icon="mdi-pencil" color="green" class="me-2"
                    variant="tonal">&nbsp;Edit
                </v-btn> -->

                <AddProductDialog v-model="addProductDialog" />
                <v-btn @click="openAddProductDialog" :disabled="loading" prepend-icon="mdi-plus" color="primary"
                    class="me-2" variant="tonal">&nbsp;Add
                </v-btn>

                <v-btn @click="$emit('refresh')" :loading="loading" icon="mdi-refresh" color="primary"
                    variant="tonal"></v-btn>
            </v-toolbar>

            <v-divider></v-divider>
        </template>

        <!--eslint-disable-next-line -->
        <!-- <template v-slot:item.select="{ item }">
            <v-checkbox v-model="item.selected" :value="true" color="primary"
                class="d-flex justify-center"></v-checkbox>
        </template> -->

        <!--eslint-disable-next-line -->
        <template v-slot:item.display_product_price="{ item }">
            <span :class="{ 'text-red': item.availability_id === 2 }">
                {{ item.display_product_price }}
            </span>
        </template>

        <!--eslint-disable-next-line -->
        <template v-slot:item.availability_label="{ item }">
            <v-chip :color="item.availability_id === 1 ? 'green' : 'red'" size="small" variant="flat">
                {{ item.availability_label }}
            </v-chip>
        </template>

        <!--eslint-disable-next-line -->
        <template v-slot:item.actions="{ item }">
            <div class="d-flex" style="gap: 8px;">
                <v-tooltip text="View Ingredients" location="top">
                    <template v-slot:activator="{ props }">
                        <v-btn v-bind="props" @click="$emit('view-ingredients', item)" color="blue" variant="tonal"
                            size="small" icon="mdi-eye-outline"></v-btn>
                    </template>
                </v-tooltip>

                <v-tooltip text="Edit Product" location="top">
                    <template v-slot:activator="{ props }">
                        <v-btn v-bind="props" @click="$emit('edit-product', item)" color="green" variant="tonal"
                            size="small" icon="mdi-pencil"></v-btn>
                    </template>
                </v-tooltip>
            </div>
        </template>

        <template v-slot:no-data>
            <v-alert type="warning" variant="tonal" class="ma-4">
                <span>&nbsp; No products found for this branch.</span>
            </v-alert>
        </template>

        <template v-slot:loading>
            <v-skeleton-loader type="table-row@6"></v-skeleton-loader>
        </template>
    </v-data-table>
</template>

<script>
import { computed } from 'vue';
import { useDisplay } from 'vuetify';
import { useLoadingStore } from '@/stores/loading';
import AddProductDialog from '@/components/AddProductDialog.vue';

export default {
    name: 'ProductsTable',
    data() {
        return {
            searchProduct: '',
            addProductDialog: false,
        };
    },
    components: {
        AddProductDialog,
    },
    props: {
        products: {
            type: Array,
            required: true,
            // default: () => []
        },
        loading: {
            type: Boolean,
            default: false
        },
        shopId: {
            type: Number,
            required: true
        },
        branchId: {
            type: Number,
            required: true
        },
        branchName: {
            type: String,
            required: true
        },
        error: {
            type: [String, Error, null],
            default: null
        }
    },
    emits: [
        'refresh',
        'edit-product',
        'view-ingredients',
    ],
    // computed: {
    //     hasCheck() {
    //         return !this.products.some(item => item.selected);
    //     }
    // },
    setup(props) {
        const loadingStore = useLoadingStore();

        const { mobile } = useDisplay();

        const headers = [
            { title: '', value: 'select', width: '5%' },
            { title: 'Product', value: 'display_product_name', sortable: true, width: '20%' },
            { title: 'Price', value: 'display_product_price', sortable: true, width: '10%' },
            { title: 'Category', value: 'category_label', sortable: true, width: '15%' },
            { title: 'Availability', value: 'availability_label', sortable: true, width: '15%' },
            { title: 'Updated', value: 'updated_at', sortable: true, width: '20%' },
            { title: 'Actions', value: 'actions', sortable: false, width: '15%' }
        ];

        const filteredHeaders = computed(() => {
            return headers.map(header => ({
                ...header,
                title: mobile.value ? header.title.substring(0, 3) : header.title
            }));
        });

        const processedProducts = computed(() => {
            return props.products.map(product => ({
                ...product,
                display_product_name: product.display_product_name || product.product_name,
                display_product_price: product.display_product_price || `₱${product.product_price}`,
            }));
        });

        return {
            loadingStore,
            headers,
            filteredHeaders,
            processedProducts,
        };
    },
    methods: {
        openAddProductDialog() {
            this.$router.push({
                path: '/add-product/',
                query: {
                    shop_id: this.shopId,
                    branch_id: this.branchId,
                    branch_name: this.branchName,
                }
            });
            // this.addProductDialog = true;
        },
        // toEditPage() {
        //     this.$router.push({
        //         path: '/edit-products/',
        //         query: {
        //             shop_id: this.products.shop_id,
        //             branch_id: this.products.branchId,
        //             branch_name: this.branchName,
        //             product_id: this.products.product_id
        //         }
        //     });
        // }
    }
}
</script>

<style scoped>
.hover-table:deep(.v-data-table__tr:hover) {
    background-color: rgba(0, 0, 0, 0.04);
}

.to-hide {
    display: inline;
}

.to-show {
    display: none;
}

@media (max-width: 768px) {
    .to-hide {
        display: none;
    }

    .to-show {
        display: inline;
    }
}
</style>