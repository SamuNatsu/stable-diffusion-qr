<script lang="ts" setup>
import { useInfoStore } from './stores/info';

// Components
import NavHeader from '@/components/NavHeader.vue';
import SideBtnSet from './components/SideBtnSet.vue';
import SiteFooter from './components/SiteFooter.vue';
import { onBeforeMount } from 'vue';

// Injects
const { fetchInfo } = useInfoStore();

// Lifecycle
onBeforeMount((): void => {
  fetchInfo();
});
</script>

<template>
  <NavHeader/>
  <RouterView/>
  <SideBtnSet/>
  <SiteFooter/>
</template>
