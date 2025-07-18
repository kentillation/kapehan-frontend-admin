<template>
    <v-skeleton-loader type="text" width="260" class="bg-grey-lighten-1 ms-1"></v-skeleton-loader>
    <v-data-table :headers="headers" :items="skeletonItems" hide-default-footer class="elevation-1 mt-5">
        <template v-slot:top>
            <v-toolbar flat>
                <v-toolbar-title>
                    <v-skeleton-loader type="text" width="200" class="bg-grey-lighten-1"></v-skeleton-loader>
                </v-toolbar-title>
                <v-skeleton-loader type="text" width="100" class="bg-grey-lighten-1 ms-1"></v-skeleton-loader>
                <v-skeleton-loader type="text" width="50" class="bg-grey-lighten-1 ms-1 me-3"></v-skeleton-loader>
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