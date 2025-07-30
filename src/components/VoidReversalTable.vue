<template>
    <v-data-table :headers="headersReversalOrders" :items="mappedReversalOrdersByDate" :loading="loading"
        :items-per-page="10" :sort-by="[{ key: 'updated_at', order: 'desc' }]" class="hover-table"
        density="comfortable">
        <template v-slot:top>
            <v-toolbar flat>
                <h2 class="ms-4 to-hide">List of Reversal Orders</h2>
                <h2 class="ms-4 to-show">List</h2>
                <v-spacer></v-spacer>
                <div class="w-75 w-sm-50 d-flex align-center justify-space-between">
                    <v-autocomplete v-model="dateFilter" :items="dateFilterItems" item-title="filter_date_label"
                        item-value="filter_date_id" label="Date Filter" class="mt-5 me-3"></v-autocomplete>
                    <v-btn @click="$emit('refresh', this.dateFilterId)" :loading="loading" icon="mdi-refresh"
                        color="#0090b6" variant="flat" size="small" class="me-3"></v-btn>
                </div>
            </v-toolbar>
        </template>

        <!--eslint-disable-next-line -->
        <template v-slot:item.to_quantity="{ item }">
            {{ item.to_quantity }} {{ item.to_quantity > 1 ? 'items' : 'item' }}
        </template>

        <!--eslint-disable-next-line -->
        <template v-slot:item.void_status="{ item }">
            <v-chip :color="item.void_status_id === 1 ? 'red' : 'green'" size="small" variant="flat">
                {{ item.void_status }}
            </v-chip>
        </template>

        <!--eslint-disable-next-line -->
        <template v-slot:item.actions="{ item }">
            <div class="d-flex" style="gap: 8px;">
                <v-tooltip text="Edit Product" location="top">
                    <template v-slot:activator="{ props }">
                        <v-btn :class="item.void_status_id === 1 ? 'd-flex' : 'd-none'" v-bind="props" @click="editReversal( {item} )" color="green" variant="tonal" size="small"
                            icon="mdi-pencil"></v-btn>
                    </template>
                </v-tooltip>
            </div>
        </template>

        <template v-slot:no-data>
            <v-alert type="warning" variant="tonal" class="ma-4">
                <span>&nbsp; No void order found
                    <template v-if="selectedFilterLabel">
                        for <strong>{{ selectedFilterLabel }}</strong>
                    </template>
                </span>
            </v-alert>
        </template>
    </v-data-table>
    <v-dialog v-model="confirmReversalDialog" height="260" width="400" transition="dialog-bottom-transition">
        <v-card class="pa-2">
            <v-card-title>
                <h5>Confirmation</h5>
            </v-card-title>
            <v-card-text class="d-flex flex-column">
                <span class="mb-3" style="font-size: 16px;">
                    <strong>{{ selectedProductText }} &nbsp; &nbsp; x{{ this.selectedProduct.to_quantity }}</strong>
                </span>
                <span class="text-center">Do you want to confirm this void?</span>
            </v-card-text>
            <v-card-actions class="d-flex">
                <v-btn color="red" variant="tonal" class="px-3 pt-1 pb-1" prepend-icon="mdi-close"
                    @click="confirmReversalDialog = false">No<span class="to-hide"> , I wont!</span>
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn color="green" variant="tonal" class="px-3 pt-1 pb-1" prepend-icon="mdi-check"
                    @click="confirmReversalDialog = false">Yes<span class="to-hide"> , I want!</span>
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
    <Alert ref="alertRef" />
</template>

<script>
import { useLoadingStore } from '@/stores/loading';
import { useTransactStore } from '@/stores/transactStore';
import Alert from '@/components/Alert.vue';

export default {
    name: 'VoidReversalTable',
    components: {
        Alert,
    },
    data() {
        return {
            mappedReversalOrdersByDate: [],
            dateFilter: 1,
            searchStock: '',
            headersReversalOrders: [
                { title: 'Reference', value: 'reference_number', width: '10%' },
                { title: 'Table#', value: 'table_number', width: '10%' },
                { title: 'Product', value: 'display_product_name', width: '20%' },
                { title: 'Quantity', value: 'to_quantity', width: '10%' },
                { title: 'Status', value: 'void_status', width: '10%' },
                { title: 'Date created', value: 'updated_at', width: '20%' },
                { title: '', value: 'actions', sortable: false, width: '10%' }
            ],
            dateFilterItems: [
                { filter_date_id: 1, filter_date_label: 'Today' },
                { filter_date_id: 2, filter_date_label: 'Yesterday' },
                { filter_date_id: 3, filter_date_label: 'Last 2 days' },
            ],
            selectedProduct: null,
            confirmReversalDialog: false,
            snackbarRef: null,
        }
    },
    mounted() {
        this.fetchVoidOrders(this.dateFilter);
    },
    watch: {
        voidByDate: {
            handler(newVal) {
                this.mappedReversalOrdersByDate = newVal.map(order => this.formatReversalOrders(order));
            },
            immediate: true
        },
        dateFilter(newVal) {
            this.fetchVoidOrders(newVal);
        },
    },
    computed: {
        selectedFilterLabel() {
            const found = this.dateFilterItems.find(item => item.filter_date_id === this.dateFilter);
            return found ? found.filter_date_label : '';
        },
        selectedProductText() {
            if (!this.selectedProduct) return '';
            return `${this.selectedProduct.product_name || ''}
                ${this.selectedProduct.temp_label || ''}
                ${this.selectedProduct.size_label || ''}`;
        },
    },
    props: {
        voidByDate: {
            type: Array,
            default: () => []
        },
        loading: {
            type: Boolean,
            default: false
        },
        branchId: {
            type: Number,
            required: true
        },

    },
    emits: [
        'refresh',
    ],
    setup() {
        const loadingStore = useLoadingStore();
        const transactStore = useTransactStore();
        const today = new Date();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        const yyyy = today.getFullYear();
        const currentNumberDate = `${mm}/${dd}/${yyyy}`;
        const currentDate = new Date().toLocaleDateString('en-PH', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        });
        const formatCurrentDate = currentDate.replace(/,/g, '');
        return {
            loadingStore,
            transactStore,
            currentNumberDate,
            formatCurrentDate,
        };
    },
    methods: {
        async fetchVoidOrders(dateFilterId = null) {
            try {
                await this.transactStore.fetchVoidByDateStore(this.branchId, dateFilterId);
                this.mappedReversalOrdersByDate = this.transactStore.voidOrdersByDate.map(order => this.formatReversalOrders(order));
            } catch (error) {
                console.error('Error fetching void orders:', error);
            }
        },

        editReversal({ item }) {
            this.selectedProduct = { ...item };
            this.confirmReversalDialog = true;
        },

        formatReversalOrders(order) {
            return {
                ...order,
                display_product_name: `${order.product_name}${order.temp_label}${order.size_label}` || '',
                updated_at: order.updated_at ? this.formatDateTime(order.updated_at) : 'N/A',
            };
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

        showAlert(message) {
            this.$refs.alertRef.showSnackbarAlert(message, "error");
        },
    }
}
</script>

<style>
.action-section {
    display: flex;
    flex-wrap: wrap;
}

.action-section-item {
    width: 200px;
}
</style>