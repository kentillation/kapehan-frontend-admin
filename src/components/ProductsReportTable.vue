<template>
    <v-data-table :headers="productsHeaders" :items="products" :loading="loading" :items-per-page="10"
        :sort-by="[{ key: 'product_name', order: 'asc' }]" class="hover-table"
        density="comfortable">
        <template v-slot:top>
            <v-toolbar flat color="transparent">
                <v-btn @click="downloadProducts" prepend-icon="mdi-download" color="primary" variant="tonal">XLS</v-btn>&nbsp;
                <v-btn @click="printProducts" prepend-icon="mdi-printer" color="primary" variant="tonal">PRINT</v-btn>&nbsp;
                <v-btn prepend-icon="mdi-refresh" color="primary" variant="tonal" class="ps-7 me-3"
                    @click="$emit('refresh')" :loading="loading"></v-btn>
            </v-toolbar>
            <v-divider></v-divider>
        </template>
        <!--eslint-disable-next-line -->
        <template v-slot:item.product_name="{ item }">
            <span :class="{ 'text-red': item.availability_id === 2 }">
                {{ item.product_name }}
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
import { useLoadingStore } from '@/stores/loading';
import { useProductsStore } from '@/stores/productsStore';

export default {
    name: 'ProductsTable',
    data() {
        return {
            productsHeaders: [
                { title: '', value: 'select', width: '5%' },
                { title: 'Product', value: 'product_name', sortable: true, width: '10%' },
                { title: 'Temperature', value: 'temp_label', sortable: true, width: '10%' },
                { title: 'Size', value: 'size_label', sortable: true, width: '10%' },
                { title: 'Price', value: 'display_product_price', sortable: true, width: '10%' },
                { title: 'Category', value: 'category_label', sortable: true, width: '10%' },
                { title: 'Last_update', value: 'updated_at', sortable: true, width: '20%' },
            ],
        }
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
    setup() {
        const loadingStore = useLoadingStore();
        const productsStore = useProductsStore();
        return {
            loadingStore,
            productsStore,
        };
    },
    methods: {
        async downloadProducts(){
            this.loadingStore.show('Downloading products...');
            await this.productsStore.fetchAllProductsStore(this.branchId);
            this.loadingStore.hide();
            const products = this.productsStore.products.map(product => ({
                'Product Name': product.product_name,
                'Temperature': product.temp_label,
                'Size': product.size_label,
                'Price': product.product_price,
                'Category': product.category_label,
                'Last Update': this.formatDateTime(product.updated_at),
            }));
            const csvContent = "data:text/csv;charset=utf-8," 
                + Object.keys(products[0]).join(",") + "\n"
                + products.map(e => Object.values(e).join(",")).join("\n");
            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", `Products_Report_${this.branchName}.csv`);
            document.body.appendChild(link); // Required for FF
            link.click();
            document.body.removeChild(link);
            this.$emit('refresh');
        },
        async printProducts() {
            await this.productsStore.fetchAllProductsStore(this.branchId);
            const printWindow = window.open('', '_blank');
            if (!printWindow) {
                alert('Please allow popups for this website to print the report.');
                return;
            }
            printWindow.document.write(`
                <html>
                    <head>
                        <title>Products Report</title>
                        <style>
                            body { font-family: Arial, sans-serif; }
                            table { width: 100%; border-collapse: collapse; }
                            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                            th { background-color: #f2f2f2; }
                            h1 { text-align: center; }
                        </style>
                    </head>
                    <body>
                        <h1>Products Report for ${this.branchName}</h1>
                        <table>
                            <tr>
                                <th>Product Name</th>
                                <th>Temperature</th>
                                <th>Size</th>
                                <th>Price</th>
                                <th>Category</th>
                                <th>Last Update</th>
                            </tr>
                            ${this.productsStore.products.map(product => `
                                <tr>
                                    <td>${product.product_name}</td>
                                    <td>${product.temp_label}</td>
                                    <td>${product.size_label}</td>
                                    <td>${product.product_price}</td>
                                    <td>${product.category_label}</td>
                                    <td>${this.formatDateTime(product.updated_at)}</td>
                                </tr>`).join('')}
                        </table>
                    </body>
                </html>`);
            printWindow.document.close();
            printWindow.print();
        },
        formatDateTime(dateString) {
            if (!dateString) return 'N/A';
            const date = new Date(dateString);
            return date.toLocaleString('en-PH', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                timeZone: 'Asia/Manila'
            });
        },
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