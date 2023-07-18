export interface ServerObject {
  id: string,
  pkid: number,
  synced: boolean,
  isServerResponse: boolean,
  requestInitiated: boolean,
}

export interface ServerObjectPartial {
  id?: string,
  pkid?: number,
  synced?: boolean,
  isServerResponse?: boolean,
  requestInitiated?: boolean,
}