import React from "react";

export interface KeyValueRepresentationComponentProps {
  // itemInfo: ItemInfo;
  value:any;
  keyName?: string|number|null;
  parentType: string|null;
  expanded?: boolean;
  onClick?: (keyName:string|number) => void
}


export type TraversalFunc = (value:any) => [string|number, any][];

export type ItemInfo = {
  value:any;
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
