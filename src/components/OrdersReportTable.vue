<template>
    <v-data-table :headers="transactionsHeaders" :items="mappedTransactions" :loading="loading" :items-per-page="10"
        :sort-by="[{ key: 'updated_at', order: 'desc' }]" class="hover-table" density="comfortable">
        <template v-slot:top>
            <v-row class="mt-5">
                <v-col cols="12" lg="6" md="6" sm="6" class="pa-0">
                    <div class="d-flex ms-3 mb-5">
                        <v-btn @click="downloadTransactions(dateFilter)" prepend-icon="mdi-download" color="primary"
                            variant="tonal">XLS</v-btn>&nbsp;
                        <v-btn @click="printTransactions(dateFilter)" prepend-icon="mdi-printer" color="primary"
                            variant="tonal">PRINT</v-btn>&nbsp;
                        <v-btn class="ps-7" prepend-icon="mdi-refresh" color="primary" variant="tonal"
                            @click="$emit('refresh')" :loading="loading"></v-btn>
                    </div>
                </v-col>
                <v-col cols="12" lg="6" md="6" sm="6" class="pa-0">
                    <v-autocomplete v-model="dateFilter" :items="dateFilterItems" item-title="filter_date_label"
                        item-value="filter_date_id" label="Date Filter" class="mx-3" clearable></v-autocomplete>
                </v-col>
            </v-row>
        </template>

        <!--eslint-disable-next-line -->
        <template v-slot:item.total_quantity="{ item }">
            {{ item.total_quantity }} {{ item.total_quantity > 1 ? 'items' : 'item' }}
        </template>

        <template v-slot:no-data>
            <v-alert type="warning" variant="tonal" class="ma-4">
                <span>&nbsp; No orders report found
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
            shopLogoLink: '-',
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
        allOrders: {
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
        }
    },
    components: {
        Snackbar,
    },
    props: {
        allOrders: {
            type: Array,
            default: () => []
        },
        loading: {
            type: Boolean,
            default: false
        },
        shopId: {
            type: Number,
            required: true
        },
        shopName: {
            type: String,
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
        branchLocation: {
            type: String,
            required: true
        },
        contact: {
            type: String,
            required: true
        },
        // shopLogoLink: {
        //     type: String,
        //     required: true
        // },
        adminName: {
            type: String,
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
                this.mappedTransactions = this.transactStore.allOrders.map(order => this.formatOrder(order));
            } catch (error) {
                this.showError(error);
            }
        },

        async downloadTransactions(dateFilterId = null) {
            await this.transactStore.fetchAllOrdersStore(this.branchId, dateFilterId);
            if (this.transactStore.transactions.length === 0) {
                this.showError("No available orders report to download.");
                return;
            } else {
                this.loadingStore.show('Downloading transactions...');
            }
            const transactions = this.transactStore.transactions.map(order => ({
                'Reference': order.reference_number,
                'Quantity': order.total_quantity,
                'Cash render': order.customer_cash,
                'Charge': order.customer_charge,
                'Change': order.customer_change,
                'Transaction date': this.formatDateTime(order.updated_at),
            }));
            const headings = [
                `Shop Name: ${this.shopName}`,
                `Branch Name: ${this.branchName}`,
                `Branch Location: ${this.branchLocation}`,
                `Contact: ${this.contact}`,
                `Date: ${this.formatCurrentDate}`,
                `Prepared by : ${this.adminName}`,
                '',
            ].join('\n');
            const csvContent = "data:text/csv;charset=utf-8,"
                + headings + "\n"
                + Object.keys(transactions[0]).join(",") + "\n"
                + transactions.map(e => Object.values(e).join(",")).join("\n");
            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", `Orders_Report_${this.branchName}_${this.currentNumberDate}.csv`);
            document.body.appendChild(link); // Required for FF
            this.showSuccess("Transactions downloaded successfully!");
            link.click();
            this.loadingStore.hide();
            document.body.removeChild(link);
            // this.$emit('refresh');
        },

        async printTransactions(dateFilterId = null) {
            await this.transactStore.fetchAllOrdersStore(this.branchId, dateFilterId);
            if (this.transactStore.transactions.length === 0) {
                this.showError("No available orders report to print.");
                return;
            }
            const printWindow = window.open('', '_blank');
            if (!printWindow) {
                alert('Please allow popups for this website to print the report.');
                return;
            }
            printWindow.document.write(`
                <html>
                    <head>
                        <title>Orders Report</title>
                        <style>
                            body { font-family: Arial, sans-serif; }
                            table { width: 100%; border-collapse: collapse; }
                            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                            th { background-color: #f2f2f2; }
                            h2 { margin: 0; }
                            h2, h4, h5 { text-align: center; }
                            h4, h5 { font-weight: normal; margin: 5px; }
                            p { margin-top: 25px; }
                            .headings { display: flex; align-items: center; justify-content: space-between;}
                        </style>
                    </head>
                    <body>
                        <div class="headings">
                            <img src="${this.shopLogoLink}" alt="Logo" style="width: 200px; height: auto;">
                            <div>
                                <h2>${this.shopName}</h2>
                                <h4>${this.branchName} Branch</h4>
                                <h5>${this.branchLocation}</h5>
                                <h5>${this.contact}</h5>
                            </div>
                            <h5>${this.formatCurrentDate}</h5>
                        </div>
                        <p><strong>Transactions Report for ${this.branchName} Branch | ${ this.selectedFilterLabel }</strong></p>
                        <table>
                            <tr>
                                <th>Reference #</th>
                                <th>Quantity</th>
                                <th>Cash render</th>
                                <th>Charge</th>
                                <th>Change</th>
                                <th>Transaction date</th>
                            </tr>
                            ${this.transactStore.transactions.map(order => `
                                <tr>
                                    <td>${order.reference_number}</td>
                                    <td>${order.total_quantity} ${ order.total_quantity > 1 ? 'items' : 'item'}</td>
                                    <td>₱${order.customer_cash}</td>
                                    <td>₱${order.customer_charge}</td>
                                    <td>₱${order.customer_change}</td>
                                    <td>${this.formatDateTime(order.updated_at)}</td>
                                </tr>`).join('')}
                        </table>
                        <footer>
                            <p style="margin-top: 30px;">
                                Prepared by: <strong>${this.adminName}</strong>
                            </p>
                        </footer>
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

        formatOrder(order) {
            const customer_cash_value = Number(order.customer_cash);
            const display_customer_cash = (Math.round(customer_cash_value * 100) / 100).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '';

            const customer_charge_value = Number(order.customer_charge);
            const display_customer_charge = (Math.round(customer_charge_value * 100) / 100).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '';

            const customer_change_value = Number(order.customer_change);
            const display_customer_change = (Math.round(customer_change_value * 100) / 100).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '';
            return {
                ...order,
                display_customer_cash: `₱${display_customer_cash}`,
                display_customer_charge: `₱${display_customer_charge}`,
                display_customer_change: `₱${display_customer_change}`,
                display_total_quantity: `${order.total_quantity} ${ order.total_quantity > 1 ? 'items' : 'item'}`,
                updated_at: this.formatDateTime(order.updated_at),
            };
        },

        showError(message) {
            this.$refs.snackbarRef.showSnackbar(message, "error");
        },

        showSuccess(message) {
            this.$refs.snackbarRef.showSnackbar(message, "success");
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