<script setup>
import IconEdit from '@/components/icons/IconEdit.vue';
import IconFind from '@/components/icons/IconFind.vue';
import IconInfo from '@/components/icons/IconInfo.vue';
import IconPDF from '@/components/icons/IconPDF.vue';
import IconUp from '@/components/icons/IconUp.vue';

import { useRouter } from 'vue-router';
import { ref, watch, computed } from 'vue';
import api from '@/api';
import IconBack from '@/components/icons/IconBack.vue';

// const props = defineProps({
//     id: String,
// });
const router = useRouter();
const filterDropdown = ref(false);
const checkedFilter = ref([]);

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
        const response = await api.request('get', `/api/searchBrand/${name}`, null, tokenUser);
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

const checkOnlyOne = (value) => {
    if (checkedFilter.value.includes(value)) {
        checkedFilter.value = [value];
    }
};

function format(tanggal) {
    if (!tanggal) return '-';
    const date = new Date(tanggal);
    return date.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

const detailService = ref(null);
const getDataById = async (id) => {
    try {
        const tokenUser = localStorage.getItem('accessToken');
        const response = await api.request('get', `/api/getOneService/${id}`, null, tokenUser);
        detailService.value = response;
        console.log(detailService.value);
    } catch (error) {
        console.error('Failed:', error);
    }
};

const selectedId = ref(null);
const showDetail = async (id) => {
    selectedId.value = id;
    // console.log(selectedId.value)
    if (selectedId.value) {
        try {
            await getDataById(id);
        } catch (error) {
            console.error('Failed to fetch details:', error);
        }
    }
};

const totalBiayaKerusakan = computed(() => {
    if (detailService.value && detailService.value.detail_service && detailService.value.detail_service.biayaKerusakan) {
        return detailService.value.detail_service.biayaKerusakan.reduce((total, biaya) => {
            return total + Number(biaya);
        }, 0);
    }
    return 0;
});

const totalBiayaSparepart = computed(() => {
    if (detailService.value && detailService.value.inventory) {
        return detailService.value.inventory.reduce((total, sparepart) => {
            const hargaTotalSparepart = parseInt(sparepart.harga_satuan, 10) * parseInt(sparepart.jumlah_sparepart, 10);
            return total + hargaTotalSparepart;
        }, 0);
    }
    return 0;
});

const totalHarga = computed(() => {
    return totalBiayaKerusakan.value + totalBiayaSparepart.value;
});

const formatCurrency = (value) => {
    const formatter = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    });
    return formatter.format(value);
};

const notaPDF = async () => {
    try {
        // console.log(props.id)
        const tokenUser = localStorage.getItem('accessToken');
        const response = await api.request('get', `/api/downloadNotaPDF/${selectedId.value}`, null, tokenUser, {
            responseType: 'blob', // Mengatur respons untuk menerima blob
    //         headers: {
    //     'Access-Control-Allow-Origin': '*',
    // }
        });

        if (response.data) {
            // Membuat URL untuk file PDF
            const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
            // Membuat elemen <a> dan mengkliknya untuk memulai download
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'nota.pdf'); // Nama file PDF yang akan diunduh
            document.body.appendChild(link);
            link.click();
            link.remove();
            // Membersihkan URL object
            window.URL.revokeObjectURL(url);
        }
    } catch (error) {
        console.error('Failed:', error);
    }
}

function toggleDropdown() {
    filterDropdown.value = !filterDropdown.value;
}


</script>


