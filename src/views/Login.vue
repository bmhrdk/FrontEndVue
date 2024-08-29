<script setup>
import api from '../api.js';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import Notification from '@/components/Notification.vue';

const notification = ref(null);
const router = useRouter();
const email = ref('');
const password = ref('');

const validEmailRegex = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z\-0-9]+\.)([a-zA-Z]{2,})$/;// Enhanced regular expression


async function login() {
  if (email.value) {
    if (!validEmailRegex.test(email.value)) {
      notification.value = {
        type: 'failed',
        message: 'Invalid Email. Contoh: user@example.com',
      };
      setTimeout(() => {
        notification.value = null;
      }, 2500);
      return;
    }
  }
  try {
    const userData = {
      email: email.value,
      password: password.value
    };
    const response = await api.request('post', '/api/login', userData, null);
    console.log('Login success:', response);
    if (response && response.user_type === 'admin') {
      const token = response.token;
      localStorage.setItem('accessToken', token);
      router.push('/admin/beranda');
    } else if (response && response.user_type === 'customer') {
      const token = response.token;
      const customerId = response.customer_id;
      localStorage.setItem('accessToken', token);
      localStorage.setItem('customerId', customerId );
      router.push('/customer/status');
    } else if (response && response.user_type === 'technician') {
      const token = response.token;
      const technician = response.customer_id;
      localStorage.setItem('accessToken', token);
      localStorage.setItem('technicianId', technician );
      router.push('/technician/serviceTec');
    }
    else if (response.error) {
      notification.value = {
        type: 'failed',
        message: response.message,
      };
      setTimeout(() => {
        notification.value = null;
      }, 2000);
    }
  } catch (error) {
    console.error('Login failed:', error);
  }
}




</script>

<template>
  <Notification v-if="notification" :type="notification.type" :message="notification.message" />
  <div class="min-h-screen flex w-full items-center justify-center relative mx-0">
    <div class=" bg-white justify-center rounded-3xl md:w-1/4 w-fit p-4 shadow-xl relative z-10">
      <h1 class="text-3xl py-5 text-center font-bold">
        <img src="@/assets/delcompLong.png" alt="Logo" class="mx-auto w-auto h-10 ">
      </h1>
      <div class="flex justify-center">
        <form @submit.prevent="login">
          <div class="space-y-4 w-full">
            <div>
              <label for="email" class="font-semibold" placeholder="nama@gmail.com">Email:</label>
              <input type="email" id="email" v-model="email" 
                class="w-full py-0.5 px-2 flex bg-graysecondary ring-1 ring-graydark  rounded" />
            </div>
            <div>
              <label for="password" class=" font-semibold">Password:</label>
              <input type="password" id="password" v-model="password" 
                class="w-full py-0.5 px-2 flex bg-graysecondary ring-1 ring-graydark rounded" />
            </div>
          </div>
          <div class="mt-6 flex justify-center ">
            <button type="submit"
            class="text-white font-medium tracking-wider bg-blue-800  hover:bg-green-600 rounded-md flex justify-center items-center px-6 py-2 duration-500 ">Masuk</button>
          </div>
          <!-- <div class=" mt-2 flex justify-center">
            <RouterLink to="/register">
              <button class=" text-blue-500 hover:text-yellow-500 duration-500" @click="handleClick">
                <u>Daftar Sekarang</u></button>
            </RouterLink>
          </div> -->
        </form>
      </div>
    </div>
  </div>
</template>
