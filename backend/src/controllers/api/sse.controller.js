/// API SSE controller module
import { handleConnection } from '@/services/sse.service';

// Export module
export default function (req, res) {
  handleConnection(req, res);
}
