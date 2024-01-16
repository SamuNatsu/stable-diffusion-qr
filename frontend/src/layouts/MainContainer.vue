<template>
  <main>
    <slot></slot>
  </main>
</template>

<style scoped>
main {
  @apply
    flex flex-col gap-8
    min-h-[calc(100vh-11rem-2px)]
    mx-auto px-4 py-12
    w-full
    md:w-2/3
}
</style>
