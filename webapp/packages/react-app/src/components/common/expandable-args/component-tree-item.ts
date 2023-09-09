import React from "react";

export type ItemKeyType = string|number|null|undefined;
export type ItemClickFunc = (keyName:ItemKeyType, itemInfo:ItemInfoType) => void;
export type ItemEventFunc = () => void;

export interface KeyValueRepresentationComponentProps {
  treeName: string;
  itemInfo: ItemInfoType;
  keyName?: string|number|null;
  parentInfo: ItemInfoType|null;
  expanded?: boolean;
  level: number;
  onClick?: ItemClickFunc;
}


export type TraversalFunc = (value:any) => [string|number, any][];

export type ItemInfoType = {
  value:any;
  type:string,
  component:React.FC<KeyValueRepresentationComponentProps>
  isRecursive:boolean,
  traversalFunc: TraversalFunc|null,
  enclosingClass: string|null,
};

export type GetItemInfoFunc = (value:any) => ItemInfoType;


export const ObjectTraversalFunc:TraversalFunc = (value) => {
  return Object.entries(value);
}

export const ArrayTraversalFunc:TraversalFunc = (value):[number,any][] => {
  return value.map((item:any, index:number) => {
    return [index, item];
  });
}
