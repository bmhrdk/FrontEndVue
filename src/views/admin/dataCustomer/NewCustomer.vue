<script setup>
import IconBack from '@/components/icons/IconBack.vue';
import Notification from '@/components/Notification.vue';
import { ref } from 'vue';
import api from '@/api';
import router from '@/router';


const name = ref('');
const email = ref('');
const password = ref('');
const address = ref('');
const phone = ref('', String);
const notification = ref(null);

const validEmailRegex = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z\-0-9]+\.)([a-zA-Z]{2,})$/;

function filterPhone(event) {
    // Mengambil nilai input
    const value = event.target.value;
    // Menghapus semua karakter non-numerik
    phone.value = value.replace(/[^0-9]/g, '');
}

async function newCustomerByAdmin() {
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
        // console.log(notification.value)
        const userData = {
            name: name.value,
            email: email.value,
            password: password.value,
            phone: phone.value,
            address: address.value
        };
        if (!name.value || !email.value || !password.value || !address.value || !phone.value) {
            notification.value = {
                type: 'failed',
                message: 'Semua kolom harus diisi.',
            };
            setTimeout(() => {
                notification.value = null;
            }, 2000);
            return;
        }

        const response = await api.request('post', '/api/registerCustomer', userData, null);
        console.log(response)
        if (response.message && !response.error) {
            console.log(response.message, "201")
            notification.value = {
                type: 'success',
                message: response.message,
            };
            setTimeout(() => {
                router.push('/admin/dataCustomer')
            }, 2000);
        }
        else if (response.error) {
            if (response.message === "The phone field format is invalid.") {
                notification.value = {
                    type: 'failed',
                    message: "No.HP dimulai '08' & harus 10-13 digit",
                };
            } else {
                notification.value = {
                    type: 'failed',
                    message: response.error,
                };
            }

            setTimeout(() => {
                notification.value = null;
            }, 2000);
        }
    } catch (error) {
        console.error('Failed:', error);
    }
}

</script>

<template>
     <div class="bg-[#c4b9b9] min-h-screen h-full  bg-opacity-75">
    <div class="flex justify-center">
        <div class="bg-white w-fit p-7 mt-40 ml-60 mr-60 rounded-lg">
            <div class=" flex justify-center">
                <RouterLink to="/admin/dataCustomer">
                    <button
                        class=" flex items-center outline outline-1 outline-[#FFC857] bg-[#FFC857] hover:bg-white text-white font-semibold hover:text-[#FFC857]  px-4 duration-500 rounded-full mt-2 h-fit ml-3 mr-4 mb-3">
                        <IconBack class="h-5 w-5 mr-2"></IconBack>
                        <span class="pt-0.5">Kembali</span>
                    </button>
                </RouterLink>
            </div>
            <form @submit.prevent="newCustomerByAdmin">
                <div class="space-y-4 w-full">
                    <div>
                        <label for="name" class="font-semibold" placeholder="nama@gmail.com">Nama:</label>
                        <input type="text" id="name" v-model="name"
                            class="w-full py-0.5 px-2 flex bg-graysecondary ring-1 ring-graydark  rounded" />
                    </div>
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
                    <div>
                        <label for="address" class=" font-semibold">Alamat:</label>
                        <input type="text" id="address" v-model="address"
                            class="w-full py-0.5 px-2 flex bg-graysecondary ring-1 ring-graydark rounded" />
                    </div>
                    <div>
                        <label for="phone" class="font-semibold" placeholder="+62">Nomor Handphone:</label>
                        <input type="tel" @input="filterPhone" id="phone" v-model="phone"
                            class="w-full py-0.5 px-2 flex bg-graysecondary ring-1 ring-graydark  rounded" />
                    </div>
                </div>
                <div class="mt-6 flex justify-center ">
                    <button type="submit"
                        class="text-white font-medium tracking-wider bg-blue-800  hover:bg-green-600 rounded-md flex justify-center items-center px-6 py-2 duration-500 ">Daftar</button>
                </div>
            </form>
        </div>
    </div>
</div>
</template>