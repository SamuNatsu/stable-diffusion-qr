<script lang="ts" setup>
// Non-reactive
const version: string = __APP_VERSION__;
</script>

<template>
  <footer class="bg-blue-500 flex flex-col gap-2 p-4 text-center text-white">
    <p class="font-bold">
      <a
        href="https://github.com/SamuNatsu/stable-diffusion-qr"
        target="_blank">
        Github
      </a>
      ·
      <a
        href="https://rainiar.top"
        target="_blank">
        SNRainiar
      </a>
    </p>
    <p>v{{ version }}</p>
  </footer>
</template>
