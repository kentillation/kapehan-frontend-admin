<template>
    <v-data-table 
        :headers="headersReversalOrders" 
        :items="mappedReversalOrdersByDate" 
        :loading="loading" 
        :items-per-page="10"
        :sort-by="[{ key: 'updated_at', order: 'desc' }]" 
        class="hover-table" 
        density="comfortable">
        <template v-slot:top>
            <v-toolbar flat>
                <h2 class="ms-4 to-hide">List of Reversal Orders</h2>
                <h2 class="ms-4 to-show">List</h2>
                <v-spacer></v-spacer>
                <div class="w-75 w-sm-50 d-flex align-center justify-space-between">
                    <v-autocomplete v-model="dateFilter" :items="dateFilterItems" item-title="filter_date_label"
                            item-value="filter_date_id" label="Date Filter" class="mt-5 me-3"></v-autocomplete>
                    <v-btn @click="$emit('refresh')" :loading="loading" icon="mdi-refresh" color="#0090b6" variant="flat"
                        size="small" class="me-3"></v-btn>
                </div>
            </v-toolbar>
        </template>

        <!--eslint-disable-next-line -->
        <template v-slot:item.to_quantity="{ item }">
            {{ item.to_quantity }} {{ item.to_quantity > 1 ? 'items' : 'item' }}
        </template>

        <template v-slot:no-data>
            <v-alert type="warning" variant="tonal" class="ma-4">
                <span>&nbsp; No void reversal found
                    <template v-if="selectedFilterLabel">
                        for <strong>{{ selectedFilterLabel }}</strong>
                    </template>
                </span>
            </v-alert>
        </template>
    </v-data-table>
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
            reversalOrdersByDate: [],
            mappedReversalOrdersByDate: [],
            dateFilter: 1,
            searchStock: '',
            headersReversalOrders: [
                { title: 'Reference', value: 'reference_number', width: '10%' },
                { title: 'Table#', value: 'table_number', width: '10%' },
                { title: 'Product', value: 'display_product_name', width: '20%' },
                { title: 'Quantity', value: 'to_quantity', width: '10%' },
                { title: 'Status', value: 'reversal_status', width: '10%' },
                { title: 'Date created', value: 'updated_at', width: '30%' },
            ],
            dateFilterItems: [
                { filter_date_id: 1, filter_date_label: 'Today' },
                { filter_date_id: 2, filter_date_label: 'Yesterday' },
                { filter_date_id: 3, filter_date_label: 'Last 7 days' },
                { filter_date_id: 4, filter_date_label: 'This Week' },
                { filter_date_id: 5, filter_date_label: 'Last 30 days' },
                { filter_date_id: 6, filter_date_label: 'This Month' },
                { filter_date_id: 7, filter_date_label: 'Last Month' },
            ],
            snackbarRef: null,
        }
    },
    mounted() {
        // this.fetchAllOrdersReport(this.dateFilter);
        this.fetchReversalOrders();
    },
    watch: {
        reversalOrdersByDate: {
            handler(newVal) {
                this.mappedReversalOrdersByDate = newVal.map(order => this.formatReversalOrders(order));
            },
            immediate: true
        },
        dateFilter(newVal) {
            this.formatReversalOrders(newVal);
        },
    },
    computed: {
        selectedFilterLabel() {
            const found = this.dateFilterItems.find(item => item.filter_date_id === this.dateFilter);
            return found ? found.filter_date_label : '';
        },
    },
    props: {
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
        // async fetchAllOrdersReport(dateFilterId = null) {
        //     try {
        //         await this.transactStore.fetchAllOrdersStore(this.branchId, dateFilterId);
        //         this.reversalOrders = this.transactStore.reversalOrders.map(order => this.formatReversalOrders(order));
        //     } catch (error) {
        //         this.showAlert("Error fetching reversalOrders!");
        //     }
        // },

        async fetchReversalOrders() {
            try {
                await this.transactStore.fetchReversalStore(this.branchId);
                if (this.transactStore.reversalOrders.length === 0) {
                    this.mappedReversalOrdersByDate = [];
                } else {
                    this.mappedReversalOrdersByDate = this.transactStore.reversalOrders.map(order => this.formatReversalOrders(order));
                }
            } catch (error) {
                console.error('Error fetching reversal orders:', error);
            }
        },

        formatReversalOrders(order) {
            return {
                ...order,
                display_product_name: `${ order.product_name }${ order.temp_label }${ order.size_label }` || '',
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

        // formatOrder(order) {
        //     return {
        //         ...order,
        //         display_customer_cash: `₱${order.customer_cash}`,
        //         display_customer_charge: `₱${Number(order.customer_charge).toLocaleString('en-PH')}`,
        //         display_customer_change: `₱${order.customer_change}`,
        //         display_total_quantity: `${order.total_quantity} ${ order.total_quantity > 1 ? 'items' : 'item'}`,
        //         updated_at: this.formatDateTime(order.updated_at),
        //     };
        // },

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