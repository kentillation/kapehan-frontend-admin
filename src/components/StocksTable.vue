<template>
    <v-text-field class="to-hide" density="comfortable" v-model="searchStock"
        :placeholder="`Search stock in ${branchName}`" clearable variant="outlined"></v-text-field>
    <v-text-field class="to-show" density="comfortable" v-model="searchStock" :placeholder="`Search stock`" clearable
        variant="outlined"></v-text-field>
    <v-data-table :headers="filteredHeaders" :items="stocks" :loading="loading" :items-per-page="10"
        :sort-by="[{ key: 'stock_igngredient', order: 'asc' }]" class="elevation-1 hover-table" density="comfortable">
        <template v-slot:top>
            <v-toolbar flat color="transparent">
                <v-toolbar-title class="text-h6 font-weight-medium">
                    <span class="to-hide">List of all Stocks</span>
                    <span class="to-show">List</span>
                </v-toolbar-title>

                <v-spacer></v-spacer>

                <!-- <v-btn :disabled="hasCheck" prepend-icon="mdi-pencil" color="green" class="me-2"
                    variant="tonal">&nbsp;Edit
                </v-btn> -->

                <AddStockDialog v-model="addStockDialog" />
                <v-btn @click="openAddStockDialog" :disabled="loading" prepend-icon="mdi-plus" color="primary"
                    class="me-2" variant="tonal">&nbsp;Add
                </v-btn>

                <v-btn @click="$emit('refresh')" :loading="loading" icon="mdi-refresh" color="primary" variant="tonal"
                    size="small"></v-btn>
            </v-toolbar>
        </template>

        <!--eslint-disable-next-line -->
        <!-- <template v-slot:item.select="{ item }">
            <v-checkbox v-model="item.selected" :value="true" color="primary"
                class="d-flex justify-center"></v-checkbox>
        </template> -->

        <!--eslint-disable-next-line -->
        <template v-slot:item.availability_label="{ item }">
            <v-chip :color="item.availability_id === 1 ? 'green' : 'red'" size="small" variant="flat">
                {{ item.availability_label }}
            </v-chip>
        </template>

        <!--eslint-disable-next-line -->
        <template v-slot:item.actions="{ item }">
            <v-btn @click="$emit('edit-stock', item)" color="green" variant="tonal" size="small">
                <v-icon>mdi-pencil</v-icon>&nbsp;Edit
            </v-btn>
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
import AddStockDialog from '@/components/AddStockDialog.vue';

export default {
    name: 'StocksTable',
    data() {
        return {
            searchStock: '',
            addStockDialog: false,
        }
    },
    components: {
        AddStockDialog
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
        'edit-stock',
    ],
    // computed: {
    //     hasCheck() {
    //         return !this.stocks.some(item => item.selected);
    //     }
    // },
    setup(props) {
        const loadingStore = useLoadingStore();

        const { mobile } = useDisplay();

        const headers = [
            { title: '', value: 'select', width: '5%' },
            { title: 'Ingredients', value: 'stock_ingredient', sortable: 'true', width: '20%' },
            { title: 'Stock In', value: 'display_stock_in', sortable: 'true', width: '15%' },
            { title: 'Unit Cost', value: 'display_unit_cost', sortable: 'true', width: '15%' },
            { title: 'Availability', value: 'availability_label', sortable: 'true', width: '10%' },
            { title: 'Updated', value: 'updated_at', sortable: 'true', width: '20%' },
            { title: 'Actions', value: 'actions', width: '15%' },
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
        openAddStockDialog() {
            this.$router.push({
                path: '/add-stock/',
                query: {
                    shop_id: this.shopId,
                    branch_id: this.branchId,
                    branch_name: this.branchName,
                }
            });
            // this.addStockDialog = true;
        },
    }
}
</script>