export type IframeMessage = {
  source: 'iframe' | 'main',
  sourceId?: string,
  type: 'log' | 'error' | 'init' | 'code',
  content: any | TypeError,
}

export const debugWindowEvent = (event:MessageEvent) => {
  console.log(event);
}