<script setup>
import { inject, ref, watch } from 'vue';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import IconBack from '@/components/icons/IconBack.vue';
import IconAdd from '@/components/icons/IconAdd.vue';
import IconDelete from '@/components/icons/IconDelete.vue';
import Notification from '@/components/Notification.vue';
import api from '@/api';
import router from '@/router';

// const adminId = inject('adminId');
const technicianId = inject('technicianId');
const customerId = ref('');
const merek = ref('');
const tipe = ref('');
const diagnosaAwal = ref('');
// const estimasi = ref(new Date());
const listCustomer = ref(false);
const customerName = ref('');
const searchCustomer = ref('');
const listTechnician = ref(false);
const technicianName = ref('');

// const hover1 = ref(false);


const notification = ref(null);

const getCustomerName = ref([]);

async function listCustomerName() {
    try {
        const tokenUser = localStorage.getItem('accessToken');
        const response = await api.request('get', '/api/getCustomerName', null, tokenUser);
        // console.log(response.data)
        if (response.data) {
            getCustomerName.value = response.data;
        }
    } catch (error) {
        console.error('Failed:', error);
    }
}

async function getDataCustomerSearch(name) {
    try {
        const tokenUser = localStorage.getItem('accessToken');
        const response = await api.request('get', `/api/filterCustomer/${name}`, null, tokenUser);
        if (response.data) {
            getCustomerName.value = response.data;
        } else if (response.error) {
            getCustomerName.value = [];
        }
    } catch (error) {
        console.error('Failed:', error);
    }
}



listCustomerName()
watch(searchCustomer, (newQuery) => {
    if (newQuery === '') {
        listCustomerName();
    } else {
        getDataCustomerSearch(newQuery);
    }
});

function selectCustomer(data) {
    customerId.value = data.id;
    customerName.value = data.name;
    listCustomer.value = false; // tutup dropdown
}


const newService = async () => {
    try {
        // console.log(adminId._value)
        const updatedData = {
            technicianId: technicianId.value,
            customerId: customerId.value,
            merek: merek.value,
            tipe: tipe.value,
            diagnosaAwal: diagnosaAwal.value,
            // kerusakan: kerusakanList.value,
            // estimasi: estimasi.value,

        };

        const tokenUser = localStorage.getItem('accessToken');
        const response = await api.request('post', '/api/newService', updatedData, tokenUser);
        console.log(response)
        if (response.message && !response.error) {
            console.log(response.message, "201")
            notification.value = {
                type: 'success',
                message: response.message,
            };
            setTimeout(() => {
                router.push('/admin/service')
            }, 2000);
        }
        else if (response.message && response.error) {
            console.log(response.message, "400")
            notification.value = {
                type: 'failed',
                message: response.message,
                variant: 'orangetip',
            };
        }
        setTimeout(() => {
            notification.value = null;
        }, 2000);
    } catch (error) {
        console.error('Failed:', error);
    }
}

const getTechnicianName = ref([]);

async function listTechnicianName() {
    try {
        const tokenUser = localStorage.getItem('accessToken');
        const response = await api.request('get', '/api/getTechnicianName', null, tokenUser);
        // console.log(response.data)
        if (response.data) {
            getTechnicianName.value = response.data;
        }
    } catch (error) {
        console.error('Failed:', error);
    }
}
listTechnicianName()

function selectTechnician(data) {
    technicianId.value = data.id;
    technicianName.value = data.name;
    listTechnician.value = false; // tutup dropdown
}


function addCustomer() {
   router.push('/admin/dataCustomer/newCustomer')
}






const date = ref();
</script>

