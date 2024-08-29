<script setup>
import IconEdit from '@/components/icons/IconEdit.vue';
import IconAdd from '@/components/icons/IconAdd.vue';
import IconTrash from '@/components/icons/IconTrash.vue';
import IconFind from '@/components/icons/IconFind.vue';
import IconUp from '@/components/icons/IconUp.vue';
import Notification from '@/components/Notification.vue';
import { useRouter } from 'vue-router';
import { ref, watch, provide } from 'vue';
import api from '@/api';

const router = useRouter();
const notification = ref(null);
const modalVerification = ref(false);
const filterDropdown = ref(false);
const checkedFilter = ref([]);
const getDetailService = ref(null);
const serviceDetail = ref(null);



const services = ref([]);
const searchQuery = ref('');

async function getServiceAll() {
    try {
        const tokenUser = localStorage.getItem('accessToken');
        const response = await api.request('get', '/api/getAllService', null, tokenUser);
        // console.log(response.data)
        if (response.data) {
            services.value = response.data;
            console.log(services.value)
        }
    } catch (error) {
        console.error('Failed:', error);
    }
}
// 
getServiceAll();
//
async function searchService(name) {
    try {
        const tokenUser = localStorage.getItem('accessToken');
        const response = await api.request('get', `/api/searchService/${name}`, null, tokenUser);
        console.log(response)
        if (response.data) {
            services.value = response.data;
        } else if (response.error) {
            services.value = [];
            // console.log(customers.value)
        }
    } catch (error) {
        console.error('Failed:', error);
    }
}

async function filterStatus(name) {
    try {
        const tokenUser = localStorage.getItem('accessToken');
        const response = await api.request('get', `/api/filterStatus/${name}`, null, tokenUser);
        // console.log(response)

        if (response.data) {
            services.value = response.data;
        } else if (response.error === "Data tidak ditemukan...") {
            services.value = [];
        } else if (response.error) {
            console.log(response.error);
            getServiceAll();
        }
    } catch (error) {
        console.error('Failed:', error);
    }
}

watch(() => checkedFilter.value[0], (newChecked) => {
    filterStatus(newChecked);
});


watch(searchQuery, (newQuery) => {
    if (newQuery === '') {
        getServiceAll();
    } else {
        searchService(newQuery);
    }
});

// const getOneService = async (id) => {
//     try {
//         const tokenUser = localStorage.getItem('accessToken');
//         const response = await api.request('get', `/api/getOneService/${id}`, null, tokenUser);
//         serviceDetail.value = response;
//         console.log(serviceDetail.value);
//     } catch (error) {
//         console.error('Failed:', error);
//     }
// };

const updateService = (serviceId) => {
    const id = serviceId;
    console.log(serviceId)
    provide('serviceId',id)
    router.push({ name: 'editServiceTec', params: { id } })
}

const checkOnlyOne = (value) => {
    if (checkedFilter.value.includes(value)) {
        checkedFilter.value = [value];
    }
};

// const detailService = async (id) => {
//     getDetailService.value = id;
//     // console.log(selectedEmployeeId.value)
//     if (getDetailService.value) {
//         try {
//             await getOneService(id);
//         } catch (error) {
//             console.error('Failed to fetch details:', error);
//         }
//     }
// };

