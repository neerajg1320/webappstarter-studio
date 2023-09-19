export interface ElementSize {
  width: number;
  height: number;
}

export type Proportion = {
  min:number, current:number, max:number
}

export type ElementProportions = {
  width?: Proportion,
  height?: Proportion
}

export type DimensionConstraints = {
  min: number,
  max: number
}