<template>
    <Notification v-if="notification" :type="notification.type" :message="notification.message" />
    <div class=" bg-[#c4b9b9] min-h-screen h-full  bg-opacity-75">
        <div class="flex justify-center space-x-10">
            <div class="bg-white px-20 my-20 mx-20 rounded-lg">
                <RouterLink to="/admin/service">
                    <button
                        class=" flex items-center outline outline-1 outline-[#FFC857] bg-[#FFC857] hover:bg-white text-white font-semibold hover:text-[#FFC857]  px-4 duration-500 rounded-full mt-2 h-fit ml-3 mr-4 mb-3">
                        <IconBack class="h-5 w-5 mr-2"></IconBack>
                        <span class="pt-0.5">Kembali</span>
                    </button>
                </RouterLink>
                <form @submit.prevent="newService">
                    <div class="flex justify-center">

                        <div class=" text-sm grid items-center md:grid-cols-1 gap-y-5 md:gap-x-10 gap-x-12">
                            <!-- Customer -->
                            <div class="font-bold text-2xl uppercase">formulir service</div>
                            <div class="space-y-2 ">
                                <div class="flex">
                                    <label for="name" class="font-medium">Nama Customer:</label>
                                    <!-- <button
                                        @click.prevent="addCustomer"
                                        class="ml-2 text-sm flex items-center space-x-2 font-normal text-white bg-greenprimary rounded-full p-1 hover:bg-white hover:outline hover:outline-greenprimary hover:text-greenprimary transition-all duration-100">
                                        <IconAdd class="" />
                                    </button> -->
                                </div>
                                <button id="name" @click.prevent="listCustomer = !listCustomer"
                                    class="capitalize p-2 px-3 w-full md:w-80 flex rounded-lg bg-blurwhite ring-inset ring-1 ring-graydark focus:ring-graydark relative">
                                    <span v-if="customerName">
                                        {{ customerName }}
                                    </span>
                                    <span v-else class="text-graydark">
                                        Pilih Customer
                                    </span>
                                    <IconDropdown
                                        class="absolute right-2 top-1/2 transform -translate-y-1/2 w-5 h-5 text-graydark" />
                                </button>
                                <div v-if="listCustomer"
                                    class="capitalize z-50 border-cyan-600 bg-transparent absolute md:w-fit w-full mt-2 drop-shadow-lg rounded-md ring-1 ring-black p-2">
                                    <div class="relative flex items-center">
                                        <div class="absolute p-1 py-2">
                                            <IconSearch class="ml-1 w-4 h-4 text-white" />
                                        </div>
                                        <input type="text" v-model="searchCustomer" placeholder="Cari nama...."
                                            class="pl-7 flex flex-1 text-xs items-center text-black bg-blurwhite ring-inset ring-1 ring-lightdark hover:ring-graydark active:ring-graydark focus:ring-graydark focus:outline-none rounded-md p-2 px-3 transition duration-100 w-full md:w-80 placeholder:italic">
                                    </div>
                                    <div class="mt-2 overflow-y-auto h-32">
                                        <template v-if="getCustomerName.length">
                                            <div v-for="data in getCustomerName" :key="data.id"
                                                @click="selectCustomer(data)">
                                                <div
                                                    class="cursor-pointer rounded-md text-black font-semibold pl-1 my-1 hover:bg-slate-100 hover:bg-opacity-50 focus:bg-slate-100">
                                                    &#183; {{ data.name }}
                                                </div>
                                            </div>
                                        </template>
                                        <template v-else>
                                            <div class="text-center italic my-1">Data tidak tersedia..</div>
                                        </template>
                                    </div>
                                </div>
                            </div>

                            <!-- Merek -->
                            <div class="space-y-2 ">
                                <label for="merek" class="font-medium">Merek:</label>
                                <input id="merek" type="text" v-model="merek"
                                    class="uppercase p-2 px-3 w-full md:w-80 flex rounded-lg bg-blurwhite ring-inset ring-1 ring-graydark focus:ring-graydark" />
                            </div>

                            <!-- Tipe -->
                            <div class="space-y-2 ">
                                <label for="tipe" class="font-medium">Tipe:</label>
                                <input id="tipe" type="text" v-model="tipe"
                                    class="p-2 px-3 w-full md:w-80 flex rounded-lg bg-blurwhite ring-inset ring-1 ring-graydark focus:ring-graydark" />
                            </div>

                            <!-- Diagnosa Awal -->
                            <div class="space-y-2 ">
                                <label for="diagnosa" class="font-medium">Diagnosa Awal:</label>
                                <textarea id="diagnosa" type="text" v-model="diagnosaAwal"
                                    class=" h-40 p-2 px-3 w-full md:w-80 flex rounded-lg bg-blurwhite ring-inset ring-1 ring-graydark focus:ring-graydark"></textarea>
                            </div>

                            <!-- <div class="space-y-2 ">
                                <label for="name" class="font-medium">Pilih Teknisi:</label>
                                <button id="name" @click.prevent="listTechnician = !listTechnician"
                                    class="capitalize p-2 px-3 w-full md:w-80 flex rounded-lg bg-blurwhite ring-inset ring-1 ring-graydark focus:ring-graydark relative">
                                    <span v-if="technicianName">
                                        {{ technicianName }}
                                    </span>
                                    <span v-else class="text-graydark">
                                        Pilih Teknisi
                                    </span>
                                    <IconDropdown
                                        class="absolute right-2 top-1/2 transform -translate-y-1/2 w-5 h-5 text-graydark" />
                                </button>
                                <div v-if="listTechnician"
                                    class="capitalize z-50 border-cyan-600 bg-transparent absolute w-80 mt-2 drop-shadow-lg rounded-md ring-1 ring-black p-2">
                                    <div class="mt-2 overflow-y-auto h-24">
                                        <template v-if="getTechnicianName.length">
                                            <div v-for="data in getTechnicianName" :key="data.id"
                                                @click="selectTechnician(data)">
                                                <div
                                                    class="cursor-pointer rounded-md text-black font-semibold pl-1 my-1 hover:bg-slate-100 hover:bg-opacity-50 focus:bg-slate-100">
                                                    &#183; {{ data.name }}
                                                </div>
                                            </div>
                                        </template>
                                        <template v-else>
                                            <div class="text-center italic my-1">Data tidak tersedia..</div>
                                        </template>
                                    </div>
                                </div>
                            </div> -->

                            <!-- Kerusakan -->
                            <!-- <div class="space-y-2">
                                <div class="space-y-2">
                                    <div class="flex items-center">
                                        <label for="kerusakan" class="font-medium">Kerusakan:</label>
                                        <button v-if="kerusakanList.length < 5" @mouseover="hover1 = true"
                                            @mouseleave="hover1 = false" @click.prevent="addKerusakan"
                                            class="my-1 ml-2 text-sm flex items-center font-normal text-white bg-greenprimary rounded-full p-2 transition-all duration-500 ease-in-out overflow-hidden"
                                            :class="{
                                                'w-8 h-8 px-2 justify-center': !hover1,  // Membuat button berbentuk bulat mengikuti ukuran icon
                                                'w-52 h-8 px-3 justify-start': hover1  // Menambah padding dan lebar saat hover untuk menampilkan teks
                                            }">
                                            <div class="flex items-center transition-all duration-500 ease-in-out">
                                                <IconAdd class="transition-transform duration-500 ease-in-out" />
                                                <span
                                                    class="mx-2 flex-nowrap whitespace-nowrap text-center transition-opacity duration-500 ease-in-out"
                                                    :class="{
                                                        'opacity-100': hover1,
                                                        'opacity-0': !hover1,
                                                        'hidden': !hover1
                                                    }">
                                                    Tambah Kerusakan Baru
                                                </span>
                                            </div>
                                        </button>
                                    </div>
                                </div>
                                <div v-for="(kerusakan, index) in kerusakanList" :key="index"
                                    class="flex items-center space-x-2">
                                    <input :id="'kerusakan-' + index" type="text" v-model="kerusakanList[index]"
                                        class="capitalize p-2 px-3 w-full md:w-80 flex rounded-lg bg-blurwhite ring-inset ring-1 ring-graydark focus:ring-graydark" />
                                    <button v-if="index > 0" @click="removeKerusakan(index)"
                                        class="text-sm flex items-center space-x-2 font-normal text-white bg-red-500 rounded-full p-1 hover:bg-white hover:outline hover:outline-red-500 hover:text-red-500 transition-all duration-100">
                                        <IconDelete class="" />
                                    </button>
                                </div>
                            </div> -->

                            <!-- Estimasi -->
                            <!-- <div class="p-0.5 w-full md:w-80 space-y-2 ">
                                <label for="estimasi" class="font-medium">Estimasi:</label>
                                <VueDatePicker auto-apply :min-date="new Date()"
                                    class="rounded-[4px] bg-blurwhite ring-1 ring-graydark focus:ring-graydark"
                                    v-model="estimasi">
                                </VueDatePicker>
                            </div> -->

                            <!-- Biaya Perawatan -->
                            <!-- <div class="space-y-2">
                                <label for="biaya" class="font-medium">Biaya Perawatan:</label>
                                <input id="biaya" type="text" v-model="biaya"
                                    class="p-2 px-3 w-full md:w-80 flex rounded-lg bg-blurwhite ring-inset ring-1 ring-graydark focus:ring-graydark" />
                            </div> -->
                        </div>
                    </div>

                    <div class="flex justify-center">
                        <button type="submit"
                            class="mb-2 mt-8 text-sm flex items-center space-x-2 font-normal text-white bg-greenprimary rounded-md p-2 px-3 hover:bg-white hover:outline hover:outline-greenprimary hover:text-greenprimary transition-all duration-100">
                            <IconCheck class="mr-2" />
                            Buat Servis Baru
                        </button>
                    </div>
                    <!-- <button @mouseover="hover1 = true" @mouseleave="hover1 = false"
                        class="transition-all duration-300 ease-in-out bg-blue-500 text-white py-2 rounded flex items-center"
                        :class="hover1 ? 'min-w-[120px] max-w-[120px] px-4' : 'min-w-[40px] max-w-[40px] px-2'">
                        <span class="flex-1 text-center">
                            <span v-if="hover1">Add Customer</span>
                            <span v-else>+</span>
                        </span>
                    </button> -->
                    <!-- <div class="flex">
                        <label for="kerusakan" class="font-medium">Kerusakan:</label>
                        <button v-if="kerusakanList.length < 5" @click.prevent="addKerusakan"
                            class="ml-2 text-sm flex items-center space-x-2 font-normal text-white bg-greenprimary rounded-full p-1 hover:bg-white hover:outline hover:outline-greenprimary hover:text-greenprimary transition-all duration-100">
                            <IconAdd class="" />
                        </button>
                    </div> -->
                </form>
            </div>
        </div>
    </div>
</template>