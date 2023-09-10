export interface ServerObject {
  id: string,
  pkid: number,
  // This confirms creation on frontend. It is used when from create resource page we successfully create.
  confirmed: boolean
  // This confirms that the state on the frontend and the server is same, i.e. the server has confirmed saving changes
  synced: boolean,
  isServerResponse: boolean,
  deleteMarked: boolean,
  requestInitiated: boolean,
}

export interface ServerObjectPartial {
  id?: string,
  pkid?: number,
  confirmed?: boolean
  synced?: boolean,
  isServerResponse?: boolean,
  deleteMarked?: boolean,
  requestInitiated?: boolean,
}