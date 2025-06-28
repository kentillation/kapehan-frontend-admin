<template>
    <v-data-table :headers="transactionOrdersHeaders" :items="mappedTransactionOrders" :loading="loading" :items-per-page="10"
        :sort-by="[{ key: 'updated_at', order: 'desc' }]" class="hover-table" density="comfortable">
        <template v-slot:top>
            <v-row class="mt-5">
                <v-col cols="12" lg="6" md="6" sm="6" class="pa-0">
                    <div class="d-flex ms-3 mb-5">
                        <v-btn @click="downloadTransactionOrders(dateFilter)" prepend-icon="mdi-download" color="primary"
                            variant="tonal">XLS</v-btn>&nbsp;
                        <v-btn @click="printTransactionOrders(dateFilter)" prepend-icon="mdi-printer" color="primary"
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
                <span>&nbsp; No transaction orders found
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
    name: 'SalesReportTable',
    data() {
        return {
            mappedTransactionOrders: [],
            dateFilter: null,
            transactionOrdersHeaders: [
                { title: 'Last_update', value: 'updated_at', sortable: 'true', width: '25%' },
                { title: 'Product', value: 'product_name', sortable: 'true', width: '15%' },
                { title: 'Price', value: 'product_price', sortable: 'true', width: '15%' },
                { title: 'Quantity', value: 'total_quantity', sortable: 'true', width: '15%' },
                { title: 'Total Price', value: 'total_price', sortable: 'true', width: '15%' },
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
    watch: {
        transactions: {
            handler(newVal) {
                this.mappedTransactionOrders = newVal.map(t_order => this.formatTransactionOrders(t_order));
            },
            immediate: true
        },
        dateFilter(newVal) {
            this.fetchTransactionOrdersReport(newVal);
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
        transactionOrders: {
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
        shopLogoLink: {
            type: String,
            required: true
        },
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
            formatCurrentDate,
        };
    },
    methods: {
        async fetchTransactionOrdersReport(dateFilterId = null) {
            try {
                await this.transactStore.fetchAllTransactionsOrdersStore(this.branchId, dateFilterId);
                this.mappedTransactionOrders = this.transactStore.transactionOrders.map(t_order => this.formatTransactionOrders(t_order));
            } catch (error) {
                this.showError("Error fetching transaction orders!");
            }
        },

        async downloadTransactionOrders(dateFilterId = null) {
            await this.transactStore.fetchAllTransactionsOrdersStore(this.branchId, dateFilterId);
            if (this.transactStore.transactionOrders.length === 0) {
                alert('No transaction orders available to download.');
                return;
            } else {
                this.loadingStore.show('Downloading transaction orders...');
            }
            const transactionOrders = this.transactStore.transactionOrders.map(t_order => ({
                'Last Update': this.formatDateTime(t_order.updated_at),
                'Product': t_order.product_name,
                'Price': t_order.product_price,
                'Total_quantity': t_order.total_quantity,
                'Total_price': t_order.total_price,
            }));
            const headings = [
                `Shop Name: ${this.shopName}`,
                `Branch Name: ${this.branchName}`,
                `Branch Loccation: ${this.branchLocation}`,
                `Contact: ${this.contact}`,
                `Date: ${this.formatCurrentDate}`,
                `Prepared by : ${this.adminName}`,
                '',
            ].join('\n');
            const csvContent = "data:text/csv;charset=utf-8,"
                + headings + "\n"
                + Object.keys(transactionOrders[0]).join(",") + "\n"
                + transactionOrders.map(e => Object.values(e).join(",")).join("\n");
            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", `Transactions_Report_${this.branchName}.csv`);
            document.body.appendChild(link); // Required for FF
            this.showSuccess("Transactions downloaded successfully!");
            link.click();
            this.loadingStore.hide();
            document.body.removeChild(link);
            // this.$emit('refresh');
        },

        async printTransactionOrders(dateFilterId = null) {
            await this.transactStore.fetchAllTransactionsOrdersStore(this.branchId, dateFilterId);
            if (this.transactStore.transactionOrders.length === 0) {
                alert('No transactionOrders available to print.');
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
                        <title>Transactions Report</title>
                        <style>
                            body { font-family: Arial, sans-serif; }
                            table { width: 100%; border-collapse: collapse; }
                            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                            th { background-color: #f2f2f2; }
                            h2 { margin: 0; }
                            h2, h4, h5 { text-align: center; }
                            h4, h5 { font-weight: normal; margin: 5px; }
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
                        <p><strong>Transactions Report for ${this.branchName} Branch</strong></p>
                        <table>
                            <tr>
                                <th>Last Update</th>
                                <th>Quantity</th>
                                <th>Cash render</th>
                                <th>Charge</th>
                                <th>Change</th>
                            </tr>
                            ${this.transactStore.transactionOrders.map(t_order => `
                                <tr>
                                    <td>${this.formatDateTime(t_order.updated_at)}</td>
                                    <td>${t_order.product_name}</td>
                                    <td>${t_order.product_price}</td>
                                    <td>₱${t_order.total_quantity}</td>
                                    <td>₱${t_order.total_price}</td>
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

        formatTransactionOrders(t_order) {
            return {
                ...t_order,
                updated_at: this.formatDateTime(t_order.updated_at),
                display_product_price: `₱${t_order.product_price}`,
                display_total_price: `₱${t_order.total_price}`,
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