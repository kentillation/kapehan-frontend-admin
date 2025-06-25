<template>
    <v-data-table :headers="filteredHeaders" :items="stocks" :loading="loading" :items-per-page="10"
        :sort-by="[{ key: 'stock_ingredient', order: 'asc' }]" class="elevation-1 hover-table" density="comfortable">
        <template v-slot:top>
            <v-toolbar flat color="transparent">
                <v-toolbar-title class="text-h6 font-weight-medium">
                    <span class="to-hide">Stocks Report</span>
                    <span class="to-show">Stocks</span>
                </v-toolbar-title>
                <v-btn prepend-icon="mdi-download" color="primary" variant="tonal">XLS</v-btn>&nbsp;
                <v-btn prepend-icon="mdi-printer" color="primary" variant="tonal">PRINT</v-btn>&nbsp;
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
</template>

<script>
import { computed } from 'vue';
import { useDisplay } from 'vuetify';
import { useLoadingStore } from '@/stores/loading';

export default {
    name: 'StocksTable',
    data() {
        return {
        }
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
        branchId: {
            type: Number,
            required: true
        },
        branchName: {
            type: String,
            required: true
        },
        shopId: {
            type: Number,
            required: true
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
            { title: 'Ingredients', value: 'stock_ingredient', sortable: 'true', width: '10%' },
            { title: 'Unit', value: 'unit_label', sortable: 'true', width: '10%' },
            { title: 'Stock In', value: 'display_stock_in', sortable: 'true', width: '10%' },
            { title: 'Unit Cost', value: 'display_unit_cost', sortable: 'true', width: '10%' },
            { title: 'Updated', value: 'updated_at', sortable: 'true', width: '25%' },
        ];
        const filteredHeaders = computed(() => {
            return headers.map(header => ({
                ...header,
                title: mobile.value ? header.title.substring(0, 3) : header.title
            }));
        });
        const processedStocks = computed(() => {
            return props.stocks.map(stock => ({
                ...stock,
                display_stock_in: `${stock.stock_in} ${stock.unit_avb}`,
                display_unit_cost: `₱${stock.stock_cost_per_unit}`,
            }));
        });
        return {
            loadingStore,
            headers,
            filteredHeaders,
            processedStocks,
        };
    },
    methods: {
    }
}
</script>