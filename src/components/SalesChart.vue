<template>
    <div>
        <v-select v-model="selectedMonth" 
            :items="monthOptions" 
            item-title="title"
            item-value="value"
            label="Select Month" 
            class="mb-4" 
            dense 
            outlined
            style="max-width: 200px"
            />
        <Bar v-if="chartData" 
            :data="chartData" 
            :options="chartOptions" 
            style="max-height: 350px" />
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
        salesByDate: {
            type: Array,
            required: true,
        },
    },
    setup(props) {
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

        const filteredSales = computed(() => {
            return props.salesByDate.filter(sale => {
                const date = new Date(sale.updated_at);
                return date.getMonth() === selectedMonth.value;
            });
        });

        const chartData = computed(() => {
            if (!filteredSales.value.length) return null;
            const days = {};
            filteredSales.value.forEach(sale => {
                const date = new Date(sale.updated_at);
                const day = date.getDate();
                days[day] = (days[day] || 0) + Number(sale.sales || sale.total_sales || 0);
            });
            const labels = Object.keys(days).sort((a, b) => a - b);
            const data = labels.map(day => days[day]);
            return {
                labels,
                datasets: [
                    {
                        label: 'Sales (₱)',
                        backgroundColor: '#795548',
                        data,
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
        };
    },
};
</script>