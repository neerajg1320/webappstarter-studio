export interface ServerObject {
  id: string,
  pkid: number,
  synced: boolean
}

export interface ServerObjectPartial {
  id?: string,
  pkid?: number,
  synced?: boolean
}