export type IframeMessage = {
  type: 'log' | 'error' | 'init' | 'code',
  source: 'iframe' | 'main',
  content: any[] | string | TypeError,
}