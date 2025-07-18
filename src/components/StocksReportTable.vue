<template>
    <v-data-table :headers="stocksHeaders" :items="stocks" :loading="loading" :items-per-page="10"
        :sort-by="[{ key: 'stock_ingredient', order: 'asc' }]" class="hover-table" density="comfortable">
        <template v-slot:top>
            <v-toolbar flat color="transparent" class="mt-2">
                <v-btn @click="downloadStocks" prepend-icon="mdi-download" color="primary" variant="tonal">XLS</v-btn>&nbsp;
                <v-btn @click="printStocks" prepend-icon="mdi-printer" color="primary" variant="tonal">PRINT</v-btn>&nbsp;
                <v-btn prepend-icon="mdi-refresh" color="primary" variant="tonal" class="ps-7 me-3"
                    @click="$emit('refresh')" :loading="loading"></v-btn>
            </v-toolbar>
        </template>

        <template v-slot:no-data>
            <v-alert type="warning" variant="tonal" class="ma-4">
                <span>&nbsp; No stocks found for this branch.</span>
            </v-alert>
        </template>
    </v-data-table>
    <Snackbar ref="snackbarRef" />
</template>

<script>
import { useLoadingStore } from '@/stores/loading';
import { useStocksStore } from '@/stores/stocksStore';
import Snackbar from '@/components/Snackbar.vue';

export default {
    name: 'StocksReportTable',
    data() {
        return {
            shopLogoLink: '-',
            stocksHeaders: [
                { title: '', value: 'select', width: '5%' },
                { title: 'Ingredients', value: 'stock_ingredient', sortable: 'true', width: '15%' },
                { title: 'Unit', value: 'unit_label', sortable: 'true', width: '15%' },
                { title: 'Stock quantity', value: 'display_stock_in', sortable: 'true', width: '15%' },
                { title: 'Unit cost', value: 'display_unit_cost', sortable: 'true', width: '15%' },
                { title: 'Last update', value: 'updated_at', sortable: 'true', width: '25%' },
            ],
        }
    },
    components: {
        Snackbar,
    },
    props: {
        stocks: {
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
        const stocksStore = useStocksStore();
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
            stocksStore,
            currentNumberDate,
            formatCurrentDate,
        };
    },
    methods: {
        async downloadStocks() {
            await this.stocksStore.fetchAllStocksStore(this.branchId);
            if (this.stocksStore.stocks.length === 0) {
                this.showError("No stocks available to download.");
                return;
            } else {
                this.loadingStore.show('Downloading stocks...');
            }
            const stocks = this.stocksStore.stocks.map(stock => ({
                'Ingredients': stock.stock_ingredient,
                'Unit': stock.unit_label,
                'Stock_quantity': stock.stock_in,
                'Unit_cost': stock.stock_cost_per_unit,
                'Last Update': this.formatDateTime(stock.updated_at),
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
                + Object.keys(stocks[0]).join(",") + "\n"
                + stocks.map(e => Object.values(e).join(",")).join("\n");
            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", `Stocks_Report_${this.branchName}_${this.currentNumberDate}.csv`);
            document.body.appendChild(link); // Required for FF
            this.showSuccess("Stocks downloaded successfully!");
            link.click();
            this.loadingStore.hide();
            document.body.removeChild(link);
            // this.$emit('refresh');
        },

        async printStocks() {
            await this.stocksStore.fetchAllStocksStore(this.branchId);
            if (this.stocksStore.stocks.length === 0) {
                this.showError("No stocks available to print.");
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
                        <title>Stocks Report</title>
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
                        <p><strong>Stocks Report for ${this.branchName} Branch</strong></p>
                        <table>
                            <tr>
                                <th>Ingredients</th>
                                <th>Unit</th>
                                <th>Stock_quantity</th>
                                <th>Unit_cost</th>
                                <th>Last Update</th>
                            </tr>
                            ${this.stocksStore.stocks.map(stock => `
                                <tr>
                                    <td>${stock.stock_ingredient}</td>
                                    <td>${stock.unit_label}</td>
                                    <td>${stock.stock_in} ${stock.stock_in > 1 ? 'items' : 'item'}</td>
                                    <td>₱${stock.stock_cost_per_unit}</td>
                                    <td>${this.formatDateTime(stock.updated_at)}</td>
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