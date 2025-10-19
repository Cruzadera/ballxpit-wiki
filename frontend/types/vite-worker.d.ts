interface Worker {
  postMessage(message: any, transfer?: any[]): void;
  terminate(): void;
  onmessage: ((this: Worker, ev: MessageEvent) => any) | null;
  onmessageerror: ((this: Worker, ev: MessageEvent) => any) | null;
}
