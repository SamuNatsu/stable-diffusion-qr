<script lang="ts" setup>
import { useWindowScroll } from '@vueuse/core';

// Components
import { ArrowUpIcon } from '@heroicons/vue/24/outline';
import { ComputedRef, computed } from 'vue';

// Injects
const { y: windowScrollY } = useWindowScroll();

// Computed
const showGotoTop: ComputedRef<boolean> = computed((): boolean => {
  return windowScrollY.value > 200;
});

// Actions
function gotoTop(): void {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}
</script>

<template>
  <div class="bottom-4 fixed flex flex-col gap-4 right-4 md:bottom-[20vh] md:right-[10%]">
    <button v-if="showGotoTop" @click="gotoTop" title="回到顶部">
      <ArrowUpIcon class="h-8 w-8"/>
    </button>
  </div>
</template>

<style scoped>
button {
  @apply
    bg-blue-300
    flex items-center justify-center
    h-16 w-16
    rounded-full
    text-white
    transition-colors
    hover:bg-blue-400
}
</style>
