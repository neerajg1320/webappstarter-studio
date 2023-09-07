import React from "react";

export interface KeyValueRepresentationComponentProps {
  value: any;
  keyName?: string|number;
  parentType: string;
  expanded?: boolean;
  onClick?: (keyName:string|number) => void
}


export type TraversalFunc = (value:any) => [string|number, any][];

export type ItemInfo = {
  type:string,
  component:React.FC<KeyValueRepresentationComponentProps>
  isRecursive:boolean,
  traversalFunc: TraversalFunc|null,
  enclosingClass: string|null,
};

export type GetItemInfoFunc = (value:any) => ItemInfo;


export const ObjectTraversalFunc:TraversalFunc = (value) => {
  return Object.entries(value);
}

export const ArrayTraversalFunc:TraversalFunc = (value):[number,any][] => {
  return value.map((item:any, index:number) => {
    return [index, item];
  });
}
