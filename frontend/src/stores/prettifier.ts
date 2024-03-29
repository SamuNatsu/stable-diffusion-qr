/// Prettifier store
import { createGlobalState } from '@vueuse/core';
import { ComputedRef, Ref, computed, ref, watch, watchEffect } from 'vue';
import qrcode from 'qrcode';
import { useInfoStore } from './info';
import type { BrowserQRCodeReader } from '@zxing/browser';

// Async module
let QRCodeReader: typeof BrowserQRCodeReader | null = null;

// Export store
export const usePrettifierStore = createGlobalState(() => {
  // States
  const qrData: Ref<string | null> = ref(null);
  const qrErrLv: Ref<'L' | 'M' | 'Q' | 'H'> = ref('M');
  const qrFrontCol: Ref<string> = ref('#000000');
  const qrBackCol: Ref<string> = ref('#FFFFFF');
  const qrMargin: Ref<number> = ref(4);
  const qrImgDataUrl: Ref<string | null> = ref(null);
  const qrError: Ref<string | null> = ref(null);
  const qrLocked: Ref<boolean> = ref(false);

  const aiPrompt: Ref<string> = ref('');
  const aiUsePrependPrompt: Ref<boolean> = ref(false);
  const aiNegativePrompt: Ref<string> = ref('');
  const aiUsePrependNegativePrompt: Ref<boolean> = ref(true);
  const aiSteps: Ref<number> = ref(20);
  const aiCfgScale: Ref<number> = ref(7);
  const aiSeed: Ref<string> = ref('-1');
  const aiWeight: Ref<number> = ref(1.15);
  const aiMode: Ref<0 | 1 | 2> = ref(0);
  const aiStatus: Ref<'idle' | 'generating'> = ref('idle');
  const aiGenLog: Ref<string> = ref('');
  const aiImgDataUrl: Ref<string | null> = ref(null);
  const aiError: Ref<string | null> = ref(null);

  // Non-reactive
  let qrInputEl: HTMLInputElement | null = null;

  // Computed
  const qrDataSeq: ComputedRef<['t' | 'b', string][] | null> = computed(
    (): ['t' | 'b', string][] | null => {
      if (qrData.value === null) {
        return null;
      }

      const ret: ['t' | 'b', string][] = [['t', '']];
      for (let i = 0; i < qrData.value.length; i++) {
        const code: number = qrData.value.charCodeAt(i);
        if (code >= 32 && code <= 126) {
          ret[ret.length - 1][1] += qrData.value[i];
        } else {
          ret.push(['b', qrData.value[i]]);
          ret.push(['t', '']);
        }
      }

      return ret;
    }
  );

  // Watches
  watchEffect((): void => {
    if (qrData.value === null) {
      return;
    }

    qrImgDataUrl.value = null;
    qrError.value = null;

    qrcode
      .toDataURL(qrData.value, {
        color: { dark: qrFrontCol.value, light: qrBackCol.value },
        errorCorrectionLevel: qrErrLv.value,
        margin: qrMargin.value,
        width: 512
      })
      .then((dataUrl: string): void => {
        qrImgDataUrl.value = dataUrl;
      })
      .catch((err: Error): void => {
        qrError.value = `二维码生成失败<br>${err.message}`;
      });
  });
  watch(aiSeed, (newValue: string): void => {
    newValue = newValue.replace(/\s/g, '');
    if (!/^(-1|0|[1-9]\d*)$/.test(newValue)) {
      aiSeed.value = '-1';
    }
  });

  // Functions
  function logOut(msg: string): void {
    aiGenLog.value += new Date().toISOString() + msg + '\n';
  }
  function logClear(): void {
    aiGenLog.value = '';
  }
  function setError(msg: string): void {
    aiError.value = msg;
    aiStatus.value = 'idle';
  }

  // Actions
  function qrReset(): void {
    qrData.value = null;
    qrErrLv.value = 'M';
    qrFrontCol.value = '#000000';
    qrBackCol.value = '#FFFFFF';
    qrMargin.value = 4;
    qrImgDataUrl.value = null;
    qrError.value = null;
    qrLocked.value = false;

    if (qrInputEl !== null) {
      qrInputEl.value = '';
    }
  }
  function aiReset(): void {
    aiPrompt.value = '';
    aiUsePrependPrompt.value = false;
    aiNegativePrompt.value = '';
    aiUsePrependNegativePrompt.value = true;
    aiSteps.value = 20;
    aiCfgScale.value = 7;
    aiSeed.value = '-1';
    aiWeight.value = 1.15;
    aiMode.value = 0;
  }
  function aiGen(): void {
    const { prependPrompt, prependNegativePrompt } = useInfoStore();

    aiStatus.value = 'generating';
    aiImgDataUrl.value = null;
    aiError.value = null;
    logClear();

    const task: Record<string, any> = {
      data: qrData.value,
      err_lv: qrErrLv.value,
      front_col: qrFrontCol.value,
      back_col: qrBackCol.value,
      margin: qrMargin.value,
      prompt:
        (aiUsePrependPrompt.value ? prependPrompt.value + ',' : '') +
        aiPrompt.value,
      negative_prompt:
        (aiUsePrependNegativePrompt.value
          ? prependNegativePrompt.value + ','
          : '') + aiNegativePrompt.value,
      steps: aiSteps.value,
      cfg_scale: aiCfgScale.value,
      seed: aiSeed.value,
      weight: aiWeight.value,
      mode: aiMode.value
    };

    const source: EventSource = new EventSource('/api/sse');
    let sid: string;
    let serial: number;

    source.addEventListener('open', (): void => {
      logOut('服务器已连接');
    });
    source.addEventListener('error', (): void => {
      source.close();
      logOut('SourceEvent 出错');
      setError('服务器连接出错，请联系管理员');
    });
    source.addEventListener('session', (ev: MessageEvent): void => {
      sid = JSON.parse(ev.data);
      logOut(`会话已生成，ID 为 ${sid}`);

      task.sid = sid;
      fetch('/api/compose', {
        method: 'POST',
        headers: new Headers({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(task)
      })
        .then((res: Response): Promise<any> | undefined => {
          if (res.ok) {
            return;
          }
          logOut('Fetch 出错：' + res.statusText);
          setError(`任务提交失败：${res.statusText}`);
        })
        .catch((err: Error): void => {
          logOut('Fetch 出错：' + err.message);
          setError('任务请求发送失败，请联系管理员');
        });
    });
    source.addEventListener('serial', (ev: MessageEvent): void => {
      serial = JSON.parse(ev.data);
      logOut(`任务提交成功，流水号：${serial}`);
    });
    source.addEventListener('queue', (ev: MessageEvent): void => {
      const queue: number = JSON.parse(ev.data);
      if (queue === serial) {
        logOut('正在生成');
      } else {
        logOut(`正在排队，目前排位：${serial - queue}`);
      }
    });
    source.addEventListener('fail', (ev: MessageEvent): void => {
      const msg: string = JSON.parse(ev.data);
      switch (msg) {
        case 'generate':
          setError('生成出错，请联系管理员');
          break;
        case 'api':
          setError('Stable Diffusion 访问异常，请联系管理员');
          break;
        case 'queue':
          setError('合成队列已满，请稍等片刻');
          break;
      }
      source.close();
    });
    source.addEventListener('done', async (ev: MessageEvent): Promise<void> => {
      source.close();
      logOut('合成完毕');

      const data: Record<string, any> = JSON.parse(ev.data);
      aiImgDataUrl.value = 'data:image/png;base64,' + data.images[0];
      aiStatus.value = 'idle';
    });
  }
  function onChange(ev: Event): void {
    if (qrInputEl === null) {
      qrInputEl = ev.target as HTMLInputElement;
    }

    qrData.value = null;
    qrImgDataUrl.value = null;
    qrError.value = null;

    const fileReader: FileReader = new FileReader();
    fileReader.addEventListener('load', async (): Promise<void> => {
      // Check async module loaded
      if (QRCodeReader === null) {
        try {
          const module = await import('@zxing/browser');
          QRCodeReader = module.BrowserQRCodeReader;
        } catch (err: unknown) {
          console.error(err);
          qrError.value = '二维码识别模块加载失败';
          return;
        }
      }

      // Recognize QR code
      new QRCodeReader()
        .decodeFromImageUrl(fileReader.result as string)
        .then((res: any): void => {
          qrData.value = res.getText();
        })
        .catch((err: any): void => {
          qrError.value = `二维码识别失败<br>${err.getKind()}`;
        });
    });
    fileReader.addEventListener('error', (): void => {
      qrError.value = `图片读取失败<br>${fileReader.error?.message}`;
    });
    fileReader.readAsDataURL(qrInputEl.files?.[0] as File);
  }
  function download(): void {
    const el: HTMLAnchorElement = document.createElement('a');
    el.href = aiImgDataUrl.value as string;
    el.download = 'QR.png';
    el.click();
  }

  // Return store
  return {
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
  };
});
