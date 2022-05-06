import ExpandOperation from '@/src/CrawlingCurrent/PageRankMethod/Graph/HashAdapter/Operation/Expand';
import Expander, { PayloadParam } from '../..';

export type ConstructorParam = {
  expandOperation: ExpandOperation;
};

export default class GraphCurrentExpander extends Expander {
  expandOperation: ExpandOperation;

  constructor (payload: ConstructorParam) {
    super();
    this.expandOperation = payload.expandOperation;
  }

  async expand (payload: PayloadParam) {
    this.expandOperation.expand({ edges: [ payload.edge ] });
  }
}
