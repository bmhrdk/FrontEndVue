<script setup>
import IconEdit from '@/components/icons/IconEdit.vue';
import IconAdd from '@/components/icons/IconAdd.vue';
import IconTrash from '@/components/icons/IconTrash.vue';
import IconFind from '@/components/icons/IconFind.vue';
import { useRouter } from 'vue-router';
import { ref, watch } from 'vue';
import api from '@/api';


const router = useRouter();
const notification = ref(null);
const dataCustomers = ref([]);
const searchQuery = ref('');
const modalVerification = ref(false);


async function getAllCustomer() {
    try {
        const tokenUser = localStorage.getItem('accessToken');
        const response = await api.request('get', '/api/getCustomerName', null, tokenUser);
        // console.log(response.data)
        if (response.data) {
            dataCustomers.value = response.data;
            console.log(dataCustomers.value)
        }
    } catch (error) {
        console.error('Failed:', error);
    }
}

getAllCustomer();

async function searchCustomer(name) {
    try {
        const tokenUser = localStorage.getItem('accessToken');
        const response = await api.request('get', `/api/searchCustomer/${name}`, null, tokenUser);
        console.log(response)
        if (response.data) {
            dataCustomers.value = response.data;
        } else if (response.error) {
            dataCustomers.value = [];
            // console.log(customers.value)
        }
    } catch (error) {
        console.error('Failed:', error);
    }
}

async function deleteCustomer(id) {
    try {
        const tokenUser = localStorage.getItem('accessToken');
        const response = await api.request('delete', `/api/deleteCustomer/${id}`, null, tokenUser);
        modalVerification.value = false;
        notification.value = {
            message: response.message,
        };
        getAllCustomer();
        setTimeout(() => {
            notification.value = null;
        }, 2000);
    } catch (error) {
        console.error('Failed:', error);
        notification.value = {
            message: 'Gagal menghapus data..',
        };
        getAllCustomer();
        setTimeout(() => {
            notification.value = null;
        }, 2000);
    }
}

const selectedDelete = ref(null);
const deleteCustomerPopup = (customerId) => {
    modalVerification.value = true;
    selectedDelete.value = customerId;
};

watch(searchQuery, (newQuery) => {
    if (newQuery === '') {
        getAllCustomer();
    } else {
        searchCustomer(newQuery);
    }
});

const updateCustomer = (customerId) => {
    const id = customerId;
    router.push({ name: 'editCustomer', params: { id } })
}

</script>


<template>
    <div class="bg-[#c4b9b9] min-h-screen h-full  bg-opacity-75">
        <div class="flex pt-2 pr-2 justify-end w-full">
            <RouterLink to="/admin/dataCustomer/newCustomer">
                <button
                    class="flex items-center bg-blue-900 hover:bg-white text-white font-semibold hover:text-blue-900 py-2 px-4 duration-500 rounded-full mr-4 ">
                    <IconAdd class="mr-1 h-5 w-5"></IconAdd>
                    Tambah Customer Baru
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
                        <th class="w-1/4 text-center text-gray-600 font-bold uppercase"></th>
                    </tr>
                </thead>
                <tbody class="bg-white">
                    <template v-if="dataCustomers.length">
                        <tr v-for="dataCustomer in dataCustomers" :key="dataCustomer.id">
                            <td class="text-center py-4 px-6 border-b border-gray-200">{{ dataCustomer.name }}</td>
                            <td class="text-center py-4 px-6 border-b border-gray-200">{{ dataCustomer.address }}</td>
                            <td class="text-center py-4 px-6 border-b border-gray-200 truncate">{{ dataCustomer.phone }}
                            </td>
                            <td class="py-4 px-6 border-b border-gray-200">
                                <div class="flex space-x-2">
                                    <button @click="updateCustomer(dataCustomer.id)"
                                        class=" border border-white bg-yellow-500 items-center text-white hover:text-yellow-500 hover:bg-white hover:border-yellow-500 duration-500 flex rounded-full p-1 space-x-1 px-3">
                                        <IconEdit class="w-5 h-5 rounded-full"></IconEdit>
                                        <span>Edit</span>
                                    </button>
                                    <button @click="deleteCustomerPopup(dataCustomer.id)"
                                        class=" border border-white bg-red-500 items-center text-white hover:text-red-500 hover:bg-white hover:border-red-500 duration-500 flex rounded-full p-1 space-x-1 px-3">
                                        <IconTrash class="w-7 h-5 rounded-full"></IconTrash>
                                        <span>Delete</span>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </template>
                    <template v-else>
                        <tr>
                            <td colspan="6" class="uppercase text-center font-bold text-red-500 py-4">Data Customer
                                tidak
                                ditemukan
                            </td>
                        </tr>
                    </template>
                    <!-- Add more rows here -->
                    <div v-if="modalVerification"
                        class="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-30 z-50">
                        <div class="bg-white shadow-lg rounded-lg p-5">
                            <div class="flex items-center font-medium text-lg">
                                Apakah anda yakin ingin menghapus data?
                            </div>
                            <div class="mt-3 flex space-x-3 justify-center">
                                <button @click="modalVerification = false"
                                    class="rounded-lg w-32 text-white px-3 p-2 bg-green-500 hover:bg-white hover:text-green-500 border hover:border-green-500 transition-all duration-100">
                                    BATAL
                                </button>
                                <button @click="deleteCustomer(selectedDelete)"
                                    class="rounded-lg w-32 text-white px-3 p-2 bg-red-500 hover:bg-white hover:text-red-500 border hover:border-red-500  transition-all duration-100">
                                    IYA
                                </button>
                            </div>
                        </div>
                    </div>
                </tbody>
            </table>
        </div>
    </div>

</template>