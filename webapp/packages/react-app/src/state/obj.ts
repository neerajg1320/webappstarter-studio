export interface ServerObject {
  id: string,
  pkid: number,
  synced: boolean,
  isServerResponse: boolean,
  deleteMarked: boolean,
  requestInitiated: boolean,
}

export interface ServerObjectPartial {
  id?: string,
  pkid?: number,
  synced?: boolean,
  isServerResponse?: boolean,
  deleteMarked?: boolean,
  requestInitiated?: boolean,
}