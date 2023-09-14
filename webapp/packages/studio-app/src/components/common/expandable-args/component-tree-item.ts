import React from "react";
import {ReduxFile} from "../../../state";

export type ItemKeyType = string|number|null|undefined;

export type ItemEventType = "change" | "click" | "double-click";

export type ItemDataType = {
  keyName:ItemKeyType,
  itemInfo:ItemInfoType
}

// The ItemEventNameChangeType extends in type is achieved by intersection.
// It has all the members in  ItemDataType
export type ItemEventNameChangeType  = {
  value: string;
} & ItemDataType;

export type ItemEventClickType = ItemDataType;

export type ItemEventDataType = ItemEventNameChangeType | ItemEventClickType;


export type ItemClickFunc = (keyName:ItemKeyType, itemInfo:ItemInfoType) => void;

export type ItemNameChangeEventFunc = (type:ItemEventType, data:ItemEventNameChangeType) => void;

export type ItemEventFunc = (type:ItemEventType, data:ItemEventDataType) => void;

export interface DraggableComponent {
  draggable?: boolean;
  onDragStart?: (itemInfo:ItemInfoType) => void;
  onDragOver?: (itemInfo:ItemInfoType) => void;
  onDragLeave?: (itemInfo:ItemInfoType) => void;
  onDrop?: (itemInfo:ItemInfoType) => void;
}

export interface KeyValueRepresentationComponentProps {
  treeName: string;
  itemNode: any;
  keyName?: string|number|null;
  parentInfo: ItemInfoType|null;
  expanded: boolean;
  level: number;
  onClick?: ItemClickFunc;
  onEvent?: ItemEventFunc;
  getItemInfoFunc: GetItemInfoFunc;
}


export type TraversalFunc = (value:any) => [string|number, any][];

export type ItemInfoType = {
  value:any;
  type:string,
  component:React.FC<KeyValueRepresentationComponentProps>
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
