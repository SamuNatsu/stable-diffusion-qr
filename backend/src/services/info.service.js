/// Info service module
import { sd, sys } from '@/configs/index';

// Get info
export function getInfo() {
  return {
    sd: { ...sd, API: undefined },
    sys
  };
}
