import Operation, { ConstructorParam as ParentConstructorParam } from '..';
import ExpandOperation from '../../../Operation/Expand';

export type ConstructorParam = {
} & ParentConstructorParam;

export type PayloadParam = {
  edges: Edge[];
};

export type Edge = {
  baseId: string;
  relatedId: string;
};

export default class Expand extends Operation {
  private expandOperation: ExpandOperation;

  constructor (payload: ConstructorParam) {
    super(payload);
    this.expandOperation = new ExpandOperation({ graphCurrent: this.currentState.graphCurrent });
  }

  expand (payload: PayloadParam) {
    const delta = this.getSizeDelta(payload);
    this.updateMaps(payload, delta);
    this.updateCrawlingCurrent(payload, delta);
  }

  private getSizeDelta (payload: PayloadParam): number {
    const newPool = new Set<string>();
    payload.edges.forEach((v, i) => {
      if (this.currentState.hashIndexMap.get(v.relatedId) === undefined) {
        newPool.add(v.relatedId);
      }
    });
    return newPool.size;
  }

  private updateMaps (payload: PayloadParam, delta: number) {
    this.currentState.indexHashMap.push(...(new Array(delta)).fill(undefined).map<string>(() => ''));
    payload.edges.forEach((v, i) => {
      if (this.currentState.hashIndexMap.get(v.relatedId) === undefined) {
        this.currentState.indexHashMap[this.currentState.hashIndexMap.size] = v.relatedId;
        this.currentState.hashIndexMap.set(v.relatedId, this.currentState.hashIndexMap.size);
      }
    });
  }

  private updateCrawlingCurrent (payload: PayloadParam, delta: number) {
    this.expandOperation.expand({
      edges: payload.edges.map((v) => ({
        baseIndex: this.currentState.hashIndexMap.get(v.baseId)!,
        relatedIndex: this.currentState.hashIndexMap.get(v.relatedId)!,
      })),
      sizeDelta: delta,
    });
  }
}
