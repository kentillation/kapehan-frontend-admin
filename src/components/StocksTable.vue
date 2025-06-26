<template>
    <v-row>
        <v-col cols="12" lg="4" md="4" sm="6">
            <v-text-field density="comfortable" v-model="searchStock" placeholder="Search stock here..." clearable
                variant="outlined"></v-text-field>
        </v-col>
    </v-row>
    <v-data-table :headers="stockHeaders" :items="stocks" :loading="loading" :items-per-page="10"
        :sort-by="[{ key: 'stock_ingredient', order: 'asc' }]" class="elevation-1 hover-table" density="comfortable">
        <template v-slot:top>
            <v-toolbar flat>
                <h2 class="ms-3 to-hide">List of all Stocks</h2>
                <h2 class="ms-3 to-show">List</h2>
                <v-spacer></v-spacer>
                <AddStockDialog v-model="addStockDialog" />
                <v-btn @click="openAddStockDialog" :disabled="loading" prepend-icon="mdi-plus" color="primary"
                    class="me-2" variant="tonal">
                    <span class="to-hide">Add stocks</span>
                    <span class="to-show">Stocks</span>
                </v-btn>
                <v-btn @click="$emit('refresh')" :loading="loading" icon="mdi-refresh" color="primary" variant="tonal"
                    size="small" class="me-3"></v-btn>
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
import { useLoadingStore } from '@/stores/loading';
import AddStockDialog from '@/components/AddStockDialog.vue';

export default {
    name: 'StocksTable',
    data() {
        return {
            searchStock: '',
            addStockDialog: false,
            stockHeaders: [
                { title: '', value: 'select', width: '5%' },
                { title: 'Ingredients', value: 'stock_ingredient', sortable: 'true', width: '20%' },
                { title: 'Stock_quantity', value: 'display_stock_in', sortable: 'true', width: '15%' },
                { title: 'Unit_cost', value: 'display_unit_cost', sortable: 'true', width: '15%' },
                { title: 'Availability', value: 'availability_label', sortable: 'true', width: '10%' },
                { title: 'Last_update', value: 'updated_at', sortable: 'true', width: '20%' },
                { title: '', value: 'actions', width: '15%' },
            ],
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
    setup() {
        const loadingStore = useLoadingStore();
        return {
            loadingStore,
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