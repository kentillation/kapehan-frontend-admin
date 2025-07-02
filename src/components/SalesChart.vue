<template>
    <div>
        <v-select v-model="selectedMonth" :items="monthOptions" item-title="title" item-value="value"
            label="Select Month" class="mb-4" dense outlined style="max-width: 200px"
            @update:modelValue="handleMonthChange" />
        <Bar v-if="chartData" :data="chartData" :options="chartOptions" style="max-height: 350px" />
    </div>
</template>

<script>
import { ref, computed } from 'vue';
import { Bar } from 'vue-chartjs';
import {
    Chart,
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
} from 'chart.js';

Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default {
    components: { Bar },
    props: {
        salesByMonth: {
            type: Array,
            required: true,
        },
    },

    setup(props, { emit }) {
        const monthOptions = [
            { title: 'January', value: 0 },
            { title: 'February', value: 1 },
            { title: 'March', value: 2 },
            { title: 'April', value: 3 },
            { title: 'May', value: 4 },
            { title: 'June', value: 5 },
            { title: 'July', value: 6 },
            { title: 'August', value: 7 },
            { title: 'September', value: 8 },
            { title: 'October', value: 9 },
            { title: 'November', value: 10 },
            { title: 'December', value: 11 },
        ];

        const selectedMonth = ref(new Date().getMonth());

        const handleMonthChange = (monthIndex) => {
            emit('month-changed', monthIndex + 1); // Send 1-based month to backend
        };

        const filteredSales = computed(() => {
            return props.salesByMonth.filter(sale => {
                const date = new Date(sale.updated_at);
                return date.getMonth() === selectedMonth.value;
            });
        });

        const chartData = computed(() => {
            if (!filteredSales.value.length) return null;
            const year = new Date(filteredSales.value[0].updated_at).getFullYear();
            const daysInMonth = new Date(year, selectedMonth.value + 1, 0).getDate();
            const salesPerDay = Array(daysInMonth).fill(0);
            filteredSales.value.forEach(sale => {
                const date = new Date(sale.updated_at);
                const day = date.getDate();
                salesPerDay[day - 1] += Number(sale.sales || sale.total_sales || 0);
            });
            const labels = Array.from({ length: daysInMonth }, (_, i) => (i + 1).toString());
            return {
                labels,
                datasets: [
                    {
                        label: 'Sales (₱)',
                        backgroundColor: '#795548',
                        data: salesPerDay,
                    },
                ],
            };
        });

        const chartOptions = {
            responsive: true,
            plugins: {
                legend: { display: false },
                tooltip: { enabled: true },
            },
            scales: {
                y: { beginAtZero: true },
            },
        };

        return {
            monthOptions,
            selectedMonth,
            chartData,
            chartOptions,
            handleMonthChange,
        };
    }

};
</script>