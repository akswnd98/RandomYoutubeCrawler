export type PayloadParam = {
  edge: Edge;
};

export type Node = {
  id: string;
};

export type Edge = {
  baseId: string;
  relatedId: string;
};

export interface Exceptionable {
  handleFail (): Promise<void>;
};

export default abstract class Expander {
  abstract expand (payload: PayloadParam): Promise<void>;
}
