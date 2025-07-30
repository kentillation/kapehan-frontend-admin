<template>
    <v-data-table 
        :headers="headers" 
        :items="skeletonItems" 
        density="comfortable">
        <template v-slot:top>
            <v-toolbar flat>
                <h2 class="ms-4 to-hide">List of Void Blotters</h2>
                <h2 class="ms-4 to-show">List</h2>
                <v-spacer></v-spacer>
                <div class="w-75 w-sm-50 d-flex align-center justify-space-between">
                    <v-autocomplete label="Date Filter" model-value="Today" class="mt-5 me-3"></v-autocomplete>
                    <v-btn icon="mdi-refresh" color="#0090b6" variant="flat" size="small" class="me-3"></v-btn>
                </div>
            </v-toolbar>
        </template>

        <template v-slot:[`item.reference_number`]>
            <v-skeleton-loader type="text" width="100" class="bg-grey-lighten-1"></v-skeleton-loader>
        </template>

        <template v-slot:[`item.total_quantity`]>
            <v-skeleton-loader type="text" width="100" class="bg-grey-lighten-1"></v-skeleton-loader>
        </template>

        <template v-slot:[`item.cash_render`]>
            <v-skeleton-loader type="text" width="100" class="bg-grey-lighten-1"></v-skeleton-loader>
        </template>

        <template v-slot:[`item.customer_charge`]>
            <v-skeleton-loader type="text" width="100" class="bg-grey-lighten-1"></v-skeleton-loader>
        </template>

        <template v-slot:[`item.customer_change`]>
            <v-skeleton-loader type="text" width="100" class="bg-grey-lighten-1"></v-skeleton-loader>
        </template>

        <template v-slot:[`item.updated_at`]>
            <v-skeleton-loader type="text" width="100" class="bg-grey-lighten-1"></v-skeleton-loader>
        </template>
    </v-data-table>
</template>

<script>
export default {
    name: 'TransactionsReportsTableSkeleton',
    data() {
        return {
            headers: [
                { title: 'Reference', value: 'reference_number', sortable: 'true', width: '25%' },
                { title: 'Quantity', value: 'total_quantity', sortable: 'true', width: '15%' },
                { title: 'Cash_render', value: 'cash_render', sortable: 'true', width: '10%' },
                { title: 'Charge', value: 'customer_charge', sortable: 'true', width: '10%' },
                { title: 'Change', value: 'customer_change', sortable: 'true', width: '15%' },
                { title: 'Transaction date', value: 'updated_at', sortable: 'true', width: '25%' },
            ],
            skeletonItems: Array(10).fill({}) // Creates 10 empty rows
        }
    }
}
</script>

<style scoped>
.v-skeleton-loader {
    margin: 4px 0;
}

::v-deep(.v-skeleton-loader__bone) {
    background-color: rgba(0, 0, 0, 0.05) !important;
}

::v-deep(.v-skeleton-loader__animation-wave) {
    background: linear-gradient(90deg,
            rgba(255, 255, 255, 0),
            rgba(255, 255, 255, 0.5),
            rgba(255, 255, 255, 0)) !important;
    animation-duration: 1.5s !important;
}
</style>