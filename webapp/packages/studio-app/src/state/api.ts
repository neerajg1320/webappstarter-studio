export enum ApiFlowOperation {
  GET = 'get',
  POST = 'post',
  PUT = 'put',
  PATCH = 'patch',
  DELETE = 'delete',
  UNKNOWN = 'unknown',
}

export enum ApiFlowResource {
  USER = 'user',
  PROJECT = 'project',
  FILE = 'file',
  UNKNOWN = 'unknown',
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
  resource: ApiFlowResource;
  operation: ApiFlowOperation;
  requestStarted: boolean;
  requestCompleted: boolean;
  message: string|null;
  error: string|null;
}