<script setup>
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import IconBack from '@/components/icons/IconBack.vue';
import Notification from '@/components/Notification.vue';
import IconAdd from '@/components/icons/IconAdd.vue';
import IconDelete from '@/components/icons/IconDelete.vue';
import IconPDF from '@/components/icons/IconPDF.vue';
import api from '@/api';
import { watch, onMounted, ref, computed } from 'vue';
import router from '@/router';


const props = defineProps({
    id: String,
});
const adminId = ref('');
const createdBy = ref('');
const processedBy = ref('');
const finishedBy = ref('');
const role = ref('');
const customerId = ref('');
const name = ref('');
const merek = ref('');
const tipe = ref('');
const diagnosaAwal = ref('');
const kerusakanList = ref(['']);
const estimasi = ref(new Date());
const status = ref('');
const biayaKerusakan = ref([]);
const spareparts = ref([]);
const hasSpareparts = computed(() => spareparts.value.length > 0);
const receivedSparepartsData = ref([]);
const searchQuerySparepart = ref('');
const newStatus = ref('');


const notification = ref(null);
// const detailData = ref(null);
const date = ref();


const getOneService = async () => {
    try {
        const tokenUser = localStorage.getItem('accessToken');
        const response = await api.request('get', `/api/getOneService/${props.id}`, null, tokenUser);
        if (response.error) {
            router.push("../");
        } else {
            // detailData.value = response;
            adminId.value = response.adminId;
            createdBy.value = response.createdBy.name;
            role.value = response.createdBy.role;
            processedBy.value = response.processedBy;
            finishedBy.value = response.finishedBy;
            customerId.value = response.customerId;
            name.value = response.nama_customer;
            merek.value = response.merek;
            tipe.value = response.tipe;
            diagnosaAwal.value = response.diagnosaAwal;
            status.value = response.status;
            kerusakanList.value = response.detail_service.kerusakan ? response.detail_service.kerusakan : [];
            estimasi.value = response.detail_service.estimasi;
            biayaKerusakan.value = response.detail_service.biayaKerusakan ? response.detail_service.biayaKerusakan : [];
            console.log(biayaKerusakan.value)

            spareparts.value = response.inventory.map(item => ({
                inventoryId: item.inventoryId,
                merekSparepart: item.merek_sparepart,
                tipeSparepart: item.tipe_sparepart,
                jumlahSparepart: item.jumlah_sparepart,
                hargaSatuan: item.harga_satuan,
            }));
        }


    } catch (error) {
        console.error('Failed:', error);
    }
};

