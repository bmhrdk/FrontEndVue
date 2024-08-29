<script setup>
import { useRouter } from 'vue-router';
import { ref, watch } from 'vue';
import api from '@/api';
import IconEdit from '@/components/icons/IconEdit.vue';
import IconAdd from '@/components/icons/IconAdd.vue';
import IconTrash from '@/components/icons/IconTrash.vue';
import IconFind from '@/components/icons/IconFind.vue';

const router = useRouter();
const notification = ref(null);
const inventories = ref([]);
const searchQuery = ref('');
const modalVerification = ref(false);

async function getAllInventory() {
    try {
        const tokenUser = localStorage.getItem('accessToken');
        const response = await api.request('get', '/api/getAllInventory', null, tokenUser);
        // console.log(response.data)
        if (response.data) {
            inventories.value = response.data;
            console.log(inventories.value)
        }
    } catch (error) {
        console.error('Failed:', error);
    }
}

getAllInventory();

async function searchInventory(name) {
    try {
        const tokenUser = localStorage.getItem('accessToken');
        const response = await api.request('get', `/api/searchInventory/${name}`, null, tokenUser);
        console.log(response)
        if (response.data) {
            inventories.value = response.data;
        } else if (response.error) {
            inventories.value = [];
            // console.log(customers.value)
        }
    } catch (error) {
        console.error('Failed:', error);
    }
}

async function deleteOneInventory(id) {
    try {
        const tokenUser = localStorage.getItem('accessToken');
        const response = await api.request('delete', `/api/deleteOneInventory/${id}`, null, tokenUser);
        modalVerification.value = false;
        notification.value = {
            message: response.message,
        };
        getAllInventory();
        setTimeout(() => {
            notification.value = null;
        }, 2000);
    } catch (error) {
        console.error('Failed:', error);
        notification.value = {
            message: 'Gagal menghapus data..',
        };
        getAllInventory();
        setTimeout(() => {
            notification.value = null;
        }, 2000);
    }
}

const selectedDelete = ref(null);
const deleteInventoryPopup = (inventoryId) => {
    modalVerification.value = true;
    selectedDelete.value = inventoryId;
};

watch(searchQuery, (newQuery) => {
    if (newQuery === '') {
        getAllInventory();
    } else {
        searchInventory(newQuery);
    }
});

const updateInventory = (inventoryId) => {
    const id = inventoryId;
    router.push({ name: 'editInventory', params: { id } })
}



</script>


<template>
    <div class="bg-[#c4b9b9] min-h-screen h-full  bg-opacity-75">
    <div class="flex pt-2 pr-2 justify-end w-full">
        <RouterLink to="/admin/inventory/newInventory">
            <button
                class="flex items-center bg-blue-900 hover:bg-white text-white font-semibold hover:text-blue-900 py-2 px-4 duration-500 rounded-full mr-4 ">
                <IconAdd class="mr-1 h-5 w-5"></IconAdd>
                New Spareparts
            </button>
        </RouterLink>
    </div>

    <div class="bg-white m-4 shadow-lg rounded-lg">
        <div class="justify-center w-full h-10 flex bg-[#084c61] rounded-t-lg">
            <div class="relative flex items-center">
                <div class="absolute pl-3 p-1 py-2 ">
                    <IconFind class=" w-6 h-6 text-graydark" />
                </div>
                <input type="text" v-model="searchQuery" placeholder="Cari berdasarkan nama"
                    class="text-left ml-3  pl-8 text-sm flex flex-1 items-center text-black bg-blurwhite ring-inset ring-1 ring-lightdark hover:ring-graydark active:ring-graydark focus:ring-graydark focus:outline-none rounded-full p-1 px-3 duration-100 w-full md:w-64 mr-3 ">
                </input>
            </div>
        </div>
        <div class="bg-white p-1 rounded-full">
            <table class="w-full table-fixed">
                <thead>
                    <tr class="">
                        <th class="text-center w-1/4 py-4 px-6 text-gray-600 font-bold uppercase">Merek</th>
                        <th class="text-center w-1/2 py-4 px-6 text-gray-600 font-bold uppercase">Tipe</th>
                        <th class="text-center w-1/3 py-4 px-6 text-gray-600 font-bold uppercase">Stok</th>
                        <th class="text-center w-1/2 py-4 px-6 text-gray-600 font-bold uppercase">Harga</th>
                        <th class=" w-1/2 text-center text-gray-600 font-bold uppercase"></th>
                    </tr>
                </thead>
                <tbody class="bg-white">
                    <template v-if="inventories.length">
                        <tr v-for="inventory in inventories" :key="inventory.id">
                            <td class="uppercase text-center py-4 px-6 border-b border-gray-200">{{ inventory.merek }}
                            </td>
                            <td class="capitalize text-center py-4 px-6 border-b border-gray-200">{{ inventory.tipe }}
                            </td>
                            <td class="text-center py-4 px-6 border-b border-gray-200 truncate">{{ inventory.stok }}
                            </td>
                            <td class="text-center py-4 px-6 border-b border-gray-200 truncate">{{ inventory.harga }}
                            </td>
                            <td class="py-4 px-6 border-b border-gray-200">
                                <div class="flex space-x-2 ">
                                    <button @click="updateInventory(inventory.id)"
                                        class=" border border-white bg-yellow-500 items-center text-white hover:text-yellow-500 hover:bg-white hover:border-yellow-500 duration-500 flex rounded-full p-1 space-x-1 px-3">
                                        <IconEdit class="w-7 h-5 rounded-full"></IconEdit>
                                        <span>Edit</span>
                                    </button>
                                    <button @click="deleteInventoryPopup(inventory.id)"
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
                            <td colspan="6" class="uppercase text-center font-bold text-red-500 py-4">Spareparts tidak
                                ditemukan
                            </td>
                        </tr>
                    </template>
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
                                <button @click="deleteOneInventory(selectedDelete)"
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
    </div>
</div>

</template>