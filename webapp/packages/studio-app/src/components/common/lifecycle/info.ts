export type ElementLifeCycleInfo = {
  count: number;
  timestamps: Date[];
}

export const getInitialLifecycleInfo = () => {
  return {count: 0, timestamps: []};
}