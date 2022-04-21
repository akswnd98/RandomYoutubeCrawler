import Operation, { ConstructorParam as ParentConstructorParam } from '..';

export type ConstructorParam = {
} & ParentConstructorParam;

export type PayloadParam = {
  edges: Edge[];
  sizeDelta: number;
};

export type Edge = {
  baseIndex: number;
  relatedIndex: number;
};

export default class Expand extends Operation {
  constructor (payload: ConstructorParam) {
    super(payload);
  }

  expand (payload: PayloadParam) {
    this.updateReverseMDPGraph(payload, payload.sizeDelta);
    this.updateMDPGraph(payload, payload.sizeDelta);
  }

  private updateReverseMDPGraph (payload: PayloadParam, delta: number) {
    this.currentState.reverseMDPGraph.push(...(new Array(delta)).fill(undefined).map<number[]>(() => []));
    payload.edges.forEach((v, i) => {
      this.currentState.reverseMDPGraph[v.relatedIndex].push(v.baseIndex);
    });
  }

  private updateMDPGraph (payload: PayloadParam, delta: number) {
    this.currentState.mdpGraph.push(...(new Array(delta)).fill(undefined).map<number[]>(() => []));
    payload.edges.forEach((v, i) => {
      this.currentState.mdpGraph[v.baseIndex].push(v.relatedIndex);
    });
  }
}