<template>
    <div class="bg-white m-4 shadow-lg rounded-lg">
        <div class=" justify-between w-full h-10 flex bg-[#084c61] rounded-t-lg">
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
                            <input type="checkbox" id="sedangDikerjakan" value="Sedang Dikerjakan" v-model="checkedFilter"
                                @change="checkOnlyOne('Sedang Dikerjakan')" />
                            <label for="pengerjaan" class="bg-orange-500 text-white py-1 px-2 rounded-full text-xs">
                                Sedang Dikerjakan</label>
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
                    <IconFind class=" w-6 h-6 text-graydark" />
                </div>
                <input type="text" v-model="searchQuery" placeholder="Cari berdasarkan nama"
                    class="text-center pl-8 text-sm flex flex-1 items-center text-black bg-blurwhite ring-inset ring-1 ring-lightdark hover:ring-graydark active:ring-graydark focus:ring-graydark focus:outline-none rounded-full p-1 px-3 duration-100 w-full md:w-64 mr-3 ">
                </input>
            </div>
        </div>
        <div class="bg-white p-1 rounded-full">
            <table class="w-full table-fixed">
                <thead>
                    <tr class="">
                        <th class="w-1/4 py-4 px-6 text-center text-gray-600 font-bold uppercase">Merek</th>
                        <th class="w-1/3 py-4 px-6 text-center text-gray-600 font-bold uppercase">Tipe</th>
                        <th class="text-center w-1/2 py-4 px-6 text-gray-600 font-bold uppercase">Estimasi Selesai</th>
                        <th class=" w-1/2 py-4 px-6 text-center text-gray-600 font-bold uppercase">Status</th>
                        <th class="w-1/4 py-4 text-center text-gray-600 font-bold uppercase"></th>
                    </tr>
                </thead>
                <tbody class="bg-white">
                    <template v-if="services.length">
                        <tr v-for="service in services" :key="service.id">
                            <td class="uppercase text-center  py-4 px-6 border-b border-gray-200">{{ service.merek }}
                            </td>
                            <td class="text-center py-4 px-6 border-b border-gray-200">{{ service.tipe }}</td>
                            <td class="text-center py-4 px-6 border-b border-gray-200 truncate"> {{ detailService &&
                                detailService.detail_service && detailService.detail_service.estimasi
                                ? format(detailService.detail_service.estimasi)
                                : 'Belum Diketahui'
                                }}
                            </td>
                            <td class="text-center py-4 border-b border-gray-200">
                                <span v-if="service.status === 'Selesai'"
                                    class="bg-green-500 text-white py-1 px-2 rounded-full text-xs"> Selesai </span>
                                <span v-else-if="service.status === 'Diproses' || service.status === 'Pengerjaan Selesai' "
                                    class="bg-orange-500 text-white py-1 px-2 rounded-full text-xs"> Sedang Dikerjakan </span>
                                <span v-else-if="service.status === 'Menunggu Pembayaran'"
                                    class="bg-red-500 text-white py-1 px-2 rounded-full text-xs"> Menunggu Pembayaran
                                </span>
                            </td>
                            <td class="py-4 px-6 border-b border-gray-200">
                                <button @click="showDetail(service.id)"
                                    class=" border border-white bg-yellow-500 items-center text-white hover:text-yellow-500 hover:bg-white hover:border-yellow-500 duration-500 flex rounded-full p-1 space-x-1 px-3">
                                    <IconInfo class="w-5 h-5 rounded-full"></IconInfo>
                                    <span>Details</span>
                                </button>
                            </td>
                        </tr>
                        <!-- Add more rows here -->
                    </template>
                    <template v-else>
                        <tr>
                            <td colspan="6" class="uppercase text-center font-bold text-red-500 py-4">Data service tidak
                                ada</td>
                        </tr>
                    </template>
                    <div v-if="selectedId"
                        class="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-30 z-50">
                        <div class="bg-white shadow-lg rounded-xl p-6">
                            <div class=" flex pt-0 pb-2">
                                <button @click="selectedId = null"
                                    class=" w-full px-2 py-1.5 capitalize flex justify-center text-white bg-red-500 border hover:border-red-500 hover:text-red-500 hover:bg-white rounded-md transition duration-300 ">
                                    <IconBack class="mr-2 w-5 h-5"></IconBack>
                                    Kembali
                                </button>
                            </div>
                            <div v-if="detailService">
                                <div class="uppercase italic text-center font-bold text-xl tracking-wide pb-1">
                                    Rincian Service
                                </div>
                                <div class="border-t-2 border-red-500 pt-6">
                                    <div class="grid grid-cols-2 gap-4">
                                        <div class="space-y-2">
                                            <div class="font-semibold">
                                                Merek:
                                            </div>
                                            <div class="capitalize">
                                                {{ detailService.merek }}
                                            </div>
                                        </div>
                                        <div class="space-y-2">
                                            <div class="font-semibold">
                                                Tipe:
                                            </div>
                                            <div class="uppercase">
                                                {{ detailService.tipe }}
                                            </div>
                                        </div>

                                        <!-- Border for every two columns -->
                                        <div class="col-span-2 border-t border-red-500 "></div>

                                        <div class="space-y-2">
                                            <div class="font-semibold">
                                                Status:
                                            </div>
                                            <div class="capitalize">
                                                {{ detailService.status }}
                                            </div>
                                        </div>
                                        <div class="space-y-2">
                                            <div class="font-semibold">
                                                Kerusakan & Perbaikan:
                                            </div>
                                            <div class="italic"
                                                v-if="detailService.detail_service.kerusakan && detailService.detail_service.kerusakan.length">
                                                <ul>
                                                    <li v-for="(item, index) in detailService.detail_service.kerusakan"
                                                        :key="index">
                                                        {{ item }}
                                                    </li>
                                                </ul>
                                            </div>
                                            <div v-else>
                                                Tidak ada kerusakan yang dilaporkan
                                            </div>
                                        </div>

                                        <!-- Border for every two columns -->
                                        <div class="col-span-2 border-t border-red-500 my-0"></div>

                                        <div class="space-y-2">
                                            <div class="font-semibold">
                                                Estimasi:
                                            </div>
                                            <div class="">
                                                {{ detailService && detailService.detail_service &&
                                                    detailService.detail_service.estimasi
                                                    ? format(detailService.detail_service.estimasi)
                                                    : 'Belum Diketahui'
                                                }}
                                            </div>
                                        </div>
                                        <div class="space-y-2">
                                            <div class="font-semibold">
                                                Tambahan Sparepart:
                                            </div>
                                            <div v-if="detailService.inventory && detailService.inventory.length">
                                                <ul>
                                                    <li v-for="(item, index) in detailService.inventory" :key="index">
                                                        <span class="uppercase">{{ item.merek_sparepart }}</span> - {{
                                                            item.tipe_sparepart
                                                        }} (Jumlah:
                                                        {{ item.jumlah_sparepart }})
                                                    </li>
                                                </ul>
                                            </div>
                                            <div v-else>
                                                Tidak ada sparepart tambahan
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-span-2 border-t border-red-500 mb-3 mt-1"></div>
                                    <div class="flex justify-between">
                                        <div class="font-semibold">
                                            Biaya Kerusakan:
                                        </div>
                                        <div class="ml-auto w-[150px] text-left">
                                            {{ formatCurrency(totalBiayaKerusakan) }}
                                        </div>
                                    </div>
                                    <div class="col-span-2"></div>
                                    <div class="flex justify-between">
                                        <div class="font-semibold">
                                            Biaya Sparepart:
                                        </div>
                                        <div class="ml-auto w-[150px] text-left">
                                            {{ formatCurrency(totalBiayaSparepart) }}
                                        </div>
                                    </div>
                                    <div class="col-span-2 border-t border-red-500 mb-3 mt-1"></div>
                                    <div class="flex justify-between">
                                        <div class="font-semibold">
                                            Total Harga:
                                        </div>
                                        <div class="ml-auto w-[150px] text-left">
                                            {{ formatCurrency(totalHarga) }}
                                        </div>
                                    </div>
                                    <div class ="border-t-2 border-red-500 pt-6 mt-2" ></div>
                                    <button @click="notaPDF" v-if="detailService.status === 'Selesai' || detailService.status === 'Menunggu Pembayaran' "
                                        class="w-full px-2 py-1.5 capitalize flex justify-center font-normal text-white bg-greenprimary rounded-md p-2 hover:bg-white hover:outline hover:outline-greenprimary hover:text-greenprimary transition-all duration-300">
                                        <IconPDF class="w-5 h-5 mr-2 " />
                                        Download PDF
                                    </button>

                                </div>
                            </div>
                        </div>
                    </div>
                </tbody>
            </table>
        </div>
    </div>

</template>