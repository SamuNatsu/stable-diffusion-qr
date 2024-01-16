<script lang="ts" setup>
import { usePrettifierStore } from '@/stores/prettifier';

// Layouts
import MainContainer from '@/layouts/MainContainer.vue';
import TitledSection from '@/layouts/TitledSection.vue';
import DoubleColumn from '@/layouts/DoubleColumn.vue';
import SubSection from '@/layouts/SubSection.vue';

// Components
import { PaperClipIcon, XCircleIcon } from '@heroicons/vue/24/outline';
import RangeInput from '@/components/RangeInput.vue';
import Spin from '@/components/Spin.vue';

// Injects
const {
  qrData,
  qrErrLv,
  qrFrontCol,
  qrBackCol,
  qrMargin,
  qrImgDataUrl,
  qrError,
  qrLocked,

  aiPrompt,
  aiUsePrependPrompt,
  aiNegativePrompt,
  aiUsePrependNegativePrompt,
  aiSteps,
  aiCfgScale,
  aiSeed,
  aiWeight,
  aiMode,
  aiStatus,
  aiGenLog,
  aiImgDataUrl,
  aiError,

  qrDataSeq,

  qrReset,
  aiReset,
  aiGen,
  onChange,
  download
} = usePrettifierStore();
</script>

<template>
  <MainContainer>
    <TitledSection title="二维码预处理">
      <DoubleColumn r-class="font-bold self-center text-lg">
        <template #left>
          <SubSection title="图片上传">
            <input
              @change="onChange"
              accept="image/*"
              class="qr-upload-input"
              :disabled="qrLocked"
              type="file">
            <p>可以使用任意浏览器支持的图片格式</p>
          </SubSection>
          <SubSection title="纠错等级">
            <select v-model="qrErrLv" class="qr-err-lv">
              <option value="L">L ~7%  小尺寸</option>
              <option value="M">M ~15% 标准</option>
              <option value="Q">Q ~25% 高可靠</option>
              <option value="H">H ~30% 最高可靠</option>
            </select>
            <p>若识别效果不好，可以适当调大纠错等级</p>
          </SubSection>
          <SubSection title="二维码色彩">
            <DoubleColumn
              class="!flex-row my-2"
              lr-class="!flex-row items-center justify-center">
              <template #left>
                <h3>前景</h3>
                <input
                  v-model.lazy="qrFrontCol"
                  :disabled="qrLocked"
                  type="color">
              </template>
              <template #right>
                <h3>背景</h3>
                <input
                  v-model.lazy="qrBackCol"
                  :disabled="qrLocked"
                  type="color">
              </template>
            </DoubleColumn>
            <p>前景色必须比背景色更深以保证识别准确度</p>
          </SubSection>
          <SubSection title="边缘留白">
            <RangeInput
              v-model="qrMargin"
              :disabled="qrLocked"
              :min="1"
              :max="20"
              :step="1"/>
            <p>更大的边缘留白可以给 AI 图片发挥的空间，当然对应的二维码识别区域会变小</p>
          </SubSection>
          <SubSection v-if="qrData !== null" title="解码数据">
            <div class="qr-data-seq">
              <template v-for="i in qrDataSeq">
                <span v-if="i[0] === 't'">{{ i[1] }}</span>
                <span v-else class="qr-data-bin">0x{{ i[1].charCodeAt(0).toString(16).toUpperCase().padStart(2, '0') }}</span>
              </template>
            </div>
          </SubSection>
          <hr>
          <DoubleColumn>
            <template #left>
              <button @click="qrReset" :disabled="qrLocked">重置</button>
            </template>
            <template #right>
              <button
                @click="qrLocked = !qrLocked"
                :disabled="qrData === null">
                {{ qrLocked ? '解锁' : '锁定'}}
              </button>
            </template>
          </DoubleColumn>
        </template>
        <template #right>
          <img
            v-if="qrImgDataUrl !== null"
            class="mx-auto w-2/3"
            draggable="false"
            :src="qrImgDataUrl">
          <div
            v-else-if="qrError !== null"
            class="flex flex-col gap-2 items-center text-center text-red-500">
            <XCircleIcon class="h-12 w-12"/>
            <span v-html="qrError"></span>
          </div>
          <h2
            v-else
            class="font-bold my-12 text-xl text-center text-neutral-300">
            请上传文件
          </h2>
        </template>
      </DoubleColumn>
    </TitledSection>
    <TitledSection title="美化合成">
      <h2
        v-if="qrData === null || !qrLocked"
        class="font-bold my-12 text-xl text-center text-neutral-300">
        {{ qrData === null ? '请上传二维码' : '请锁定原始二维码' }}
      </h2>
      <DoubleColumn v-else>
        <template #left>
          <SubSection t-class="!gap-2 !items-center">
            <template #title>
              <h2 class="font-bold text-xl">正向提示词</h2>
              <span
                @click="aiUsePrependPrompt = !aiUsePrependPrompt"
                class="cursor-pointer"
                :class="aiUsePrependPrompt ? 'text-green-500' : 'text-red-500'"
                :title="aiUsePrependPrompt ? '点击不使用预置提示词' : '点击使用预置提示词'">
                <PaperClipIcon class="h-5 w-5"/>
              </span>
            </template>
            <template #contents>
              <textarea
                v-model="aiPrompt"
                placeholder="在此输入你希望在图中出现的元素"></textarea>
            </template>
          </SubSection>
          <SubSection t-class="!gap-2 !items-center">
            <template #title>
              <h2 class="font-bold text-xl">负向提示词</h2>
              <span
                @click="aiUsePrependNegativePrompt = !aiUsePrependNegativePrompt"
                class="cursor-pointer"
                :class="aiUsePrependNegativePrompt ? 'text-green-500' : 'text-red-500'"
                :title="aiUsePrependNegativePrompt ? '点击不使用预置提示词' : '点击使用预置提示词'">
                <PaperClipIcon class="h-5 w-5"/>
              </span>
            </template>
            <template #contents>
              <textarea
                v-model="aiNegativePrompt"
                placeholder="在此输入你不希望在图中出现的元素"></textarea>
            </template>
          </SubSection>
          <SubSection title="种子">
            <input v-model.lazy="aiSeed" type="text">
            <p>使用 -1 表示随机种子</p>
          </SubSection>
          <SubSection title="采样迭代步数">
            <RangeInput v-model="aiSteps" :min="1" :max="100" :step="1"/>
            <p>数值越大，生成效果越好，耗时越长</p>
          </SubSection>
          <SubSection title="提示词相关性">
            <RangeInput v-model="aiCfgScale" :min="1" :max="20" :step="1"/>
            <p>数值越大，关键词之间的权重差异越大</p>
          </SubSection>
        </template>
        <template #right>
          <SubSection title="合成权重">
            <RangeInput
              v-model="aiWeight"
              :min="0"
              :max="2"
              :step="0.01"/>
            <p>数值越大，二维码越明显</p>
          </SubSection>
          <SubSection title="合成模式">
            <select v-model="aiMode">
              <option :value="0">平衡</option>
              <option :value="1">以 AI 图片为主</option>
              <option :value="2">以二维码为主</option>
            </select>
          </SubSection>
          <hr>
          <DoubleColumn>
            <template #left>
              <button @click="aiReset">重置</button>
            </template>
            <template #right>
              <button @click="aiGen" :disabled="aiStatus === 'generating'">
                {{ aiStatus === 'idle' ? '开始合成' : '正在合成' }}
              </button>
            </template>
          </DoubleColumn>
          <hr>
          <template v-if="aiImgDataUrl !== null">
            <img class="mx-auto w-5/6" draggable="false" :src="aiImgDataUrl">
            <button @click="download">下载</button>
          </template>
          <div
            v-else-if="aiError !== null"
            class="flex flex-col gap-2 items-center text-center text-red-500">
            <XCircleIcon class="h-12 w-12"/>
            <span v-html="aiError"></span>
          </div>
          <Spin v-else-if="aiStatus === 'generating'" class="mx-auto"/>
          <template
            v-if="aiStatus === 'generating' || aiImgDataUrl !== null || aiError !== null">
            <hr>
            <pre>{{ aiGenLog }}</pre>
          </template>
        </template>
      </DoubleColumn>
    </TitledSection>
  </MainContainer>
