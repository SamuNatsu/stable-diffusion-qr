/// Info store
import { createGlobalState } from '@vueuse/core';
import { Ref, ref } from 'vue';
import { usePrettifierStore } from './prettifier';

// Export store
export const useInfoStore = createGlobalState(() => {
  // Injects
  const { aiPrompt, aiNegativePrompt } = usePrettifierStore();

  // States
  const readyStatus: Ref<'fetch' | 'ok' | 'fail'> = ref('fetch');

  const providerName: Ref<string> = ref('');
  const providerContact: Ref<string | null> = ref(null);
  const notification: Ref<string | null> = ref(null);
  const maxQueueLen: Ref<number> = ref(1);

  const modelName: Ref<string> = ref('');
  const modelUrl: Ref<string | null> = ref(null);
  const ctrlModelName: Ref<string> = ref('');
  const ctrlModelUrl: Ref<string | null> = ref(null);
  const prependPrompt: Ref<string> = ref('');
  const prependNegativePrompt: Ref<string> = ref('');
  const sampler: Ref<string> = ref('');
  const basicSize: Ref<number> = ref(768);
  const allowHr: Ref<boolean> = ref(false);
  const hrUpscaler: Ref<string | null> = ref(null);

  // Actions
  function fetchInfo(): void {
    fetch('/api/info')
      .then((res: Response): Promise<any> | undefined => {
        if (res.ok) {
          return res.json();
        }

        // Fetch fail
        console.error('[Core] Fail to fetch info');
        console.error(res);
        readyStatus.value = 'fail';
      })
      .then((data: any): void => {
        if (data === undefined) {
          return;
        }

        // Fetch success
        providerName.value = data.sys.PROVIDER_NAME;
        providerContact.value = data.sys.PROVIDER_CONTACT;
        notification.value = data.sys.NOTIFICATION;
        maxQueueLen.value = data.sys.MAX_QUEUE_LEN;

        modelName.value = data.sd.MODEL_NAME;
        modelUrl.value = data.sd.MODEL_URL;
        ctrlModelName.value = data.sd.CTRL_MODEL_NAME;
        ctrlModelUrl.value = data.sd.CTRL_MODEL_URL;
        prependPrompt.value = data.sd.PREPEND_PROMPT;
        prependNegativePrompt.value = data.sd.PREPEND_NEGATIVE_PROMPT;
        sampler.value = data.sd.SAMPLER;
        basicSize.value = data.sd.BASIC_SIZE;
        allowHr.value = data.sd.ALLOW_HR;
        hrUpscaler.value = data.sd.HR_UPSCALER;

        readyStatus.value = 'ok';

        aiPrompt.value = prependPrompt.value;
        aiNegativePrompt.value = prependNegativePrompt.value;
      })
      .catch((err: unknown): void => {
        console.error('[Core] Fail to query info');
        console.error(err);
        readyStatus.value = 'fail';
      });
  }

  // Return store
  return {
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
    basicSize,
    allowHr,
    hrUpscaler,

    fetchInfo
  };
});
