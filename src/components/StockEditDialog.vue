<template>
    <v-dialog :model-value="modelValue" @update:modelValue="$emit('update:modelValue', $event)" max-width="500px">
        <v-card>
            <v-card-title class="text-h6">Edit Stock</v-card-title>
            <v-card-text>
                <v-form ref="form" :model-value="valid">
                    <v-text-field :model-value="stock.stock_ingredient"
                        @update:modelValue="handleInputUpdate('stock_ingredient', $event)" label="Ingredient"
                        :rules="[v => !!v || 'Required']" outlined dense />

                    <v-text-field :model-value="stock.stock_in"
                        @update:modelValue="handleInputUpdate('stock_in', $event)" label="Stock In"
                        :rules="[v => !!v || 'Required']" outlined dense />

                    <v-select :model-value="stock.stock_unit"
                        @update:modelValue="handleInputUpdate('stock_unit', $event)" label="Unit"
                        :items="stockUnitOption" item-title="unit_avb" item-value="unit_id" outlined dense />

                    <v-text-field :model-value="stock.stock_cost_per_unit" @update:modelValue="handleCostUpdate($event)"
                        label="Cost Per Unit (₱)" :rules="[v => !isNaN(parseFloat(v)) || 'Must be a valid number']"
                        type="text" outlined dense />

                    <v-select :model-value="stock.availability_id"
                        @update:modelValue="handleInputUpdate('availability_id', $event)" label="Availability"
                        :items="stockAvailabilityOption" item-title="availability_label" item-value="availability_id"
                        outlined dense />
                    <span style="font-size: small">
                        Last changes: {{ formatDate(stock.updated_at) }}
                    </span>
                </v-form>
            </v-card-text>
            <v-card-actions>
                <v-btn color="green" class="ms-3 mb-2" variant="tonal" @click="$emit('update:confirm', true)"
                    :disabled="!valid">
                    <v-icon>mdi-content-save</v-icon>&nbsp; Save
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn color="red" class="me-3 mb-2" variant="tonal" @click="$emit('update:modelValue', false)">
                    <v-icon>mdi-close</v-icon>&nbsp; Close
                </v-btn>
            </v-card-actions>

            <v-dialog :model-value="confirm" @update:modelValue="$emit('update:confirm', $event)" max-width="600px"
                persistent>
                <v-card>
                    <v-card-title class="text-h6">Confirm Update</v-card-title>
                    <v-card-text>
                        Are you sure you want to save changes to <strong>{{ selectedStock }}</strong>?
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer />
                        <v-btn color="red" class="me-2 mb-2" variant="tonal" :disabled="loading"
                            @click="$emit('update:confirm', false)">
                            <v-icon>mdi-close</v-icon>&nbsp; Cancel
                        </v-btn>
                        <v-btn color="green" class="me-2 mb-2" variant="tonal" :disabled="loading"
                            @click="$emit('save')">
                            <v-icon>mdi-check</v-icon>&nbsp; Confirm
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
            <LoaderUI :visible="loading" message="Saving..." />
        </v-card>
    </v-dialog>
</template>

<script>
import LoaderUI from '@/components/LoaderUI.vue';
import apiClient from '../axios'

export default {
    name: 'StockEditDialog',
    components: {
        LoaderUI,
    },
    data() {
        return {
            stockUnitOption: [],
            stockAvailabilityOption: [],
        }
    },
    mounted() {
        this.getStockUnitOption();
        this.getStockAvailabilityOption();
    },
    props: {
        modelValue: {
            type: Boolean,
            required: true
        },
        confirm: {
            type: Boolean,
            required: true
        },
        stock: {
            type: Object,
            default: null
        },
        valid: {
            type: Boolean,
            required: true
        },
        loading: {
            type: Boolean,
            default: false
        },
        selectedStock: {
            type: String,
            default: ''
        },
    },
    emits: [
        'update:modelValue',
        'update:confirm',
        'update:stock',
        'save'
    ],
    methods: {
        async getOptions(endpoint, targetArray, errorMessage) {
            try {
                const response = await apiClient.get(endpoint, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
                    },
                });
                this[targetArray] = response.data;
            } catch (error) {
                this.$refs.snackbarRef.showSnackbar(errorMessage, 'error');
            }
        },
        getStockUnitOption() {
            this.getOptions('/admin/stock-unit-option', 'stockUnitOption', 'Failed to fetch stock unit');
        },
        getStockAvailabilityOption() {
            this.getOptions('/admin/product-availability-option', 'stockAvailabilityOption', 'Failed to fetch stock availability');
        },
        formatDate(date) {
            if (!date) return 'Invalid date';
            return date
        },
        handleCostUpdate(value) {
            const cleanedValue = value.replace(/[^0-9.]/g, '');
            this.$emit('update:stock', {
                ...this.stock,
                stock_cost_per_unit: cleanedValue
            });
        },
        handleInputUpdate(field, value) {
            const updatedValue = field === 'stock_unit' || field === 'availability_id'
                ? Number(value)
                : value;
            this.$emit('update:stock', {
                ...this.stock,
                [field]: updatedValue
            });
        },
    }
}
</script>