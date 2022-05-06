import InitGraphOperation from '../Graph/HashAdapter/Operation/Init';
import InitVisitMapOperation from '../VisitMap/Operation/Init';
import NodeModel from '@/src/db/Node';
import EdgeModel from '@/src/db/Edge';

export type ConstructorParam = {
  initGraphOperation: InitGraphOperation;
  initVisitMapOperation: InitVisitMapOperation;
};

export default class Initializer {
  initGraphOperation: InitGraphOperation;
  initVisitMapOperation: InitVisitMapOperation;

  constructor (payload: ConstructorParam) {
    this.initGraphOperation = payload.initGraphOperation;
    this.initVisitMapOperation = payload.initVisitMapOperation;
  }

  async init () {
    const nodes = (await NodeModel.findAll()).map((v) => ({
      id: v.ytId!,
      visit: v.visit!,
    }));
    const edges = (await EdgeModel.findAll()).map((v) => ({
      baseId: v.baseId!,
      relatedId: v.relatedId!,
    }));
    this.initGraphOperation.init({
      nodes,
      edges,
    });
    this.initVisitMapOperation.init({
      nodes,
    });
  }
}
