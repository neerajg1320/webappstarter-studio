import React from "react";

export type ItemClickFunc = (keyName:string|number|null, itemInfo:ItemInfo) => void;
export interface KeyValueRepresentationComponentProps {
  treeName: string;
  itemInfo: ItemInfo;
  keyName?: string|number|null;
  parentInfo: ItemInfo|null;
  expanded?: boolean;
  level: number;
  onClick?: ItemClickFunc;
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
