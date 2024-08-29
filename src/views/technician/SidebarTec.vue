<script setup>
import api from '@/api';
import IconKeluar from '@/components/icons/IconKeluar.vue';
import IconService from '@/components/icons/IconTec.vue';
import IconRes from '@/components/icons/IconRes.vue';
import IconHistory from '@/components/icons/IconHistory.vue';
import { ref,provide } from 'vue';
import router from '@/router';

const technicianId =ref('');

const getUser = async () => {
    try {
        const tokenUser = localStorage.getItem('accessToken');
        const response = await api.request('get', '/api/user', null, tokenUser);
        if (response.user) {
            technicianId.value = response.user.technician.id
            // console.log(name.value);
        } else {
            console.log('Failed User');
            console.log(response.message);
        }
    } catch (error) {
        console.error('Failed:', error);
    }
};

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

getUser();
provide('technicianId',technicianId);

</script>

<template>
    <div class="flex">
        <!-- Sidebar -->
        <div class=" fixed w-64 bg-[#323031] text-white h-screen">
            <div class="p-4">
                <img src="@/assets/delcompLong.png" alt="Logo" class="mx-auto w-auto h-10 filter invert">
            </div>
            <nav class="mt-1">
                <ul>
                    <RouterLink to="/customer/status">
                        <li class="px-4 py-2 pb-4 hover:bg-gray-700 hover:text-lime-300"
                            :class="{ 'bg-lime-100 bg-opacity-10 text-lime-600': $route.path === '/customer/status' }">
                            <div class="flex items-center space-x-2":class="{ 'text-lime-600': $route.path === '/customer/status' }">
                                <IconService class="w-7 h-7"></IconService>
                                <span class="pt-2">Status Service</span>
                            </div>
                        </li>
                    </RouterLink>
                    <!-- <RouterLink to="/customer/booking">
                        <li class="px-4 py-2 pb-4 hover:bg-gray-700 hover:text-lime-300"
                            :class="{ 'bg-lime-100 bg-opacity-10 text-lime-600': $route.path.startsWith('/customer/booking') }">
                            <div class="flex items-center space-x-2"
                                :class="{ 'text-lime-600': $route.path === '/customer/booking' }">
                                <IconRes class="w-7 h-7"></IconRes>
                                <span class="pt-2">Booking Antrian</span>
                            </div>
                        </li>
                    </RouterLink> -->
                    <!-- <RouterLink to="/customer/history">
                        <li class="px-4 py-2 pb-4 hover:bg-gray-700 hover:text-lime-300"
                            :class="{ 'bg-lime-100 bg-opacity-10 text-lime-600': $route.path.startsWith('/customer/history') }">
                            <div class="flex items-center space-x-2"
                                :class="{ 'text-lime-600': $route.path === '/customer/history' }">
                                <IconHistory class="w-7 h-7"></IconHistory>
                                <span class="pt-2">History Service</span>
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

