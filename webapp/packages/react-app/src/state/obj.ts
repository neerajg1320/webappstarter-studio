export interface ServerObject {
  id: string,
  pkid: number,
  synced: boolean,
  serverUpdate: boolean,
}

export interface ServerObjectPartial {
  id?: string,
  pkid?: number,
  synced?: boolean,
  serverUpdate?: boolean,
}