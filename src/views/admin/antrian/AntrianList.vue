<script setup>
import { ref, watch } from 'vue';
import api from '@/api';
import IconTrash from '@/components/icons/IconTrash.vue';
import IconFind from '@/components/icons/IconFind.vue';


const bookings = ref([]);
const searchQuery = ref('');
const notification = ref(null);
const modalVerification = ref(false);

async function getBookingAll() {
    try {
        const tokenUser = localStorage.getItem('accessToken');
        const response = await api.request('get', '/api/getAllBooking', null, tokenUser);
        // console.log(response.data)
        if (response.data) {
            bookings.value = response.data;
            console.log(bookings.value)
        }
    } catch (error) {
        console.error('Failed:', error);
    }
}
getBookingAll();

async function searchBooking(nomorId) {
    try {
        const tokenUser = localStorage.getItem('accessToken');
        const response = await api.request('get', `/api/searchBooking/${nomorId}`, null, tokenUser);
        console.log(response)
        if (response.data) {
            bookings.value = response.data;
        } else if (response.error) {
            bookings.value = [];
            // console.log(customers.value)
        }
    } catch (error) {
        console.error('Failed:', error);
    }
}

watch(searchQuery, (newQuery) => {
    if (newQuery === '') {
        getBookingAll();
    } else {
        searchBooking(newQuery);
    }
});

async function deleteOneBooking(nomorId) {
    try {
        const tokenUser = localStorage.getItem('accessToken');
        const response = await api.request('delete', `/api/deleteBooking/${nomorId}`, null, tokenUser);
        modalVerification.value = false;
        notification.value = {
            message: response.message,
        };
        getBookingAll();
        setTimeout(() => {
            notification.value = null;
        }, 2000);
    } catch (error) {
        console.error('Failed:', error);
        notification.value = {
            message: 'Gagal menghapus data..',
        };
        getBookingAll();
        setTimeout(() => {
            notification.value = null;
        }, 2000);
    }
}

const selectedDelete = ref(null);
const deleteBookingPopup = (bookingId) => {
    modalVerification.value = true;
    selectedDelete.value = bookingId;
}
</script>


<template>
    <div class="bg-white m-4 shadow-lg rounded-lg">
        <div class=" justify-center w-full h-10 flex bg-[#084c61] rounded-t-lg">
            <div class="relative flex items-center">
                <div class="absolute pl-3 p-1 py-2 ">
                    <IconFind class=" w-6 h-6 text-graydark" />
                </div>
                <input type="text" v-model="searchQuery" placeholder="Cari berdasarkan nomor antrian"
                    class="text-center pl-8 text-sm flex flex-1 items-center text-black bg-blurwhite ring-inset ring-1 ring-lightdark hover:ring-graydark active:ring-graydark focus:ring-graydark focus:outline-none rounded-full p-1 px-3 duration-100 w-full md:w-64 mr-3 ">
                </input>
            </div>
        </div>
        <table class="w-full table-fixed">
            <thead>
                <tr class="">
                    <th class="text-center w-1/4 py-4 px-6 text-gray-600 font-bold uppercase">Nama</th>
                    <th class="text-center w-1/3 py-4 px-6 text-gray-600 font-bold uppercase">Nomor HP</th>
                    <th class="text-center w-1/4 py-4 px-6 text-gray-600 font-bold uppercase">Merek</th>
                    <th class="text-center w-1/4 py-4 px-6 text-gray-600 font-bold uppercase">Tipe</th>
                    <th class="text-center w-1/2 py-4 px-6 text-gray-600 font-bold uppercase">Keluhan</th>
                    <th class="text-center w-1/2 py-4 px-6 text-gray-600 font-bold uppercase">Nomor Antrian</th>
                    <th class="w-1/4 px-0 text-center  text-gray-600 font-bold uppercase"></th>
                </tr>
            </thead>
            <tbody class="bg-white">
                <template v-if="bookings.length">
                    <tr v-for="booking in bookings" :key="booking.id">
                        <td class="text-center py-4 px-6 border-b border-gray-200">{{ booking.nama_customer }}</td>
                        <td class="text-center py-4 px-6 border-b border-gray-200">{{ booking.telepon }}</td>
                        <td class="text-center py-4 px-6 border-b border-gray-200 truncate">{{ booking.merek }}</td>
                        <td class="text-center py-4 px-6 border-b border-gray-200 truncate">{{ booking.tipe }}</td>
                        <td class="text-center py-4 px-6 border-b border-gray-200 truncate">{{ booking.keluhan }}</td>
                        <td class="text-center py-4 px-6 border-b border-gray-200 truncate">{{ booking.nomor_antrian }}
                        </td>
                        <td class="py-4 px-6 border-b border-gray-200">
                            <button @click="deleteBookingPopup(booking.id)"
                                class=" border border-white bg-red-500 text-white hover:text-red-500 hover:bg-white hover:border-red-500 duration-500 flex rounded-full p-1 space-x-1 px-3">
                                <IconTrash class="w-5 h-5"></IconTrash>
                                <span>Delete</span>
                            </button>
                        </td>
                    </tr>
                </template>
                <template v-else>
                    <tr>
                        <td colspan="6" class="uppercase text-center font-bold text-red-500 py-4">Tidak Ada Antrian
                        </td>
                    </tr>
                </template>
                <div v-if="modalVerification"
                    class="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-30 z-50">
                    <div class="bg-white shadow-lg rounded-lg p-5">
                        <div class="flex items-center font-medium text-lg">
                            Apakah anda yakin ingin menghapus antrian ini?
                        </div>
                        <div class="mt-3 flex space-x-3 justify-center">
                            <button @click="modalVerification = false"
                                class="rounded-lg w-32 text-white px-3 p-2 bg-green-500 hover:bg-white hover:text-green-500 border hover:border-green-500 transition-all duration-100">
                                BATAL
                            </button>
                            <button @click="deleteOneBooking(selectedDelete)"
                                class="rounded-lg w-32 text-white px-3 p-2 bg-red-500 hover:bg-white hover:text-red-500 border hover:border-red-500  transition-all duration-100">
                                IYA
                            </button>
                        </div>
                    </div>
                </div>
                <!-- Add more rows here -->
            </tbody>
        </table>
    </div>

</template>