onMounted(() => {
    console.log(props.id)
    getOneService(props.id);
});
const updateOneServiceId = async () => {
    try {

        const emptyKerusakan = kerusakanList.value.some(item => item && item.trim() !== '');

        if (!emptyKerusakan) {
            notification.value = {
                type: 'failed',
                message: 'Kolom kerusakan harus diisi.',
            };
            setTimeout(() => {
                notification.value = null;
            }, 2000);
            return;
        }


        const arrayBiayaKerusakan = Array.isArray(biayaKerusakan.value)
            ? biayaKerusakan.value.map(item => item.toString())
            : [];
        console.log(arrayBiayaKerusakan)
        const updatedData = {
            // adminId: adminId.value,
            customerId: customerId.value,
            name: name.value,
            merek: merek.value,
            tipe: tipe.value,
            status: 'Pengerjaan Selesai',
            estimasi: estimasi.value,
            kerusakan: kerusakanList.value,
            biayaKerusakan: arrayBiayaKerusakan,
            ...(hasSpareparts.value && {
                inventory: spareparts.value.map((sparepart) => ({
                    inventoryId: sparepart.inventoryId,
                    jumlah_sparepart: sparepart.jumlahSparepart,
                    // harga_satuan: sparepart.hargaSatuan,
                })),
            }),
        };
        console.log(updatedData)

        const tokenUser = localStorage.getItem('accessToken');
        const response = await api.request('put', `/api/updateService/ ${props.id}`, updatedData, tokenUser);
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
function addKerusakan() {
    kerusakanList.value.push('');
    biayaKerusakan.value.push(0);

}

function removeKerusakan(index) {
    if (kerusakanList.value.length >= 0) {
        kerusakanList.value.splice(index, 1);
        biayaKerusakan.value.splice(index, 1);
    }
}

async function getDataSparepart() {
    try {
        const tokenUser = localStorage.getItem('accessToken');
        const response = await api.request('get', '/api/getAllAvailable', null, tokenUser);
        // console.log(response.data)
        if (response.data) {
            receivedSparepartsData.value = response.data;
        }
    } catch (error) {
        console.error('Failed:', error);
    }
}
getDataSparepart();

const getOneSparepart = async (id, index) => {
    try {
        const tokenUser = localStorage.getItem('accessToken');
        const response = await api.request('get', `/api/getOneInventory/${id}`, null, tokenUser);

        console.log(response.harga)
        if (response) {
            // Update the specific spare part's details
            spareparts.value[index].hargaSatuan = response.harga;
        }
    } catch (error) {
        console.error('Failed:', error);
    }
}
// Sparepart Function
const listSpareparts = ref(new Array(spareparts.value.length).fill(false));
function toggleListSparepart(index) {
    listSpareparts.value[index] = !listSpareparts.value[index];
}
function addSparepart() {
    spareparts.value.push({ merekSparepart: '', jumlahSparepart: '' });
}
function removeSparepart(index) {
    spareparts.value.splice(index, 1);
}

watch(searchQuerySparepart, (newQuery) => {
    if (newQuery === '') {
        getDataSparepart();
    } else {
        getDataSparepartSearch(newQuery);
    }
});




function selectSparepart(data, index) {
    spareparts.value[index].inventoryId = data.id;
    spareparts.value[index].merekSparepart = data.merek;
    spareparts.value[index].tipeSparepart = data.tipe;
    // spareparts.value[index].hargaSatuan = data.harga_satuan;

    getOneSparepart(data.id, index);
    listSpareparts.value[index] = false;


}

const notaPDF = async () => {
    try {
        const tokenUser = localStorage.getItem('accessToken');
        const response = await api.request('get', `/api/downloadNotaPDF/${props.id}`, null, tokenUser, {
            responseType: 'blob' // Mengatur respons untuk menerima blob
        });

        if (response.data) {
            // Membuat URL untuk file PDF
            const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
            // Membuat elemen <a> dan mengkliknya untuk memulai download
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'nota.pdf'); // Nama file PDF yang akan diunduh
            document.body.appendChild(link);
            link.click();
            link.remove();
            // Membersihkan URL object
            window.URL.revokeObjectURL(url);
        }
    } catch (error) {
        console.error('Failed:', error);
    }
}

function formattedHargaSatuan(index) {
    const sparepart = spareparts.value[index];
    const hargaSatuan = parseFloat(sparepart.hargaSatuan) || 0;
    return formatCurrency(hargaSatuan);
}
const formatCurrency = (value) => {
    const formatter = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    });
    return formatter.format(value);
};

const totalPriceKerusakan = computed(() => {
    return biayaKerusakan.value.reduce((total, harga) => {
        return total + (parseFloat(harga) || 0);
    }, 0);
});

const totalPrice = computed(() => {
    return spareparts.value.reduce((total, sparepart) => {
        const hargaSatuan = parseFloat(sparepart.hargaSatuan) || 0;
        const jumlah = parseFloat(sparepart.jumlahSparepart) || 0;
        return total + (hargaSatuan * jumlah);
    }, 0);
});

</script>