function format(tanggal) {
    if (!tanggal) return '-';
    const date = new Date(tanggal);
    return date.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

function toggleDropdown() {
    filterDropdown.value = !filterDropdown.value;
}

</script>


<template>
    <div class="bg-[#c4b9b9] min-h-screen bg-opacity-75">
        <div class="flex pt-2 pr-2 justify-end w-full">
            <RouterLink to="/technician/serviceTec/newServiceTec">
                <button
                    class="flex items-center bg-blue-900 hover:bg-white text-white font-semibold hover:text-blue-900 py-2 px-4 duration-500 rounded-full mr-4 ">
                    <IconAdd class="mr-1 h-5 w-5"></IconAdd>
                    New Service
                </button>
            </RouterLink>
        </div>

        <div class="bg-white m-4 shadow-lg rounded-lg">
            <div class="justify-between w-full h-10 flex bg-[#084c61] rounded-t-lg">
                <button @click="toggleDropdown"
                    class="flex items-center bg-slate-100 hover:bg-slate-400 text-black font-semibold hover:text-blue-900 px-4 duration-500 rounded-full mt-2 h-fit ml-3 mr-4">
                    Filter Status
                    <IconUp :class="{ 'rotate-180': filterDropdown, 'rotate-0': !filterDropdown }"
                        class="ml-2 w-4 h-4 text-black relative transition-transform duration-300" style="top: -2px;"
                        stroke="currentColor" />
                </button>

                <transition enter-active-class="transition ease-out duration-300"
                    enter-from-class="opacity-0 transform scale-95" enter-to-class="opacity-100 transform scale-100"
                    leave-active-class="transition ease-in duration-300"
                    leave-from-class="opacity-100 transform scale-100" leave-to-class="opacity-0 transform scale-95">
                    <div v-if="filterDropdown"
                        class="z-50 absolute mt-10 md:ml-0 shadow rounded-md p-2 bg-white space-y-2 border border-graydark">
                        <div class="flex space-x-2">
                            <input type="checkbox" id="selesai" value="Selesai" v-model="checkedFilter"
                                @change="checkOnlyOne('Selesai')" />
                            <label for="selesai" class="bg-green-500 text-white py-1 px-2 rounded-full text-xs">
                                Selesai</label>
                        </div>
                        <div class="flex space-x-2">
                            <input type="checkbox" id="diproses" value="Diproses" v-model="checkedFilter"
                                @change="checkOnlyOne('Diproses')" />
                            <label for="diproses" class="bg-blue-500 text-white py-1 px-2 rounded-full text-xs">
                                Diproses</label>
                        </div>
                        <div class="flex space-x-2">
                            <input type="checkbox" id="pengerjaanSelesai" value="Pengerjaan Selesai" v-model="checkedFilter"
                                @change="checkOnlyOne('Pengerjaan Selesai')" />
                            <label for="pengerjaan" class="bg-orange-500 text-white py-1 px-2 rounded-full text-xs">
                                Pengerjaan</label>
                        </div>
                        <div class="flex space-x-2">
                            <input type="checkbox" id="menungguPembayaran" value="Menunggu Pembayaran"
                                v-model="checkedFilter" @change="checkOnlyOne('Menunggu Pembayaran')" />
                            <label for="menungguPembayaran"
                                class="bg-red-500 text-white py-1 px-2 rounded-full text-xs">
                                Menunggu Pembayaran</label>
                        </div>
                    </div>
                </transition>

                <div class="relative flex items-center">
                    <div class="absolute pl-3 p-1 py-2 ">
                        <IconFind class="w-6 h-6 text-graydark" />
                    </div>
                    <input type="text" v-model="searchQuery" placeholder="Cari berdasarkan nama"
                        class="text-center pl-8 text-sm flex flex-1 items-center text-black bg-blurwhite ring-inset ring-1 ring-lightdark hover:ring-graydark active:ring-graydark focus:ring-graydark focus:outline-none rounded-full p-1 px-3 duration-100 w-full md:w-64 mr-3">
                </div>
            </div>
            <div class="bg-white p-1 rounded-full">
                <table class="w-full table-fixed">
                    <thead>
                        <tr class="">
                            <th class="w-1/4 py-4 px-6 text-center text-gray-600 font-bold uppercase">Customer</th>
                            <th class="w-1/3 py-4 px-6 text-center text-gray-600 font-bold uppercase">Merek Laptop</th>
                            <th class="text-center w-1/2 py-4 px-6 text-gray-600 font-bold uppercase">Tipe</th>
                            <th class=" w-1/2 py-4 px-6 text-left text-gray-600 font-bold uppercase">Tanggal Masuk &
                                Keluar</th>
                            <th class="w-1/4 py-4 text-center text-gray-600 font-bold uppercase">Status</th>
                            <th class="w-1/4 px-0 text-center  text-gray-600 font-bold uppercase"></th>
                        </tr>
                    </thead>
                    <tbody class="bg-white">
                        <template v-if="services.length">
                            <tr v-for="service in services" :key="service.id">
                                <td class="capitalize text-center py-4 px-6 border-b border-gray-200">{{
                                    service.nama_customer }}</td>
                                <td class="uppercase text-center py-4 px-6 border-b border-gray-200">{{ service.merek }}
                                </td>
                                <td class="py-4 px-6 text-center border-b border-gray-200 truncate">{{ service.tipe }}
                                </td>
                                <td class=" text-left py-4 px-6 border-b border-gray-200">{{
                                    format(service.tanggalMasuk) }}
                                    | {{ format(service.tanggalKeluar) }}</td>
                                <td class="text-center py-4 border-b border-gray-200">
                                    <span v-if="service.status === 'Selesai'"
                                        class="bg-green-500 text-white py-1 px-2 rounded-full text-xs"> Selesai 
                                    </span>
                                    <span v-else-if="service.status === 'Diproses'"
                                        class="bg-blue-500 text-white py-1 px-2 rounded-full text-xs"> Diproses
                                    </span>
                                    <span v-else-if="service.status === 'Pengerjaan Selesai'"
                                        class="bg-orange-500 text-white py-1 px-2 rounded-full text-xs"> Pengerjaan Selesai
                                    </span>
                                    <span v-else-if="service.status === 'Menunggu Pembayaran'"
                                        class="bg-red-500 text-white py-1 px-2 rounded-full text-xs"> Menunggu
                                        Pembayaran
                                    </span>
                                </td>
                                <td class="py-4 px-6 border-b border-gray-200">
                                    <button @click="updateService(service.id)"
                                        class=" border border-white bg-yellow-500 items-center text-white hover:text-yellow-500 hover:bg-white hover:border-yellow-500 duration-500 flex rounded-full p-1 space-x-1 px-3">
                                        <IconEdit class="w-5 h-5 rounded-full"></IconEdit>
                                        <span>Edit</span>
                                    </button>
                                </td>
                            </tr>
                        </template>
                        <template v-else>
                            <tr>
                                <td colspan="6" class="uppercase text-center font-bold text-red-500 py-4">Data service
                                    tidak ada</td>
                            </tr>
                        </template>
                        <!-- Add more rows here -->
                    </tbody>
                </table>
            </div>
        </div>
    </div>

</template>