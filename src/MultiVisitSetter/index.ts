import VisitSetter from '../VisitSetter';
import SetVisitOperation from '../CrawlingCurrent/PageRankMethod/VisitMap/Operation/Set';

export type ConstructorParam = {
  setVisitOperation: SetVisitOperation;
};

export type PayloadParam = {
  nodes: Node[];
};

export type Node = {
  id: string;
};

export default class MultiVisitSetter {
  visitSetter: VisitSetter;

  constructor (payload: ConstructorParam) {
    this.visitSetter = new VisitSetter(payload);
  }

  async set (payload: PayloadParam) {
    for (let i = 0; i < payload.nodes.length; i++) {
      await this.visitSetter.set(payload.nodes[i]);
    }
  }
}