<template>
    <div class="flex flex-col bg-[#c4b9b9] min-h-screen bg-opacity-75">
        <div class="bg-white p-1 my-20 mx-32 rounded-lg">
            <Notification v-if="notification" :type="notification.type" :message="notification.message" />
            <div class=" mb-4 flex items-center justify-between">
                <RouterLink to="/admin/service">
                    <button
                        class=" flex items-center outline outline-1 outline-[#FFC857] bg-[#FFC857] hover:bg-white text-white font-semibold hover:text-[#FFC857]  px-4 duration-500 rounded-full mt-2 h-fit ml-3 mr-4 mb-3">
                        <IconBack class="h-5 w-5 mr-2"></IconBack>
                        <span class="pt-0.5">Kembali</span>
                    </button>
                </RouterLink>
                <div class=" font-semibold border-b border-blue-500">Status Sekarang = <span
                        class="capitalize font-bold">{{ status }}</span></div>
                <div class=" mr-3 text-xs font-semibold border-b-2 border-blue-500">Dibuat Oleh =
                    <span class="uppercase text-emerald-400 mr-1 ">{{ role }}</span>
                    <span class="capitalize font-bold">{{ createdBy }}</span>
                </div>
            </div>
            <form @submit.prevent="updateOneServiceId">
                <div class="text-sm grid items-center grid-cols-3 gap-y-8 gap-x-10 px-6 ">
                    <div class="space-y-2 ">
                        <label for="name" class="font-medium">Nama Customer:</label>
                        <input id="name" type="text" v-model="name" disabled
                            class=" capitalize p-2 px-4 w-full flex rounded-lg bg-gray-600 ring-inset ring-1 ring-graydark focus:ring-graydark bg-opacity-30" />
                    </div>
                    <div class="space-y-2 ">
                        <label for="merek" class="font-medium">Merek:</label>
                        <input id="merek" type="text" v-model="merek"
                            :disabled="status === 'Selesai' || status === 'Menunggu Pembayaran'"
                            class="uppercase p-2 px-3 w-full flex rounded-lg bg-blurwhite ring-inset ring-1 ring-graydark focus:ring-graydark" />
                    </div>
                    <div class="space-y-2 ">
                        <label for="tipe" class="font-medium">Tipe:</label>
                        <input id="tipe" type="text" v-model="tipe"
                            :disabled="status === 'Selesai' || status === 'Menunggu Pembayaran'"
                            class="p-2 px-3 w-full flex rounded-lg bg-blurwhite ring-inset ring-1 ring-graydark focus:ring-graydark" />
                    </div>
                    <div class="space-y-2 col-span-3 ">
                        <label for="diagnosa" class="font-medium">Diagnosa Awal:</label>
                        <textarea id="diagnosa" type="text" v-model="diagnosaAwal" disabled
                            class="capitalize p-2 px-4 w-full flex rounded-lg bg-gray-600 ring-inset ring-1 ring-graydark focus:ring-graydark bg-opacity-30"></textarea>
                    </div>
                    <div class="mx-14 space-y-2 col-span-3">
                        <div class="flex">
                            <label for="kerusakan" class="font-medium">Kerusakan & Perbaikan:</label>
                            <button
                                v-if="status != 'Selesai' && status != 'Pengerjaan Selesai' && status != 'Menunggu Pembayaran'"
                                @click.prevent="addKerusakan"
                                class="ml-2 text-sm flex items-center space-x-2 font-normal text-white bg-greenprimary rounded-full p-1 hover:bg-white hover:outline hover:outline-greenprimary hover:text-greenprimary transition-all duration-100">
                                <IconAdd class="" />
                            </button>
                        </div>
                        <div v-for="(kerusakan, index) in kerusakanList" :key="index"
                            class="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-2 p-4 rounded-lg bg-[#323031] bg-opacity-10 outline outline-1 outline-[#323031]">

                            <!-- Input for Kerusakan -->
                            <div class="mt-6">
                                <input :id="'kerusakan-' + index" type="text" v-model="kerusakanList[index]"
                                    :disabled="status === 'Selesai' || status === 'Pengerjaan Selesai' || status === 'Menunggu Pembayaran'"
                                    class=" capitalize p-2 px-3 w-full md:w-80 flex rounded-lg bg-blurwhite ring-inset ring-1 ring-graydark focus:ring-graydark" />
                            </div>

                            <!-- Input for Harga Kerusakan -->
                            <div class="space-y-1">
                                <div class="font-bold italic">(Biaya Jasa:
                                    <span>{{ formatCurrency(biayaKerusakan[index]) }}</span>)
                                </div>
                                <input :id="'biayaKerusakan-' + index" type="number" v-model="biayaKerusakan[index]"
                                    :disabled="status === 'Selesai' || status === 'Pengerjaan Selesai' || status === 'Menunggu Pembayaran'"
                                    class="p-2 px-3 w-full md:w-40 flex rounded-lg bg-blurwhite ring-inset ring-1 ring-graydark focus:ring-graydark"
                                    placeholder="Harga" />
                            </div>

                            <!-- Button to Remove Kerusakan -->
                            <div class="mt-6">
                                <button
                                    v-if="index >= 0 && status !== 'Selesai' && status !== 'Pengerjaan Selesai' && status !== 'Menunggu Pembayaran'"
                                    @click.prevent="removeKerusakan(index)"
                                    class=" mt-6 text-sm flex items-center space-x-2 font-normal text-white bg-red-500 rounded-full p-1 hover:bg-white hover:outline hover:outline-red-500 hover:text-red-500 transition-all duration-100">
                                    <IconDelete class="" />
                                </button>
                            </div>
                        </div>
                        <div class="col-span-2 px-2 w-full flex justify-center">
                            <div class="flex items-center">
                                <label for="price" class="tracking italic">Total Biaya Jasa :</label>
                                <span class="ml-2 italic font-semibold text-green-500">{{
                                    formatCurrency(totalPriceKerusakan) }}</span>
                            </div>
                        </div>
                    </div>
                    <div class="mx-14 space-y-2 col-span-3">
                        <label for="tipe" class="font-medium">Sparepart Tambahan:
                            <span class="text-green-500">(OPSIONAL)</span>
                        </label>
                        <div v-if="spareparts.length > 0"
                            class="p-4 rounded-lg bg-[#323031] bg-opacity-10 outline outline-1 outline-[#323031]">
                            <div class="md:text-sm text-xs grid md:grid-cols-2 gap-y-8">
                                <div v-for="(sparepart, index) in spareparts" :key="index"
                                    class="space-x-8 col-span-2 flex w-full items-center">
                                    <div class="space-y-2 relative">
                                        <div class="flex">
                                            <label class="font-medium">Nama Sparepart:</label>
                                            <div class="font-bold italic">(Harga: <span>{{ formattedHargaSatuan(index)
                                                    }}</span>)</div>
                                        </div>
                                        <button id="name" @click.prevent="toggleListSparepart(index)"
                                            :disabled="status === 'Selesai' || status === 'Pengerjaan Selesai' || status === 'Menunggu Pembayaran'"
                                            class="p-2 px-3 w-80 flex rounded-lg bg-blurwhite ring-inset ring-1 ring-graydark focus:ring-graydark">
                                            <span v-if="sparepart.tipeSparepart">
                                                <span
                                                    class="uppercase rounded-full border-b-2 border-green-500 font-medium tracking-widest text-green-500 mr-1 px-3 py-0.5 text-center">{{
                                                        sparepart.merekSparepart }}
                                                </span>
                                                {{ sparepart.tipeSparepart }}
                                            </span>
                                            <span v-else class="text-graydark">
                                                Pilih Sparepart
                                            </span>
                                            <IconDropdown class="absolute right-0 w-5 h-5 mr-2 text-graydark" />
                                        </button>
                                        <div v-if="listSpareparts[index]"
                                            class="z-50 bg-[#323031] absolute md:w-fit w-full mt-2 drop-shadow-lg rounded-md ring-1 ring-black p-2">
                                            <div class="relative flex items-center">
                                                <div class="absolute p-1 py-2 ">
                                                    <IconSearch class="ml-1 w-4 h-4 text-white" />
                                                </div>
                                                <input type="text" v-model="searchQuerySparepart"
                                                    placeholder="Cari nama...."
                                                    class="pl-7 flex flex-1 text-xs items-center text-black bg-blurwhite ring-inset ring-1 ring-lightdark hover:ring-graydark active:ring-graydark focus:ring-graydark focus:outline-none rounded-md p-2 px-3 transition duration-100 w-full md:w-80 placeholder:italic">
                                                </input>
                                            </div>
                                            <div class="mt-2 overflow-y-auto h-32">
                                                <template v-if="receivedSparepartsData.length">
                                                    <div v-for="data in receivedSparepartsData" :key="data.id"
                                                        @click="selectSparepart(data, index)">
                                                        <div
                                                            class="cursor-pointer text-white font-semibold pl-1 my-2 border-b-transparent duration-200 hover:border-b-2 hover:border-green-500">
                                                            <span
                                                                class="uppercase rounded-lg w-fit bg-white font-medium tracking-wider text-orangeclass mr-1 px-3 py-0.5 text- text-center">{{
                                                                    data.merek }}
                                                            </span>
                                                            {{ data.tipe }}
                                                        </div>
                                                    </div>
                                                </template>
                                                <template v-else>
                                                    <div class="text-center italic my-1">Data tidak tersedia..</div>
                                                </template>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="space-y-2">
                                        <label class="font-medium">Jumlah:</label>
                                        <div class="flex items-center">
                                            <input v-model="sparepart.jumlahSparepart" type="number"
                                                :disabled="status === 'Selesai' || status === 'Pengerjaan Selesai' || status === 'Menunggu Pembayaran'"
                                                class="p-2 px-3 w-20 flex text-center rounded-lg bg-blurwhite ring-inset ring-1 ring-graydark focus:ring-graydark" />
                                            <button @click="removeSparepart(index)"
                                                v-if="status !== 'Selesai' && status !== 'Pengerjaan Selesai' && status !== 'Menunggu Pembayaran'"
                                                class="md:ml-8 ml-2 drop-shadow-lg bg-redclass text-white rounded-full px-2 hover:text-redclass hover:bg-white hover:outline hover:outline-redclass">
                                                <IconDelete class="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div v-if="spareparts.length > 0" class="col-span-2 px-2 w-full flex justify-center">
                                    <div class="flex items-center">
                                        <label for="price" class="tracking italic">Total Harga Sparepart :</label>
                                        <span class="ml-2 italic font-semibold text-green-500">{{
                                            formatCurrency(totalPrice) }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <button @click.prevent="addSparepart"
                            v-if="status !== 'Selesai' && status !== 'Pengerjaan Selesai' && status !== 'Menunggu Pembayaran'"
                            class="mt-4 flex items-center p-2 text-xs rounded-md uppercase text-orangeprimary outline outline-orangeprimary hover:bg-orangeprimary hover:outline-none hover:text-white transition-all duration-75">
                            <IconAddOutline class="w-5 h-5 mr-1" />
                            TAMBAH SPAREPART
                        </button>
                    </div>

                    <div class="p-0.5 w-80 space-y-2 ml-auto">
                        <label for="estimasi" class="font-medium">Estimasi:</label>
                        <VueDatePicker auto-apply :min-date="new Date()"
                            class=" rounded-[4px] bg-blurwhite ring-1 ring-graydark focus:ring-graydark"
                            v-model="estimasi" disabled>
                        </VueDatePicker>
                    </div>
                    <!-- <div class="space-y-2 ">
                        <label for="biaya" class="font-medium">Biaya Perawatan:</label>
                        <input id="biaya" type="text" v-model="biaya" :disabled="status === 'Selesai'"
                            class="p-2 px-3 w-80 flex rounded-lg bg-blurwhite ring-inset ring-1 ring-graydark focus:ring-graydark" />
                    </div> -->
                    <!-- <div v-if="status !== 'Selesai' && status !== 'Diproses'" class="flex justify-center items-center col-span-3 space-x-2">
                        <label for="status" class="font-medium">Status:</label>
                        <input type="radio" v-model="newStatus" id="selesai" value="Selesai">
                        <label for="selesai" class="bg-green-500 text-white py-1 px-2 rounded-full text-xs">
                            Selesai
                        </label>

                        <input v-if="status !== 'Selesai' && status !== 'Menunggu Pembayaran'" type="radio"
                            v-model="newStatus" id="pengerjaan" value="Pengerjaan Selesai">
                        <label v-if="status !== 'Selesai' && status !== 'Menunggu Pembayaran'" for="pengerjaan"
                            class="bg-orange-500 text-white py-1 px-2 rounded-full text-xs">
                            Pengerjaan Selesai
                        </label>

                        <input type="radio" v-model="newStatus" id="belumdibayar" value="Menunggu Pembayaran">
                        <label for="belumdibayar" class="bg-red-500 text-white py-1 px-2 rounded-full text-xs">
                            Menunggu Pembayaran
                        </label>
                    </div> -->
                    <div v-if="status === 'Selesai'" class="flex justify-center items-center col-span-3">
                        <div class=" border-b-2 border-green-500 text-2xl text-green-500">SERVIS SELESAI </div>
                    </div>
                </div>
                <div class="flex space-x-2 justify-center">
                    <button
                        v-if="status != 'Selesai' && status != 'Pengerjaan Selesai' && status != 'Menunggu Pembayaran'"
                        type="submit"
                        class="mt-8 text-sm flex items-center space-x-2 font-normal text-white bg-greenprimary rounded-md p-2 px-3 hover:bg-white hover:outline hover:outline-greenprimary hover:text-greenprimary transition-all duration-100">
                        <IconCheck class="mr-2" />
                        Edit Selesai
                    </button>
                    <button @click.prevent="notaPDF" v-if="status === 'Selesai' || status === 'Menunggu Pembayaran'"
                        class="mt-8 text-sm flex items-center space-x-2 font-normal text-white bg-greenprimary rounded-md p-2 px-3 hover:bg-white hover:outline hover:outline-greenprimary hover:text-greenprimary transition-all duration-100">
                        <IconPDF class="w-5 h-5 mr-2" />
                        Download PDF
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>