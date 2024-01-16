<script lang="ts" setup>
// Layouts
import MainContainer from '@/layouts/MainContainer.vue';
</script>

<template>
  <MainContainer>
    <section>
      <h1>什么是 Stable Diffusion QR</h1>
      <p>Stable Diffusion QR <b>(SDQR)</b> 是一个 <b>个性化二维码生成器 + 美化器</b>，在这里你可以生成普通的二维码，并使用 Stable Diffusion 提供的强大功能美化二维码。</p>
      <p>如果你只希望借助 Stable Diffusion 美化二维码，当然可以！只需要上传你的二维码，然后动动手指即可。</p>
      <p>通过 <b>ControlNet</b> 技术，我们能够把 AI 图片自然地融合在二维码中，让你的二维码在茫茫一片黑白配色之中脱颖而出。</p>
    </section>
    <section>
      <h1>生成器使用步骤</h1>
      <p>1. 在 <b>原始二维码生成</b> 部分填写参数，原始二维码会自动生成</p>
      <p>2. 点击 <b>锁定</b> 将二维码锁定</p>
      <p>3. 在 <b>美化合成</b> 部分填写 AI 参数，点击 <b>开始合成</b> 按钮</p>
      <p>4. 等待片刻后，你能得到一张美化的二维码</p>
    </section>
    <section>
      <h1>美化器使用步骤</h1>
      <p>1. 将你需要美化的二维码上传在 <b>二维码预处理</b> 部分，并调整相关参数，得到一张原始二维码</p>
      <p>2. 点击 <b>锁定</b> 将二维码锁定</p>
      <p>3. 在 <b>美化合成</b> 部分填写 AI 参数，点击 <b>开始合成</b> 按钮</p>
      <p>4. 等待片刻后，你能得到一张美化的二维码</p>
    </section>
    <section>
      <h1>关于</h1>
      <p>你可以在 <b>系统信息</b> 处查看 SDQR 的相关信息，这里提供了一些有用的信息，可以帮助你生成更好的二维码。</p>
      <p>SDQR 使用 <a href="https://vuejs.org/" target="_blank">Vue3</a> 制作前端，使用  <a href="https://expressjs.com/" target="_blank">Express.js</a> 作为后端，使用 <a href="https://github.com/AUTOMATIC1111/stable-diffusion-webui" target="_blank">SD-WebUI</a> 作为 AI 图片生成后端。</p>
      <p>SDQR 由 <a href="https://github.com/SamuNatsu" target="_blank">SNRainiar</a> 制作，非常感谢您的使用。</p>
    </section>
  </MainContainer>
</template>

<style scoped>
section {
  @apply flex flex-col gap-2
}

h1 {
  @apply
    border-b-2 border-b-blue-400
    font-bold
    mb-2
    text-3xl text-blue-500
}

a {
  @apply text-blue-500 transition-colors hover:text-red-500
}
</style>
