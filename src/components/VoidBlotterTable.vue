<template>
    <v-data-table 
        :headers="transactionsHeaders" 
        :items="mappedTransactions" 
        :loading="loading" 
        :items-per-page="10"
        :sort-by="[{ key: 'updated_at', order: 'desc' }]" 
        class="hover-table" 
        density="comfortable">
        <template v-slot:top>
            <v-toolbar flat>
                <h2 class="ms-4 to-hide">List of Void Blotters</h2>
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
        <template v-slot:item.total_quantity="{ item }">
            {{ item.total_quantity }} {{ item.total_quantity > 1 ? 'items' : 'item' }}
        </template>

        <template v-slot:no-data>
            <v-alert type="warning" variant="tonal" class="ma-4">
                <span>&nbsp; No void blotters found
                    <template v-if="selectedFilterLabel">
                        for <strong>{{ selectedFilterLabel }}</strong>
                    </template>
                </span>
            </v-alert>
        </template>
    </v-data-table>
    <Snackbar ref="snackbarRef" />
</template>

<script>
import { useLoadingStore } from '@/stores/loading';
import { useTransactStore } from '@/stores/transactStore';
import Snackbar from '@/components/Snackbar.vue';

export default {
    name: 'TransactionsReportsTable',
    data() {
        return {
            mappedTransactions: [],
            dateFilter: 1,
            searchStock: '',
            transactionsHeaders: [
                { title: 'Reference', value: 'reference_number', sortable: 'true', width: '25%' },
                { title: 'Quantity', value: 'display_total_quantity', sortable: 'true', width: '15%' },
                { title: 'Cash_render', value: 'display_customer_cash', sortable: 'true', width: '10%' },
                { title: 'Charge', value: 'display_customer_charge', sortable: 'true', width: '10%' },
                { title: 'Change', value: 'display_customer_change', sortable: 'true', width: '15%' },
                { title: 'Transaction date', value: 'updated_at', sortable: 'true', width: '25%' },
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
        this.fetchAllOrdersReport(this.dateFilter);
    },
    watch: {
        transactions: {
            handler(newVal) {
                this.mappedTransactions = newVal.map(order => this.formatOrder(order));
            },
            immediate: true
        },
        dateFilter(newVal) {
            this.fetchAllOrdersReport(newVal);
        },
    },
    computed: {
        selectedFilterLabel() {
            const found = this.dateFilterItems.find(item => item.filter_date_id === this.dateFilter);
            return found ? found.filter_date_label : '';
        },
    },
    components: {
        Snackbar,
    },
    props: {
        transactions: {
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
        async fetchAllOrdersReport(dateFilterId = null) {
            try {
                await this.transactStore.fetchAllOrdersStore(this.branchId, dateFilterId);
                this.mappedTransactions = this.transactStore.transactions.map(order => this.formatOrder(order));
            } catch (error) {
                this.showError("Error fetching transactions!");
            }
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

        formatOrder(order) {
            return {
                ...order,
                display_customer_cash: `₱${order.customer_cash}`,
                display_customer_charge: `₱${Number(order.customer_charge).toLocaleString('en-PH')}`,
                display_customer_change: `₱${order.customer_change}`,
                display_total_quantity: `${order.total_quantity} ${ order.total_quantity > 1 ? 'items' : 'item'}`,
                updated_at: this.formatDateTime(order.updated_at),
            };
        },

        showError(message) {
            this.$refs.snackbarRef.showSnackbar(message, "error");
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