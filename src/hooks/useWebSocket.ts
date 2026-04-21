import { useEffect, useRef, useCallback } from 'react';

export const useWebSocket = (onMessage: (data: any) => void, enabled = false) => {
  const wsRef = useRef<WebSocket | null>(null);

  const connect = useCallback(() => {
    if (!enabled) return;
    try {
      const ws = new WebSocket('ws://localhost:8000/ws');
      ws.onopen = () => console.log('[WS] Connected');
      ws.onmessage = (e) => {
        try { onMessage(JSON.parse(e.data)); } catch {}
      };
      ws.onclose = () => {
        console.log('[WS] Disconnected — reconnecting in 3s');
        setTimeout(connect, 3000);
      };
      ws.onerror = (e) => console.error('[WS] Error', e);
      wsRef.current = ws;
    } catch (err) {
      console.log('[WS] Not available (backend offline)');
    }
  }, [onMessage, enabled]);

  useEffect(() => {
    connect();
    return () => wsRef.current?.close();
  }, [connect]);

  const send = (data: any) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(data));
    }
  };

  return { send };
};
