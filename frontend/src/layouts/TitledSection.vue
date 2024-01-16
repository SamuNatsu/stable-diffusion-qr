<script lang="ts" setup>
// Properties
defineProps<{
  title: string;
}>();
</script>

<template>
  <section class="flex flex-col gap-2">
    <h1>{{ title }}</h1>
    <slot></slot>
  </section>
</template>

<style scoped>
h1 {
  @apply
    border-b-2 border-b-blue-400
    font-bold
    mb-2
    text-3xl text-blue-500
}
</style>
