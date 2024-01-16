<script lang="ts" setup>
// Properties
defineProps<{
  title?: string;
  tClass?: string;
}>();
</script>

<template>
  <div class="flex flex-col gap-2">
    <template v-if="title === undefined">
      <div class="flex items-baseline gap-4" :class="tClass">
        <slot name="title"></slot>
      </div>
      <slot name="contents"></slot>
    </template>
    <template v-else>
      <h2 class="font-bold text-xl">{{ title }}</h2>
      <slot></slot>
    </template>
  </div>
</template>
