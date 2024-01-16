<script lang="ts" setup>
import { useInfoStore } from '@/stores/info';

// Layouts
import DoubleColumn from '@/layouts/DoubleColumn.vue';
import MainContainer from '@/layouts/MainContainer.vue';
import SubSection from '@/layouts/SubSection.vue';

// Conponents
import Spin from '@/components/Spin.vue';
import { MegaphoneIcon } from '@heroicons/vue/24/outline';

// Injects
const {
  readyStatus,

  providerName,
  providerContact,
  notification,
  maxQueueLen,

  modelName,
  modelUrl,
  ctrlModelName,
  ctrlModelUrl,
  prependPrompt,
  prependNegativePrompt,
  sampler,
  basicSize
} = useInfoStore();
</script>

<template>
  <MainContainer
    v-if="readyStatus !== 'ok'"
    class="items-center justify-center">
    <Spin v-if="readyStatus === 'fetch'"></Spin>
    <div v-else class="text-center text-red-500">
      <h1 class="font-bold text-2xl">无法获取系统信息</h1>
      <p>请联系管理员获取帮助</p>
    </div>
  </MainContainer>
  <MainContainer v-else>
    <div v-if="notification !== null" class="notification">
      <div class="flex gap-1 items-center">
        <MegaphoneIcon class="h-8 text-blue-500 w-8"/>
        <h1 class="font-bold text-xl transition-colors dark:text-white">
          公告
        </h1>
      </div>
      <pre>{{ notification }}</pre>
    </div>
    <DoubleColumn lr-class="gap-8">
      <template #left>
        <SubSection title="服务供应方">
          <p>{{ providerName }}</p>
        </SubSection>
        <SubSection v-if="providerContact !== null" title="联系方式">
          <p>{{ providerContact }}</p>
        </SubSection>
        <SubSection title="服务队列长度">
          <p>{{ maxQueueLen }}</p>
        </SubSection>
        <SubSection title="Diffusion 模型">
          <a v-if="modelUrl !== null" :href="modelUrl" target="_blank">
            {{ modelName }}
          </a>
          <p v-else>{{ modelName }}</p>
        </SubSection>
        <SubSection title="ControlNet 模型">
          <a
            v-if="ctrlModelUrl !== null"
            :href="ctrlModelUrl"
            target="_blank">
            {{ ctrlModelName }}
          </a>
          <p v-else>{{ ctrlModelName }}</p>
        </SubSection>
      </template>
      <template #right>
        <SubSection title="预置正向提示词">
          <p
            v-if="prependPrompt.trim().length === 0"
            class=" italic text-neutral-400">
            空
          </p>
          <p v-else>{{ prependPrompt }}</p>
        </SubSection>
        <SubSection title="预置负向提示词">
          <p
            v-if="prependNegativePrompt.trim().length === 0"
            class=" italic text-neutral-400">
            空
          </p>
          <p v-else>{{ prependNegativePrompt }}</p>
        </SubSection>
        <SubSection title="基础图片尺寸">
          <p>{{ basicSize }} px</p>
        </SubSection>
        <SubSection title="采样器">
          <p>{{ sampler }}</p>
        </SubSection>
      </template>
    </DoubleColumn>
  </MainContainer>
</template>

<style scoped>
a {
  @apply
    break-all
    w-fit
    hover:text-red-500
}

pre {
  @apply
    font-sans
    mt-2
    text-black
    text-wrap
}

.notification {
  @apply
    bg-blue-50
    border-4 border-blue-300
    p-4
    rounded-lg
    w-full
}
</style>
