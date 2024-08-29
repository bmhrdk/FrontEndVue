<script>
import IconOut from '@/components/icons/IconOut.vue';
import IconIn from '@/components/icons/IconIn.vue';
import IconQuantity from '@/components/icons/IconQuantity.vue';
import IconTotalSpare from '@/components/icons/IconTotalSpare.vue';
import IconKeluar from '@/components/icons/IconKeluar.vue';
import api from '@/api';
import { Doughnut, Bar } from 'vue-chartjs';
import { ref, onMounted, onUnmounted } from 'vue';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale, BarElement } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale, BarElement);

const getCurrentDate = () => {
    const now = new Date();
    const date = now.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
    const time = now.toLocaleTimeString('id-ID', {
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
    });
    return `${date} ${time}`;
};

export default {
    name: 'Chart',
    components: { Doughnut, Bar, IconIn, IconOut, IconQuantity, IconTotalSpare, IconKeluar },
    setup() {
        const currentDate = ref('');

        const updateDate = () => {
            currentDate.value = getCurrentDate();
        };

        onMounted(() => {
            updateDate();
            const interval = setInterval(updateDate, 1000);
            onUnmounted(() => clearInterval(interval));
        });

        return {
            currentDate
        };
    },
    data() {
        return {
            doughnutChartData: {
                labels: ['ASUS', 'ACER', 'MSI'],
                datasets: [{
                    data: [40, 20, 12],
                    backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
                }]
            },
            doughnutchartOptions: {
                responsive: true
            },
            barChartData: {
                labels: [],
                datasets: [
                    {
                        label: 'Banyaknya Laptop',
                        backgroundColor: '#36A2EB',
                        data: []
                    }
                ]
            },
            barChartOptions: {
                responsive: true,
                scales: {
                    x: {
                        beginAtZero: true
                    },
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function (value) {
                                return Number.isInteger(value) ? value : null;
                            },
                            stepSize: 2,
                        },
                    }
                }
            }
        }
    },

    async mounted() {
        // this.loaded = false

        try {
            const tokenUser = localStorage.getItem('accessToken');
            const responseIncome = await api.request('get', '/api/chartMonth', null, tokenUser);
            const labels = responseIncome.labels;
            const data = responseIncome.data;

            this.barChartData = {
                labels,
                datasets: [
                    {
                        label: 'Monthly Service',
                        ...this.barChartData.datasets[0], // Spread existing dataset properties
                        data
                    },
                ],
            };
            // this.loaded = true
        } catch (e) {
            console.error(e)
        }
    }
}
</script>

<template>
    <div class="bg-[#c4b9b9] min-h-screen bg-opacity-75">
        <div class="flex justify-between items-center pt-4 pl-4">
            <div class="text-left block uppercase font-bold text-xl text-black text-opacity-70 ">
                {{ currentDate }}
            </div>
            <!-- <button
                class="flex items-center bg-redclass hover:bg-white text-white font-semibold hover:text-redclass py-2 px-4 border border-transparent hover:border-redclass duration-500 rounded-full mr-4">
                <IconKeluar class="mr-2 h-7 w-7"></IconKeluar>
                Log Out
            </button> -->
        </div>

        <div class="justify-center flex p-4 mt-6 md:gap-6 gap-3">
            <div class="p-4 w-60 bg-white space-y-2 rounded-md">
                <span class="text-center block uppercase font-bold text-sm text-black text-opacity-70">Service
                    Total</span>
                <div class="justify-center flex space-x-2 items-center">
                    <IconQuantity class="w-10 h-10"></IconQuantity>
                    <span class="md:text-5xl text-3xl text-smoothgray text-opacity-70 font-bold">1</span>
                </div>
            </div>
            <div class="p-4 w-60 bg-white space-y-2 rounded-md">
                <span class="text-center block uppercase font-bold text-sm text-black text-opacity-70">Spareparts
                    Masuk</span>
                <div class="justify-center flex space-x-2 items-center">
                    <IconIn class="w-10 h-10 text-green-600"></IconIn>
                    <span class="md:text-5xl text-3xl text-smoothgray text-opacity-70 font-bold">2</span>
                </div>
            </div>
            <div class="p-4 w-60 bg-white space-y-2 rounded-md">
                <span class="text-center block uppercase font-bold text-sm text-black text-opacity-70">Spareparts
                    Keluar</span>
                <div class="justify-center flex space-x-2 items-center">
                    <IconOut class="w-10 h-10 text-red-600"></IconOut>
                    <span class="md:text-5xl text-3xl text-black text-opacity-70 font-bold">3</span>
                </div>
            </div>
            <div class="p-4 w-60 bg-white space-y-2 rounded-md">
                <span class="text-center block uppercase font-bold text-sm text-black text-opacity-70">Total Spareparts
                </span>
                <div class="justify-center flex space-x-2 items-center">
                    <IconTotalSpare class="w-10 h-10"></IconTotalSpare>
                    <span class="md:text-5xl text-3xl text-black text-opacity-70 font-bold">10</span>
                </div>
            </div>
        </div>
        <div class="flex justify-center">
            <div
                class="bg-white drop-shadow-lg rounded-2xl w-fit text-center justify-center uppercase font-bold text-xl text-black text-opacity-70 p-4 py-2">
                Statistik Grafik
            </div>
        </div>
        <div class="flex justify-center gap-6 mt-4">
            <div class="bg-white drop-shadow-lg p-4 justify-center items-center max-w-md rounded-md">
                <div class="flex tracking-wider font-bold text-black text-opacity-70 justify-center uppercase">List
                    Laptop Service</div>
                <div class="w-[424px] h-72 flex justify-center items-center">
                    <Doughnut id="doughnut-chart-id" :options="doughnutChartOptions" :data="doughnutChartData" />
                </div>
            </div>
            <div class="bg-white p-4 drop-shadow-lg justify-center items-center max-w-xl rounded-md">
                <div class="flex tracking-wider font-bold text-black text-opacity-70 justify-center uppercase">Total
                    Laptop DiServis</div>
                <div class=" w-[500px] h-72 flex justify-center items-center">
                    <Bar id="bar-chart-id" :options="barChartOptions" :data="barChartData" />
                </div>
            </div>
        </div>
    </div>
</template>
