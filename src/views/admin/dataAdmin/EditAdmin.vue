<script setup>
import IconBack from '@/components/icons/IconBack.vue';
import api from '@/api';
import { onMounted, ref } from 'vue';
import router from '@/router';


const props = defineProps({
    id: String,
});
const adminId = ref('');
const name = ref('');
const email = ref('');
const password = ref('');
const address = ref('');
const phone = ref('', String);




const notification = ref(null);
// const detailData = ref(null);

function filterPhone(event) {
  // Mengambil nilai input
  const value = event.target.value;
  // Menghapus semua karakter non-numerik
  filter.value = value.replace(/[^0-9]/g, '');
}



const getOneAdmin = async () => {
    try {
        const tokenUser = localStorage.getItem('accessToken');
        const response = await api.request('get', `/api/getOneAdmin/${props.id}`, null, tokenUser);
        if (response.error) {
            router.push("../");
        } else {
            // detailData.value = response;
            adminId.value = response.adminId;
            name.value = response.name;
            email.value = response.email;
            password.value = response.password;
            address.value = response.address;
            phone.value = response.phone;
        }
    } catch (error) {
        console.error('Failed:', error);
    }
};

onMounted(() => {
    console.log(props.id)
    getOneAdmin(props.id);
});
const adminUpdateByAdmin = async () => {
    try {
        // console.log(notification.value)
        const updatedData = {
            adminId: adminId.value,
            name: name.value,
            email: email.value,
            password: password.value,
            address: address.value,
            phone: phone.value

        };

        const tokenUser = localStorage.getItem('accessToken');
        const response = await api.request('put', `/api/updateAdmin/ ${ props.id }`, updatedData, tokenUser);
        console.log(response)
        if (response.message && !response.error) {
            console.log(response.message, "201")
            notification.value = {
                type: 'success',
                message: response.message,   
            };
            setTimeout(() => {
                router.push('/admin/dataAdmin')
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
     <div class="bg-[#c4b9b9] min-h-screen h-full  bg-opacity-75">
    <div class="flex justify-center">
        <div class="bg-white w-fit p-7 mt-40 ml-60 mr-60 rounded-lg">
            <div class=" flex justify-center">
                <RouterLink to="/admin/dataAdmin">
                    <button
                        class=" flex items-center outline outline-1 outline-[#FFC857] bg-[#FFC857] hover:bg-white text-white font-semibold hover:text-[#FFC857]  px-4 duration-500 rounded-full mt-2 h-fit ml-3 mr-4 mb-3">
                        <IconBack class="h-5 w-5 mr-2"></IconBack>
                        <span class="pt-0.5">Kembali</span>
                    </button>
                </RouterLink>
            </div>
            <form @submit.prevent="adminUpdateByAdmin">
                <div class="text-sm items-center ">
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
                <div class="flex justify-center">
                    <button type="submit"
                        class="mt-3 text-sm flex items-center space-x-2 font-normal text-white bg-greenprimary rounded-md p-2 px-3 hover:bg-white hover:outline hover:outline-greenprimary hover:text-greenprimary transition-all duration-100">
                        <IconCheck class="mr-2" />
                        Edit Selesai
                    </button>
                </div>
            </form>
        </div>
    </div>
</div>
</template>