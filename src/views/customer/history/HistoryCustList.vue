<script setup>
import IconEdit from '@/components/icons/IconEdit.vue';
import IconAdd from '@/components/icons/IconAdd.vue';
import IconTrash from '@/components/icons/IconTrash.vue';
import IconFind from '@/components/icons/IconFind.vue';

</script>
<template>
    <div class="bg-white m-4 shadow-lg rounded-lg">
        <div class=" justify-between w-full h-10 flex bg-[#084c61] rounded-t-lg">
            <button
                class=" bg-slate-100 hover:bg-slate-400 text-black font-semibold hover:text-blue-900  px-4 duration-500 rounded-full mt-2 h-fit ml-3 mr-4">
                All v
            </button>
            <div class="relative flex items-center">
                <div class="absolute pl-3 p-1 py-2 ">
                    <IconFind class=" w-6 h-6 text-graydark" />
                </div>
                <input type="text" placeholder="Cari berdasarkan nama"
                    class="text-center pl-8 text-sm flex flex-1 items-center text-black bg-blurwhite ring-inset ring-1 ring-lightdark hover:ring-graydark active:ring-graydark focus:ring-graydark focus:outline-none rounded-full p-1 px-3 duration-100 w-full md:w-64 mr-3 ">
                </input>
            </div>
        </div>
        <div class="bg-white p-1 rounded-full">

            <table class="w-full table-fixed">
                <thead>
                    <tr class="">
                        <th class="text-center w-1/4 py-4 px-6 text-gray-600 font-bold uppercase">Laptop</th>
                        <th class="text-center w-1/3 py-4 px-6 text-gray-600 font-bold uppercase">Tipe</th>
                        <th class="text-center w-1/2 py-4 px-6 text-gray-600 font-bold uppercase">Kerusakan</th>
                        <th class="w-1/4 text-center text-gray-600 font-bold uppercase"></th>
                    </tr>
                </thead>
                <tbody class="bg-white">
                    <tr>
                        <td class="text-center py-4 px-6 border-b border-gray-200">Asus</td>
                        <td class="text-center py-4 px-6 border-b border-gray-200">A555XV</td>
                        <td class="text-center py-4 px-6 border-b border-gray-200 truncate">BlueScreen</td>
                        <td class="py-4 px-6 border-b border-gray-200">
                            <RouterLink to="" class="inline-block">
                                <button
                                    class=" border border-white bg-green-500 items-center text-white hover:text-green-500 hover:bg-white hover:border-green-500 duration-500 flex rounded-full p-1 space-x-1 px-3">
                                    <span>Details</span>
                                </button>
                            </RouterLink>
                        </td>
                    </tr>
                    <tr>
                        <td class="text-center py-4 px-6 border-b border-gray-200">Pablo</td>
                        <td class="text-center py-4 px-6 border-b border-gray-200">Acer</td>
                        <td class="text-center py-4 px-6 border-b border-gray-200 truncate">Aspire 3 Spin 14</td>
                        <td class="py-4 px-6 border-b border-gray-200">
                            <RouterLink to="" class="inline-block">
                                <button
                                    class=" border border-white bg-green-500 items-center text-white hover:text-green-500 hover:bg-white hover:border-green-500 duration-500 flex rounded-full p-1 space-x-1 px-3">
                                    <span>Details</span>
                                </button>
                            </RouterLink>
                        </td>
                    </tr>
                    <tr>
                        <td class="text-center py-4 px-6 border-b border-gray-200">Pablo</td>
                        <td class="text-center py-4 px-6 border-b border-gray-200">MSI</td>
                        <td class="text-center py-4 px-6 border-b border-gray-200 truncate">Modern 14 B11MOU</td>
                        <td class="py-4 px-6  border-b border-gray-200">
                            <RouterLink to="" class="inline-block">
                                <button
                                    class=" border border-white bg-green-500 items-center text-white hover:text-green-500 hover:bg-white hover:border-green-500 duration-500 flex rounded-full p-1 space-x-1 px-3">
                                    <span>Details</span>
                                </button>
                            </RouterLink>
                        </td>
                    </tr>
                    <tr>
                        <td class="text-center py-4 px-6 border-b border-gray-200">Pablo</td>
                        <td class="text-center py-4 px-6 border-b border-gray-200">Lenovo</td>
                        <td class="text-center py-4 px-6 border-b border-gray-200 truncate">Yoga Pro 7</td>
                        <td class="py-4 px-6 border-b border-gray-200">
                            <RouterLink to="" class="inline-block">
                                <button
                                    class=" border border-white bg-green-500 items-center text-white hover:text-green-500 hover:bg-white hover:border-green-500 duration-500 flex rounded-full p-1 space-x-1 px-3">
                                    <span>Details</span>
                                </button>
                            </RouterLink>
                        </td>
                    </tr>
                    <!-- Add more rows here -->
                </tbody>
            </table>
        </div>
    </div>
</template>