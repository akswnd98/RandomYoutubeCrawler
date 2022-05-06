import ContainerExpander from '..';
import DBExpander from '../../HandleExceptionDecorator/DBExpander';
import GraphCurrentExpander from '../../HandleExceptionDecorator/GraphCurrentExpander';
import VisitCurrentExpander from '../../HandleExceptionDecorator/VisitCurrentExpander';
import ExpandGraphOperation from '@/src/CrawlingCurrent/PageRankMethod/Graph/HashAdapter/Operation/Expand';
import ExpandVisitMapOperation from '@/src/CrawlingCurrent/PageRankMethod/VisitMap/Operation/Expand';

export type ConstructorParam = {
  expandGraphOperation: ExpandGraphOperation;
  expandVisitMapOperation: ExpandVisitMapOperation;
};

export default class Expander extends ContainerExpander {
  constructor (payload: ConstructorParam) {
    super({
      expanders: [
        new DBExpander({}),
        new GraphCurrentExpander({ expandOperation: payload.expandGraphOperation }),
        new VisitCurrentExpander({ expandOperation: payload.expandVisitMapOperation }),
      ],
    });
  }
}
