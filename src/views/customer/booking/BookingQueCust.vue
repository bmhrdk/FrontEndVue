<script setup>
import IconBack from '@/components/icons/IconBack.vue';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import { ref, inject, onMounted } from 'vue';
import api from '@/api';
import router from '@/router';

const customerId = inject('customerId');
const merek = ref('');
const tipe = ref('');
const keluhan = ref('');
const showBookingForm = ref(true);
const nomorAntrian = ref('');

const notification = ref(null);

const numberBooking = async () => {
    try {
        const tokenUser = localStorage.getItem('accessToken');
        const getId = localStorage.getItem('customerId');
        const response = await api.request('get', `/api/numberBooking/${getId}`, null, tokenUser);
        if (response.nomor_antrian) {
            nomorAntrian.value = response.nomor_antrian;
            showBookingForm.value = false;
            
        } else if (response.error){
            showBookingForm.value = true;
            
        }
    } catch (error) {
        console.error('Failed to check existing booking:', error);
    }
};


numberBooking();

const newBooking = async () => {
    try {
        const updatedData = {
            customerId: customerId._value,
            merek: merek.value,
            tipe: tipe.value,
            keluhan: keluhan.value,
        };

        const tokenUser = localStorage.getItem('accessToken');
        const response = await api.request('post', '/api/newBooking', updatedData, tokenUser);
        console.log(response);
        if (response.message && !response.error) {
            console.log(response.message, "201");
            nomorAntrian.value = response.nomor_antrian;
            notification.value = {
                type: 'success',
                message: response.message,
            };
            showBookingForm.value = false; // Tampilkan modal
            setTimeout(() => {
            }, 2000);
        } else if (response.message && response.error) {
            console.log(response.message, "400");
            notification.value = {
                type: 'failed',
                message: response.message,
            };
        }
        setTimeout(() => {
            notification.value = null;
        }, 2000);
    } catch (error) {
        console.error('Failed:', error);
    }
}

</script>

<template>
    <div class="flex justify-center">
        <div v-if="showBookingForm" class="bg-white w-fit p-7 mt-40 ml-60 mr-60 rounded-lg">
            <div class="flex justify-center">
                <h1 class="text-3xl py-5 text-center font-bold">
                    Form Booking Antrian
                </h1>
            </div>
            <form @submit.prevent="newBooking">
                <div class="text-sm items-center">
                    <div class="space-y-2 mb-2">
                        <label for="merek" class="font-medium">Merek:</label>
                        <input id="merek" type="text" v-model="merek"
                            class="p-2 px-4 w-80 flex rounded-lg bg-blurwhite ring-inset ring-1 ring-graydark focus:ring-graydark" />
                    </div>
                    <div class="space-y-2 mb-2">
                        <label for="tipe" class="font-medium">Tipe:</label>
                        <input id="tipe" type="text" v-model="tipe"
                            class="p-2 px-3 w-80 flex rounded-lg bg-blurwhite ring-inset ring-1 ring-graydark focus:ring-graydark" />
                    </div>
                    <div class="space-y-2 mb-2">
                        <label for="keluhan" class="font-medium">Keluhan</label>
                        <input id="keluhan" type="text" v-model="keluhan"
                            class="p-2 px-3 w-80 flex rounded-lg bg-blurwhite ring-inset ring-1 ring-graydark focus:ring-graydark" />
                    </div>
                </div>
                <div class="flex justify-center">
                    <button type="submit"
                        class="mt-3 text-sm flex items-center space-x-2 font-normal text-white bg-greenprimary rounded-md p-2 px-3 hover:bg-white hover:outline hover:outline-greenprimary hover:text-greenprimary transition-all duration-100">
                        <IconCheck class="mr-2" />
                        Daftar Antrian
                    </button>
                </div>
            </form>
        </div>
        <div v-else class="bg-white w-fit p-7 mt-40 ml-60 mr-60 rounded-lg">
            <div class="flex justify-center">
                <h1 class="text-3xl py-5 text-center font-bold">
                    Booking Sukses
                </h1>
            </div>
            <div class="text-sm items-center text-center">
                <p class="text-lg">Nomor Antrian Anda:</p> 
                    <div class="mb-10 mt-10 font-bold text-9xl">{{ nomorAntrian }}</div>
                    <div class="mb-10 mt-10 font-bold border-b border-text-3xl">Hubungi Admin Jika Ingin Membatalkan Nomor Antrian</div>
                <RouterLink to="/customer/status">
                    <button class="mt-3 text-sm space-x-2 font-normal text-white bg-greenprimary rounded-md p-2 px-3 hover:bg-white hover:outline hover:outline-greenprimary hover:text-greenprimary transition-all duration-100">
                        Kembali
                    </button>
                </RouterLink>    
            </div>
        </div>
    </div>
</template>