export enum ApiFlowOperation {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
}

export enum ApiFlowResource {
  USER = 'user',
  PROJECT = 'project',
  FILE = 'file'
}

export const stringToApiFlowOperation = (apiFlowOperationStr:string): ApiFlowOperation => {
  return ApiFlowOperation[apiFlowOperationStr as keyof typeof ApiFlowOperation];
}

export interface ApiRequestStart {
  id: string,
  resource: ApiFlowResource
  operation: ApiFlowOperation
}

export interface ApiRequestSuccess {
  id: string,
  messages: string[]
}

export interface ApiRequestFailed {
  id: string,
  errors: string[]
}

export interface ApiFlowState {
  resource: ApiFlowOperation;
  operation: ApiFlowOperation;
  requestStarted: boolean;
  requestCompleted: boolean;
  message: string|null;
  error: string|null;
}