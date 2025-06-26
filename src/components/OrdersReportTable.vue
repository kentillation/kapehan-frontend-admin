<template>
    <v-data-table :headers="ordersHeaders" :items="orders" :loading="loading" :items-per-page="10"
        :sort-by="[{ key: 'updated_at', order: 'desc' }]" class="hover-table" density="comfortable">
        <template v-slot:top>
            <v-toolbar flat color="transparent">
                <v-btn @click="downloadOrders" prepend-icon="mdi-download" color="primary" variant="tonal">XLS</v-btn>&nbsp;
                <v-btn @click="printOrders" prepend-icon="mdi-printer" color="primary" variant="tonal">PRINT</v-btn>&nbsp;
                <v-btn prepend-icon="mdi-refresh" color="primary" variant="tonal" class="ps-7 me-3"
                    @click="$emit('refresh')" :loading="loading"></v-btn>
            </v-toolbar>
        </template>

        <template v-slot:no-data>
            <v-alert type="warning" variant="tonal" class="ma-4">
                <span>&nbsp; No orders found for this branch.</span>
            </v-alert>
        </template>
    </v-data-table>
    <Snackbar ref="snackbarRef" />
</template>

<script>
import { useLoadingStore } from '@/stores/loading';
import { useOrdersStore } from '@/stores/ordersStore';
import Snackbar from '@/components/Snackbar.vue';

export default {
    name: 'OdersReportsTable',
    data() {
        return {
            ordersHeaders: [
                { title: '', value: 'select', width: '5%' },
                { title: 'Reference #', value: 'reference_number', sortable: 'true', width: '15%' },
                { title: 'Quantity', value: 'total_quantity', sortable: 'true', width: '15%' },
                { title: 'Cash render', value: 'display_customer_cash', sortable: 'true', width: '15%' },
                { title: 'Charge', value: 'display_customer_charge', sortable: 'true', width: '15%' },
                { title: 'Change', value: 'display_customer_change', sortable: 'true', width: '15%' },
                { title: 'Last_update', value: 'updated_at', sortable: 'true', width: '25%' },
            ],
        }
    },
    components: {
        Snackbar,
    },
    props: {
        orders: {
            type: Array,
            required: true
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
        const ordersStore = useOrdersStore();
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
            ordersStore,
            formatCurrentDate,
        };
    },
    methods: {
        async downloadOrders() {
            await this.ordersStore.fetchAllOrdersStore(this.branchId);
            if (this.ordersStore.orders.length === 0) {
                alert('No orders available to download.');
                return;
            } else {
                this.loadingStore.show('Downloading orders...');
            }
            const orders = this.ordersStore.orders.map(order => ({
                'Reference #': order.reference_number,
                'Quantity': order.total_quantity,
                'Cash render': order.customer_cash,
                'Charge': order.customer_charge,
                'Change': order.customer_change,
                'Last Update': this.formatDateTime(order.updated_at),
            }));
            const headings = [
                `Shop Name: ${this.shopName}`,
                `Branch Name: ${this.branchName}`,
                `Branch Loc: ${this.branchLocation}`,
                `Contact: ${this.contact}`,
                `Date: ${this.formatCurrentDate}`,
                `Prepared by : ${this.adminName}`,
                '',
            ].join('\n');
            const csvContent = "data:text/csv;charset=utf-8,"
                + headings + "\n"
                + Object.keys(orders[0]).join(",") + "\n"
                + orders.map(e => Object.values(e).join(",")).join("\n");
            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", `Orders_Report_${this.branchName}.csv`);
            document.body.appendChild(link); // Required for FF
            this.showSuccess("Orders downloaded successfully!");
            link.click();
            this.loadingStore.hide();
            document.body.removeChild(link);
            // this.$emit('refresh');
        },

        async printOrders() {
            await this.ordersStore.fetchAllOrdersStore(this.branchId);
            if (this.ordersStore.orders.length === 0) {
                alert('No orders available to print.');
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
                        <p><strong>Orders Report for ${this.branchName} Branch</strong></p>
                        <table>
                            <tr>
                                <th>Reference #</th>
                                <th>Quantity</th>
                                <th>Cash render</th>
                                <th>Charge</th>
                                <th>Change</th>
                                <th>Last Update</th>
                            </tr>
                            ${this.ordersStore.orders.map(order => `
                                <tr>
                                    <td>${order.reference_number}</td>
                                    <td>${order.total_quantity}</td>
                                    <td>${order.customer_cash}</td>
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

        showError(message) {
            this.$refs.snackbarRef.showSnackbar(message, "error");
        },

        showSuccess(message) {
            this.$refs.snackbarRef.showSnackbar(message, "success");
        },
    }
}
</script>