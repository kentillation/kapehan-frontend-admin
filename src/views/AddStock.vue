<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <v-container>
        <h1 class="text-brown-lighten-1">Add Stock ( {{ branchName }} Branch )</h1>
        <v-form ref="stockForm" @submit.prevent="showConfirmDialog">
            <v-row v-for="(row, index) in stockRows" :key="index"
                class="d-flex align-center border rounded my-3 pt-3 mx-auto">
                <v-col cols="12" lg="1" md="6" sm="6">
                    <v-btn color="red" class="pe-1 mb-4" variant="tonal" prepend-icon="mdi-trash-can-outline"
                        @click="removeRow(index)"></v-btn>
                </v-col>
                <v-col cols="12" lg="3" md="6" sm="6">
                    <v-text-field v-model="row.ingredient" label="Ingredient" :rules="[v => !!v || 'Required']"
                        variant="outlined" />
                </v-col>
                <v-col cols="12" lg="2" md="6" sm="6">
                    <v-text-field v-model="row.quantity" label="Stock In (qty)" :rules="[v => !!v || 'Required']"
                        type="number" variant="outlined" />
                </v-col>
                <v-col cols="12" lg="3" md="6" sm="6">
                    <v-autocomplete v-model="row.unit" label="Unit" :items="unitOptions"
                        :rules="[v => !!v || 'Required']" item-title="unit_label" item-value="unit_id"
                        variant="outlined" />
                </v-col>
                <v-col cols="12" lg="3" md="6" sm="6">
                    <v-text-field v-model="row.costPerUnit" label="Cost Per Unit (₱)" type="text"
                        :rules="[v => !isNaN(parseFloat(v)) || 'Required' || 'Must be a valid number']"
                        @input="e => row.costPerUnit = e.target.value.replace(/[^0-9.]/g, '')" variant="outlined" />
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12">
                    <v-btn color="primary" class="mb-3" variant="tonal" prepend-icon="mdi-plus"
                        :disabled="validatingStock" @click="addRow">
                        Add More
                    </v-btn>
                    <v-btn color="green" class="ms-3 mb-3" variant="tonal" prepend-icon="mdi-check"
                        :disabled="!isFormValid || validatingStock" @click="showConfirmDialog">
                        Confirm
                    </v-btn>
                </v-col>
            </v-row>
        </v-form>
        <v-dialog v-model="confirmDialog" max-width="500px">
            <v-card>
                <v-card-title>
                    <span class="headline">Confirmation</span>
                </v-card-title>
                <v-card-text>
                    <p class="text-center">Do you want to save new stocks?</p>
                </v-card-text>
                <v-card-actions class="mx-4 my-4">
                    <v-spacer></v-spacer>
                    <v-btn color="red" class="px-3" variant="tonal" prepend-icon="mdi-close" text
                        @click="closeConfirmDialog">Check
                        again</v-btn>
                    <v-btn color="green" class="px-3" variant="tonal" prepend-icon="mdi-content-save"
                        @click="submitForm">
                        <v-progress-circular v-if="validatingStock" size="20" color="white" label="Loading..."
                            indeterminate />
                        <span v-else>Save</span>
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <Snackbar ref="snackbarRef" />
        <LoaderUI :visible="validatingStock" message="Saving..." />
    </v-container>
</template>

<script>
import Snackbar from '@/components/Snackbar.vue';
import LoaderUI from '@/components/LoaderUI.vue';
import { useStocksStore } from '@/stores/stocksStore';

export default {
    // eslint-disable-next-line vue/multi-word-component-names
    name: 'AddStock',
    components: {
        Snackbar,
        LoaderUI
    },
    data() {
        return {
            shopID: null,
            branchID: null,
            branchName: null,
            validatingStock: false,
            confirmDialog: false,
            stockRows: [
                {
                    ingredient: '',
                    quantity: '',
                    unit: null,
                    costPerUnit: '',
                },
            ],
            unitOptions: [
                { unit_id: 1, unit_label: 'g' },
                { unit_id: 2, unit_label: 'mL' },
                { unit_id: 3, unit_label: 'pcs' },
                { unit_id: 4, unit_label: 'kg' },
                { unit_id: 5, unit_label: 'L' },
                { unit_id: 6, unit_label: 'bx' },
                { unit_id: 7, unit_label: 'btl' },
            ],
        };
    },
    setup() {
        const stocksStore = useStocksStore();
        return { stocksStore };
    },
    created() {
        this.shopID = this.$route.query.shop_id;
        this.branchID = this.$route.query.branch_id;
        this.branchName = this.$route.query.branch_name;
    },
    computed: {
        isFormValid() {
            return this.stockRows.every(row => {
                return (
                    row.ingredient &&
                    row.quantity &&
                    row.unit &&
                    !isNaN(parseFloat(row.costPerUnit))
                );
            });
        },
    },
    methods: {
        removeRow(index) {
            if (this.stockRows.length > 1) {
                this.stockRows.splice(index, 1);
            }
        },
        showConfirmDialog() {
            if (this.isFormValid) this.confirmDialog = true;
        },
        closeConfirmDialog() {
            this.confirmDialog = false;
        },
        addRow() {
            this.stockRows.push({
                ingredient: '',
                quantity: '',
                unit: null,
                costPerUnit: '',
            });
        },
        async submitForm() {
            this.confirmDialog = false;
            try {
                if (!this.$refs.stockForm.validate()) return;
                this.validatingStock = true;
                const payload = this.stockRows.map(row => ({
                    stock_ingredient: row.ingredient,
                    stock_in: row.quantity,
                    stock_unit: row.unit,
                    stock_cost_per_unit: parseFloat(row.costPerUnit.replace(/[^0-9.]/g, '')) || 0,
                    branch_id: this.branchID
                }));
                await this.stocksStore.saveStocksStore(payload);
                this.validatingStock = false;
                this.showSuccess("Stocks saved successfully!");
                this.$refs.stockForm.reset();
            } catch (error) {
                this.validatingStock = false;
                this.showError("Failed to save stocks. Please try again!");
                console.error('Stocks submission error:', error);
            }
        },
        showError(message) {
            this.$refs.snackbarRef.showSnackbar(message, "error");
        },
        showSuccess(message) {
            this.$refs.snackbarRef.showSnackbar(message, "success");
        },
    },

};
</script>