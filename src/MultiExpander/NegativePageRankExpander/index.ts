import Expander from '@/src/Expander/ContainerExpander/NegativePageRankExpander';
import MultiExpander, { PayloadParam } from '..';
import ExpandGraphOperation from '@/src/CrawlingCurrent/PageRankMethod/Graph/HashAdapter/Operation/Expand';
import ExpandVisitMapOperation from '@/src/CrawlingCurrent/PageRankMethod/VisitMap/Operation/Expand';

export type ConstructorParam = {
  expandGraphOperation: ExpandGraphOperation;
  expandVisitMapOperation: ExpandVisitMapOperation;
};

export default class NegativePageRankExpander extends MultiExpander {
  expander: Expander;

  constructor (payload: ConstructorParam) {
    super();
    this.expander = new Expander({ ...payload });
  }

  async expand (payload: PayloadParam) {
    for (let i = 0; i < payload.edges.length; i++) {
      await this.expander.expand({ edge: payload.edges[i] });
    }
  }
}
