<script lang="ts" setup>
// Properties
defineProps<{
  modelValue: number;
  disabled?: boolean;
  min?: number;
  max?: number;
  step?: number;
}>();

// Emits
defineEmits<{
  (e: 'update:modelValue', newValue: number): void;
}>();
</script>

<template>
  <div class="flex gap-4 items-center">
    <input
      @input="$emit('update:modelValue', parseFloat(($event.target as HTMLInputElement).value))"
      class="w-5/6"
      :disabled="disabled"
      :max="max"
      :min="min"
      :step="step ?? 'any'"
      type="range"
      :value="modelValue">
    <input
      @input="$emit('update:modelValue', parseFloat(($event.target as HTMLInputElement).value))"
      :disabled="disabled"
      :max="max"
      :min="min"
      :step="step ?? 'any'"
      type="number"
      :value="modelValue">
  </div>
</template>

<style scoped>
input::-webkit-inner-spin-button,
input::-webkit-outer-spin-button {
  @apply appearance-none
}

input[type="number"] {
  @apply
    appearance-none
    bg-transparent
    border-2 border-blue-300
    outline-none
    p-1
    transition-colors
    w-1/6
    disabled:border-neutral-300
    disabled:text-neutral-400
    focus:border-blue-400
}
</style>
