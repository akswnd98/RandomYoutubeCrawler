import Operation, { ConstructorParam as ParentConstructorParam } from '..';
import InitOperation from '../../../Operation/Init';

export type ConstructorParam = {
} & ParentConstructorParam;

export type PayloadParam = {
  nodes: Node[];
  edges: Edge[];
};

export type Node = {
  id: string;
};

export type Edge = {
  baseId: string;
  relatedId: string;
};

export default class Init extends Operation {
  private initOperation: InitOperation;

  constructor (payload: ConstructorParam) {
    super(payload);
    this.initOperation = new InitOperation({ crawlingCurrent: this.currentState.pageRankMethodCurrent });
  }

  init (payload: PayloadParam) {
    const initSize = this.getInitSize(payload);
    this.initMaps(payload, initSize);
    this.initCrawlingCurrent(payload, initSize);
  }

  private getInitSize (payload: PayloadParam) {
    const initPool = new Set<string>();
    payload.nodes.forEach((v) => {
      initPool.add(v.id);
    });
    return initPool.size;
  }

  private initMaps (payload: PayloadParam, initSize: number) {
    this.currentState.indexHashMap.push(...new Array<string>(initSize));
    payload.nodes.forEach((v) => {
      if (this.currentState.hashIndexMap.get(v.id) === undefined) {
        this.currentState.indexHashMap[this.currentState.hashIndexMap.size] = v.id;
        this.currentState.hashIndexMap.set(v.id, this.currentState.hashIndexMap.size);
      }
    });
  }

  private initCrawlingCurrent (payload: PayloadParam, initSize: number) {
    this.initOperation.init({
      nodes: payload.nodes.map((v) => ({
        index: this.currentState.hashIndexMap.get(v.id)!,
      })),
      edges: payload.edges.map((v) => ({
        baseIndex: this.currentState.hashIndexMap.get(v.baseId)!,
        relatedIndex: this.currentState.hashIndexMap.get(v.relatedId)!,
      })),
    });
  }
}
