<script lang="ts" setup>
// Non-reactive
const version: string = __APP_VERSION__;
</script>

<template>
  <header class="bg-blue-500 flex flex-col gap-2 pt-4 px-8 text-white">
    <div class="flex gap-4 items-baseline">
      <h1 class="font-bold text-2xl">Stable Diffusion QR</h1>
      <span class="hidden sm:block">v{{ version }}</span>
    </div>
    <nav class="flex gap-4 items-center overflow-x-auto">
      <RouterLink to="/">首页</RouterLink>
      <RouterLink to="/info">系统信息</RouterLink>
      <RouterLink to="/generator">生成器</RouterLink>
      <RouterLink to="/prettifier">美化器</RouterLink>
    </nav>
  </header>
</template>

<style scoped>
a {
  @apply
    border-2 border-transparent
    block
    pb-[calc(0.25rem-2px)] pt-1 px-4
    rounded-t-lg
    transition-colors
    whitespace-nowrap
    hover:border-blue-500
    hover:bg-white
    hover:text-blue-500
}

.router-link-active {
  @apply
    !bg-white
    !border-transparent
    !text-blue-500
}
</style>
