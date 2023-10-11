export type IframeMessage = {
  source: 'iframe' | 'main',
  sourceId?: string, // currently not used
  type: 'log' | 'error' | 'init' | 'code',
  content: any | TypeError,
}

export const debugWindowEvent = (event:MessageEvent) => {
  console.log(event);
}