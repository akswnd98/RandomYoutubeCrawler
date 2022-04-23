import Operation from '..';

export type PayloadParam = {
  edges: Edge[];
};

export type Edge = {
  baseId: string;
  relatedId: string;
};

export default class Expand extends Operation {
  expand (payload: PayloadParam) {
    payload.edges.forEach((v) => {
      this.map.set(v.baseId, true);
      this.map.set(v.relatedId, false);
    });
  }
}
