<template>
    <v-data-table :headers="filteredHeaders" :items="products" :loading="loading" :items-per-page="10"
        :sort-by="[{ key: 'display_product_name', order: 'asc' }]" class="elevation-1 hover-table mb-4"
        density="comfortable">
        <template v-slot:top>
            <v-toolbar flat color="transparent">
                <v-toolbar-title class="text-h6 font-weight-medium">
                    <span class="to-hide">Products Report</span>
                    <span class="to-show">Products</span>
                </v-toolbar-title>
                <v-btn prepend-icon="mdi-download" color="primary" variant="tonal">XLS</v-btn>&nbsp;
                <v-btn prepend-icon="mdi-printer" color="primary" variant="tonal">PRINT</v-btn>&nbsp;
                <v-btn prepend-icon="mdi-refresh" color="primary" variant="tonal" class="ps-7 me-3"
                    @click="$emit('refresh')" :loading="loading"></v-btn>
            </v-toolbar>
            <v-divider></v-divider>
        </template>
        <!--eslint-disable-next-line -->
        <template v-slot:item.display_product_price="{ item }">
            <span :class="{ 'text-red': item.availability_id === 2 }">
                {{ item.display_product_price }}
            </span>
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

export default {
    name: 'ProductsTable',
    data() {
        return {
        };
    },
    components: {
    },
    props: {
        products: {
            type: Array,
            required: true,
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
    ],
    setup(props) {
        const loadingStore = useLoadingStore();
        const { mobile } = useDisplay();
        const headers = [
            { title: '', value: 'select', width: '5%' },
            { title: 'Product', value: 'product_name', sortable: true, width: '10%' },
            { title: 'Temperature', value: 'temp_label', sortable: true, width: '10%' },
            { title: 'Size', value: 'size_label', sortable: true, width: '10%' },
            { title: 'Price', value: 'display_product_price', sortable: true, width: '10%' },
            { title: 'Category', value: 'category_label', sortable: true, width: '10%' },
            { title: 'Last updated', value: 'updated_at', sortable: true, width: '20%' },
        ];
        const filteredHeaders = computed(() => {
            return headers.map(header => ({
                ...header,
                title: mobile.value ? header.title.substring(0, 3) : header.title
            }));
        });
        const processedProducts = computed(() => {
            return props.products.map(productReport => ({
                ...productReport,
                display_product_price: productReport.display_product_price || `₱${productReport.product_price}`,
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