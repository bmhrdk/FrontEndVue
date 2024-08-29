<script setup>
import IconEdit from '@/components/icons/IconEdit.vue';
import IconAdd from '@/components/icons/IconAdd.vue';
import IconList from '@/components/icons/IconList.vue';
import IconFind from '@/components/icons/IconFind.vue';
import IconBack from '@/components/icons/IconBack.vue';
import { useRouter } from 'vue-router';
import { ref, watch } from 'vue';
import api from '@/api';


const router = useRouter();
const notification = ref(null);
const dataTechnicians = ref([]);
const services = ref([]);
const searchQuery = ref('');
// const modalVerification = ref(false);


async function getAllTechnician() {
    try {
        const tokenUser = localStorage.getItem('accessToken');
        const response = await api.request('get', '/api/getTechnicianName', null, tokenUser);
        // console.log(response.data)
        if (response.data) {
            dataTechnicians.value = response.data;
            console.log(dataTechnicians.value)
        }
    } catch (error) {
        console.error('Failed:', error);
    }
}

getAllTechnician();

async function searchTechnician(name) {
    try {
        const tokenUser = localStorage.getItem('accessToken');
        const response = await api.request('get', `/api/searchTechnician/${name}`, null, tokenUser);
        console.log(response)
        if (response.data) {
            dataTechnicians.value = response.data;
        } else if (response.error) {
            dataTechnicians.value = [];
            // console.log(customers.value)
        }
    } catch (error) {
        console.error('Failed:', error);
    }
}

watch(searchQuery, (newQuery) => {
    if (newQuery === '') {
        getAllTechnician();
    } else {
        searchTechnician(newQuery);
    }
});

const updateTechnician = (TechnicianId) => {
    const id = TechnicianId;
    router.push({ name: 'editTechnician', params: { id } })
}

const selectedId = ref(null);

const closeModal = () => {
  selectedId.value = null;
  services.value = [];
};

const showDetail = async (id) => {
    selectedId.value = id;
    console.log(selectedId.value)
    if (selectedId.value) {
        try {
            await getHistory(id);
        } catch (error) {
            console.error('Failed to fetch details:', error);
        }
    }
};

const getHistory = async (id) => {
    try {
        const tokenUser = localStorage.getItem('accessToken');
        const response = await api.request('get', `/api/getHistory/${id}`, null, tokenUser);
        // console.log(response.data)
        if (response.data) {
            services.value = response.data;
            console.log(services.value)
        }
    } catch (error) {
        console.error('Failed:', error);
    }
}

function format(tanggal) {
    if (!tanggal) return '-';
    const date = new Date(tanggal);
    return date.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}


</script>


