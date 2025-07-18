<template>
    <v-row>
        <v-col cols="12" lg="4" md="4" sm="6">
            <v-text-field  density="comfortable"
                v-model="searchStock" 
                placeholder="Search product here..." 
                variant="outlined" 
                label="Search stock"></v-text-field>
        </v-col>
    </v-row>
    <v-data-table :headers="headers" :items="skeletonItems" hide-default-footer class="elevation-1">
        <template v-slot:top>
            <v-toolbar flat>
                <h2 class="ms-3 to-hide">List of all Stocks</h2>
                <h2 class="ms-3 to-show">List</h2>
                <v-spacer></v-spacer>
                <v-btn prepend-icon="mdi-plus" color="primary"
                    class="me-2" variant="tonal">
                    <span class="to-hide">Add stocks</span>
                    <span class="to-show">Stocks</span>
                </v-btn>
                <v-btn icon="mdi-refresh" color="primary" variant="tonal"
                    size="small" class="me-3"></v-btn>
            </v-toolbar>
        </template>

        <template v-slot:[`item.stock_ingredient`]>
            <v-skeleton-loader type="text" width="100" class="bg-grey-lighten-1"></v-skeleton-loader>
        </template>

        <template v-slot:[`item.stock_in`]>
            <v-skeleton-loader type="text" width="100" class="bg-grey-lighten-1"></v-skeleton-loader>
        </template>

        <template v-slot:[`item.stock_cost_per_unit`]>
            <v-skeleton-loader type="text" width="100" class="bg-grey-lighten-1"></v-skeleton-loader>
        </template>

        <template v-slot:[`item.availability_label`]>
            <v-skeleton-loader type="text" width="100" class="bg-grey-lighten-1"></v-skeleton-loader>
        </template>

        <template v-slot:[`item.updated_at`]>
            <v-skeleton-loader type="text" width="100" class="bg-grey-lighten-1"></v-skeleton-loader>
        </template>

        <template v-slot:[`item.actions`]>
            <v-skeleton-loader type="text" width="100" class="bg-grey-lighten-1"></v-skeleton-loader>
        </template>
    </v-data-table>
</template>

<script>
export default {
    name: 'StocksTableSkeleton',
    data() {
        return {
            headers: [
                { title: '', value: 'stock_ingredient' },
                { title: '', value: 'stock_in' },
                { title: '', value: 'stock_cost_per_unit' },
                { title: '', value: 'availability_label' },
                { title: '', value: 'updated_at' },
                { title: '', value: 'actions' },
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