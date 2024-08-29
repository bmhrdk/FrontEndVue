<script setup>
import '@vuepic/vue-datepicker/dist/main.css';
import IconBack from '@/components/icons/IconBack.vue';
import Notification from '@/components/Notification.vue';
import { ref, inject } from 'vue';
import api from '@/api';
import router from '@/router';

const adminId = inject('adminId');
const merek = ref('');
const tipe = ref('');
const stok = ref('');
const harga = ref('');


const notification = ref(null);

const newInventory = async () => {
    try {
        console.log(adminId._value)
        const updatedData = {
            adminId: adminId._value,
            merek: merek.value,
            tipe: tipe.value,
            stok: stok.value,
            harga: harga.value,
        };

        const tokenUser = localStorage.getItem('accessToken');
        const response = await api.request('post', '/api/newInventory', updatedData, tokenUser);
        console.log(response)
        if (response.message && !response.error) {
            console.log(response.message, "201")
            notification.value = {
                type: 'success',
                message: response.message,
            };
            setTimeout(() => {
                router.push('/admin/inventory')
            }, 2000);
        }
        else if (response.message && response.error) {
            console.log(response.message, "400")
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
    <Notification v-if="notification" :type="notification.type" :message="notification.message" />
    <div class="bg-[#c4b9b9] min-h-screen h-full  bg-opacity-75">
    <div class="flex justify-center">
        <div class="bg-white w-fit p-7 mt-40 ml-60 mr-60 rounded-lg">
            <div class="flex justify-center">
                <RouterLink to="/admin/inventory">
                    <button
                        class=" flex items-center outline outline-1 outline-[#FFC857] bg-[#FFC857] hover:bg-white text-white font-semibold hover:text-[#FFC857]  px-4 duration-500 rounded-full mt-2 h-fit ml-3 mr-4 mb-3">
                        <IconBack class="h-5 w-5 mr-2"></IconBack>
                        <span class="pt-0.5">Kembali</span>
                    </button>
                </RouterLink>
            </div>
            <form @submit.prevent="newInventory">
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
                        <label for="stok" class="font-medium">Stok:</label>
                        <input id="stok" type="number" v-model="stok"
                            class="p-2 px-3 w-80 flex rounded-lg bg-blurwhite ring-inset ring-1 ring-graydark focus:ring-graydark" />
                    </div>
                    <div class="space-y-2 mb-2">
                        <label for="harga" class="font-medium">Harga:</label>
                        <input id="harga" type="number" v-model="harga"
                            class="p-2 px-3 w-80 flex rounded-lg bg-blurwhite ring-inset ring-1 ring-graydark focus:ring-graydark" />
                    </div>
                </div>
                <div class="flex justify-center">
                    <button type="submit"
                        class="mt-8 text-sm flex items-center space-x-2 font-normal text-white bg-greenprimary rounded-md p-2 px-3 hover:bg-white hover:outline hover:outline-greenprimary hover:text-greenprimary transition-all duration-100">
                        <IconCheck class="mr-2" />
                        Tambah Sparepart Baru
                    </button>
                </div>
            </form>
        </div>
    </div>
    </div>
</template>