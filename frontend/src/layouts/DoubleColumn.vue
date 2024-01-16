<script lang="ts" setup>
// Properties
defineProps<{
  lClass?: string;
  rClass?: string;
  lrClass?: string;
}>();
</script>

<template>
  <div class="flex flex-col gap-4 sm:flex-row">
    <div class="flex flex-col gap-4 w-full sm:w-1/2" :class="[lrClass, lClass]">
      <slot name="left"></slot>
    </div>
    <div class="flex flex-col gap-4 w-full sm:w-1/2" :class="[lrClass, rClass]">
      <slot name="right"></slot>
    </div>
  </div>
</template>
