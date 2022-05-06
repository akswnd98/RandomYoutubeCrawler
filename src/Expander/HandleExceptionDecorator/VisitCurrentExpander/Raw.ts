import Expander, { PayloadParam } from '../..';
import ExpandOperation from '@/src/CrawlingCurrent/PageRankMethod/VisitMap/Operation/Expand';

export type ConstructorParam = {
  expandOperation: ExpandOperation;
};

export default class VisitCurrentExpander extends Expander {
  expandOperation: ExpandOperation;

  constructor (payload: ConstructorParam) {
    super();
    this.expandOperation = payload.expandOperation;
  }

  async expand (payload: PayloadParam) {
    this.expandOperation.expand({ edges: [ payload.edge ]});
  }
}
