import Operation, { ConstructorParam as ParentConstructorParam } from '..';

export type ConstructorParam = {
} & ParentConstructorParam;

export type PayloadParam = {
  nodes: Node[];
  edges: Edge[];
};

export type Node = {
  index: number;
};

export type Edge = {
  baseIndex: number;
  relatedIndex: number;
};

export default class Init extends Operation {
  constructor (payload: ConstructorParam) {
    super(payload);
  }

  init (payload: PayloadParam) {
    this.allocSpace(payload);
    this.fillReverse(payload);
    this.fill(payload)
  }

  private allocSpace (payload: PayloadParam) {
    this.currentState.reverseMDPGraph.push(...(new Array(payload.nodes.length)).fill(undefined).map<number[]>(() => []));
    this.currentState.mdpGraph.push(...(new Array(payload.nodes.length)).fill(undefined).map<number[]>(() => []));
  }

  private fillReverse (payload: PayloadParam) {
    payload.edges.forEach((v) => {
      this.currentState.reverseMDPGraph[v.relatedIndex].push(v.baseIndex);
    });
  }

  private fill (payload: PayloadParam) {
    payload.edges.forEach((v) => {
      this.currentState.mdpGraph[v.baseIndex].push(v.relatedIndex);
    });
  }
}