</template>

<style scoped>
p {
  @apply text-neutral-400 text-sm
}

textarea {
  @apply
    border-2 border-blue-300
    h-[20vh]
    outline-none
    p-2
    resize-none
    transition-colors
    focus:border-blue-400
}

input[type="text"] {
  @apply
    bg-transparent
    border-2 border-blue-300
    outline-none
    p-1
    transition-colors
    focus:border-blue-400
}

button {
  @apply
    bg-blue-200
    font-bold
    p-4
    rounded-xl
    transition-colors
    disabled:!bg-neutral-300
    disabled:!text-neutral-500
    hover:bg-blue-400
    hover:text-white
}

.qr-upload-input {
  @apply
    cursor-pointer
    border border-neutral-300
    leading-[2.15]
    px-3 py-[0.32rem]
    rounded
    text-neutral-700
    transition-colors
    w-full
    file:bg-neutral-200
    file:[border-inline-end-width:1px]
    file:border-none
    file:cursor-pointer
    file:[margin-inline-end:0.75rem]
    file:-mx-3 file:-my-[0.32rem]
    file:px-3 file:py-[0.32rem]
    file:text-neutral-700
    file:transition-colors
    hover:file:bg-neutral-300
}

.qr-err-lv {
  @apply
    border-2 border-blue-300
    outline-none
    p-1
    transition-colors
    focus:border-blue-400
}

.qr-data-seq {
  @apply
    border-2 border-dashed
    break-all
    font-mono
    max-h-[20vh]
    overflow-y-auto
    p-2
}

.qr-data-bin {
  @apply
    bg-red-500
    mx-1 p-1
    rounded
    text-sm text-white
}

.ai-gen-log {
  @apply
    break-all
    font-sans
    text-neutral-400 text-sm
}
</style>
