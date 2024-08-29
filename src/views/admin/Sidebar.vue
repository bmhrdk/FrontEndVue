<template>
    <div class="flex">
        <!-- Sidebar -->
        <div class="fixed w-64 bg-[#323031] text-white h-screen">
            <div class="p-4">
                <img src="@/assets/delcompLong.png" alt="Logo" class="mx-auto w-auto h-10 filter invert">
            </div>
            <nav class="mt-1">
                <ul>
                    <RouterLink to="/admin/beranda">
                        <li class="px-4 py-2 pb-4 hover:bg-gray-700 hover:text-lime-300"
                            :class="{ 'bg-lime-100 bg-opacity-10 text-lime-600': $route.path === '/admin/beranda' }">
                            <div class="flex items-center space-x-2">
                                <IconHome class="w-7 h-7"></IconHome>
                                <span class="pt-2">Home</span>
                            </div>
                        </li>
                    </RouterLink>
                    <RouterLink to="/admin/service">
                        <li class="px-4 py-2 pb-4 hover:bg-gray-700 hover:text-lime-300"
                            :class="{ 'bg-lime-100 bg-opacity-10 text-lime-600': $route.path.startsWith('/admin/service') }">
                            <div class="flex items-center space-x-2"
                                :class="{ 'text-lime-600': $route.path === '/admin/service' }">
                                <IconService class="w-7 h-7"></IconService>
                                <span class="pt-2">Service</span>
                            </div>
                        </li>
                    </RouterLink>
                    <RouterLink to="/admin/inventory">
                        <li class="px-4 py-2 pb-4 hover:bg-gray-700 hover:text-lime-300"
                            :class="{ 'bg-lime-100 bg-opacity-10 text-lime-600': $route.path.startsWith('/admin/inventory') }">
                            <div class="flex items-center space-x-2">
                                <IconInventory class="w-7 h-7"></IconInventory>
                                <span class="pt-2">Inventory</span>
                            </div>
                        </li>
                    </RouterLink>
                    <RouterLink to="/admin/dataCustomer">
                        <li class="px-4 py-2 pb-4 hover:bg-gray-700 hover:text-lime-300"
                            :class="{ 'bg-lime-100 bg-opacity-10 text-lime-600': $route.path.startsWith('/admin/dataCustomer') }">
                            <div class="flex items-center space-x-2">
                                <IconCustomer class="w-7 h-7"></IconCustomer>
                                <span class="pt-2">Data Customer</span>
                            </div>
                        </li>
                    </RouterLink>
                    <RouterLink to="/admin/dataTechnician">
                        <li class="px-4 py-2 pb-4 hover:bg-gray-700 hover:text-lime-300"
                            :class="{ 'bg-lime-100 bg-opacity-10 text-lime-600': $route.path.startsWith('/admin/dataTechnician') }">
                            <div class="flex items-center space-x-2">
                                <IconTec class="w-7 h-7"></IconTec>
                                <span class="pt-2">Data Teknisi</span>
                            </div>
                        </li>
                    </RouterLink>
                    <RouterLink to="/admin/dataAdmin">
                        <li class="px-4 py-2 pb-4 hover:bg-gray-700 hover:text-lime-300"
                            :class="{ 'bg-lime-100 bg-opacity-10 text-lime-600': $route.path.startsWith('/admin/dataAdmin') }">
                            <div class="flex items-center space-x-2">
                                <IconTec class="w-7 h-7"></IconTec>
                                <span class="pt-2">Data Admin</span>
                            </div>
                        </li>
                    </RouterLink>
                    <!-- <RouterLink to="/admin/antrian">
                        <li class="px-4 py-2 pb-4 hover:bg-gray-700 hover:text-lime-300"
                            :class="{ 'bg-lime-100 bg-opacity-10 text-lime-600': $route.path.startsWith('/admin/antrian') }">
                            <div class="flex items-center space-x-2">
                                <IconQue class="w-7 h-7"></IconQue>
                                <span class="pt-2">List Antrian</span>
                            </div>
                        </li>
                    </RouterLink> -->
                </ul>
            </nav>
            <div class="flex justify-center">
                <div class="  bottom-5 absolute">
                    <button @click="logout"
                        class="flex items-center bg-redclass hover:bg-white text-white font-semibold hover:text-redclass py-2 px-4 border border-transparent hover:border-redclass duration-500 rounded-full mr-4">
                        <IconKeluar class="mr-2 h-7 w-7"></IconKeluar>
                        Log Out
                    </button>
                </div>
            </div>
        </div>
        <div class="flex-1 ml-64">

            <RouterView>

            </RouterView>

        </div>
    </div>
</template>

<script setup>
// import Sidebar from '../views/admin/Sidebar.vue'
import api from '@/api';
import { ref,provide } from 'vue';
import router from '@/router';
import IconHome from '@/components/icons/IconHome.vue';
import IconService from '@/components/icons/IconService.vue';
import IconTec from '@/components/icons/IconTec.vue';
import IconInventory from '@/components/icons/IconInventory.vue';
import IconCustomer from '@/components/icons/IconCustomer.vue';
import IconQue from '@/components/icons/IconQue.vue';
import IconKeluar from '@/components/icons/IconKeluar.vue';

const adminId =ref('');
const modalVerification = ref(false);
const notification = ref(null);

const getUser = async () => {
    try {
        const tokenUser = localStorage.getItem('accessToken');
        const response = await api.request('get', '/api/user', null, tokenUser);
        if (response.user) {
            adminId.value = response.user.admin.id
            // console.log(name.value);
        } else {
            console.log('Failed User');
            console.log(response.message);
        }
    } catch (error) {
        console.error('Failed:', error);
    }
};

getUser();
provide('adminId',adminId);

const logout = async () => {
    try {
        const tokenUser = localStorage.getItem('accessToken')
        const response = await api.request('post', '/api/logout', null, tokenUser);
        console.log(response)
        if (response.error) {
            notification.value = {
                message: response.error,
            };
            setTimeout(() => {
                notification.value = null;
            }, 2000);
        } else {
            localStorage.removeItem('accessToken')
            router.push('../')
        }
    } catch (error) {
        console.error('Failed:', error);
    }
}

</script>