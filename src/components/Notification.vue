<template>
    <div v-if="message && type != 'failed'"
        :class="`fixed w-fit flex items-center z-50 md:top-0 -top-0 md:right-0 right-32 m-2 bg-green-500 bg-opacity-90 text-white px-4 py-2 rounded-lg ease-in-out transition-all duration-75`">
        <IconCheck class="w-5 h-5 mr-2" /> {{ message }}
        <!-- <component :is="getComponentName()" class="w-5 h-5 mr-2" /> {{ message }} -->
    </div>
    <div v-else
        :class="`fixed w-fit flex items-center z-50 md:top-0 -top-0 md:right-0 right-32 m-2 bg-red-500 bg-opacity-90 text-white px-4 py-2 rounded-lg ease-in-out transition-all duration-75`">
        <IconFalse class="w-5 h-5 mr-2" /> {{ message }}
    </div>
</template>

<script setup>
import IconFalse from '@/components/icons/IconFalse.vue';
import IconCheck from './icons/IconCheck.vue';


defineProps({
    type: String,
    message: String
});
</script>