<template>
    <div class="bg-[#c4b9b9] min-h-screen h-full  bg-opacity-75">
        <div class="flex pt-2 pr-2 justify-end w-full">
            <RouterLink to="/admin/dataTechnician/newTechnician">
                <button
                    class="flex items-center bg-blue-900 hover:bg-white text-white font-semibold hover:text-blue-900 py-2 px-4 duration-500 rounded-full mr-4 ">
                    <IconAdd class="mr-1 h-5 w-5"></IconAdd>
                    Tambah Teknisi Baru
                </button>
            </RouterLink>
        </div>
        <div class="bg-white m-4 shadow-lg rounded-lg">
            <div class=" justify-center w-full h-10 flex bg-[#084c61] rounded-t-lg">
                <div class="relative flex items-center">
                    <div class="absolute pl-3 p-1 py-2 ">
                        <IconFind class=" w-6 h-6 text-graydark" />
                    </div>
                    <input type="text" v-model="searchQuery" placeholder="Cari berdasarkan nama"
                        class="text-left ml-3  pl-8 text-sm flex flex-1 items-center text-black bg-blurwhite ring-inset ring-1 ring-lightdark hover:ring-graydark active:ring-graydark focus:ring-graydark focus:outline-none rounded-full p-1 px-3 duration-100 w-full md:w-64 mr-3 ">
                    </input>
                </div>
            </div>
            <table class="w-full table-fixed">
                <thead>
                    <tr class="">
                        <th class="text-center w-1/4 py-4 px-6 text-gray-600 font-bold uppercase">Nama</th>
                        <th class="text-center w-1/3 py-4 px-6 text-gray-600 font-bold uppercase">Alamat</th>
                        <th class="text-center w-1/2 py-4 px-6 text-gray-600 font-bold uppercase">Nomor Handphone</th>
                        <th class=" w-[37%] text-center text-gray-600 font-bold uppercase"></th>
                    </tr>
                </thead>
                <tbody class="bg-white">
                    <template v-if="dataTechnicians.length">
                        <tr v-for="dataTechnician in dataTechnicians" :key="dataTechnician.id">
                            <td class="text-center py-4 px-6 border-b border-gray-200">{{ dataTechnician.name }}</td>
                            <td class="text-center py-4 px-6 border-b border-gray-200">{{ dataTechnician.address }}</td>
                            <td class="text-center py-4 px-6 border-b border-gray-200 truncate">{{ dataTechnician.phone
                                }}
                            </td>
                            <td class="py-4 border-b border-gray-200">
                                <div class="flex mr-5 space-x-2">
                                    <button @click="updateTechnician(dataTechnician.id)"
                                        class=" border border-white bg-yellow-500 items-center text-white hover:text-yellow-500 hover:bg-white hover:border-yellow-500 duration-500 flex rounded-full p-1 space-x-1 px-3">
                                        <IconEdit class="w-5 h-5 rounded-full"></IconEdit>
                                        <span>Edit</span>
                                    </button>
                                    <button @click="showDetail(dataTechnician.id)"
                                        class=" border border-white bg-green-500 items-center text-white hover:text-green-500 hover:bg-white hover:border-green-500 duration-500 flex rounded-full p-1 space-x-1 px-3">
                                        <IconList class="w-7 h-5 rounded-full"></IconList>
                                        <span>History Pengerjaan</span>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </template>
                    <template v-else>
                        <tr>
                            <td colspan="6" class="uppercase text-center font-bold text-red-500 py-4">Data Teknisi tidak
                                ditemukan
                            </td>
                        </tr>
                    </template>
                    <div v-if="selectedId"
                        class="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-30 z-50">
                        <div class="bg-white shadow-lg rounded-xl p-6 w-full max-w-6xl">
                            <div class="flex pt-0 pb-2">
                                <button @click="closeModal"
                                    class="w-full px-2 py-1.5 capitalize flex justify-center text-white bg-red-500 border hover:border-red-500 hover:text-red-500 hover:bg-white rounded-md transition duration-300">
                                    <IconBack class="mr-2 w-5 h-5"></IconBack>
                                    Kembali
                                </button>
                            </div>
                            <div>
                                <div class="uppercase italic text-center font-bold text-xl tracking-wide pb-1">
                                    List History Pengerjaan
                                </div>
                                <table class="w-full table-auto">
                                    <thead>
                                        <tr>
                                            <th class="py-4 px-6 text-center text-gray-600 font-bold uppercase">Customer
                                            </th>
                                            <th class="py-4 px-6 text-center text-gray-600 font-bold uppercase">Merek
                                            </th>
                                            <th class="py-4 px-6 text-center text-gray-600 font-bold uppercase">Tipe
                                            </th>
                                            <th class="py-4 px-6 text-left text-gray-600 font-bold uppercase">Diagnosa
                                                Awal</th>
                                            <th class="py-4 px-6 text-center text-gray-600 font-bold uppercase">Tanggal
                                                Selesai</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <template v-if="services.length">
                                            <tr v-for="service in services" :key="service.id">
                                                <td class="capitalize text-center py-4 px-6 border-b border-gray-200">{{
                                                    service.nama_customer }}</td>
                                                <td class="uppercase text-center py-4 px-6 border-b border-gray-200">{{
                                                    service.merek }}</td>
                                                <td class="py-4 px-6 text-center border-b border-gray-200">{{
                                                    service.tipe }}</td>
                                                <td class="py-4 px-6 text-left border-b border-gray-200 break-words">{{
                                                    service.diagnosa_awal }}</td>
                                                <td class="text-center py-4 px-6 border-b border-gray-200">{{
                                                    format(service.tanggalKeluar) }}</td>
                                            </tr>
                                        </template>
                                        <template v-else>
                                            <tr>
                                                <td colspan="5"
                                                    class="uppercase text-center font-bold text-red-500 py-4">Data
                                                    service tidak ada</td>
                                            </tr>
                                        </template>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </tbody>
            </table>
        </div>
    </div>

</template>