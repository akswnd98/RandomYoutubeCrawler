export type PayloadParam = {
  edges: Edge[];
};

export type Edge = {
  baseId: string;
  relatedId: string;
};

export default abstract class MultiExpander {
  abstract expand (payload: PayloadParam): Promise<void>;
}
