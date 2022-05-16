import ContainerExpander from '..';
import DBExpander from '../../HandleExceptionDecorator/DBExpander';
import GraphCurrentExpander from '../../HandleExceptionDecorator/GraphCurrentExpander';
import ExpandGraphOperation from '@/src/CrawlingCurrent/PageRankMethod/Graph/HashAdapter/Operation/Expand';

export type ConstructorParam = {
  expandGraphOperation: ExpandGraphOperation;
};

export default class Expander extends ContainerExpander {
  constructor (payload: ConstructorParam) {
    super({
      expanders: [
        new DBExpander({}),
        new GraphCurrentExpander({ expandOperation: payload.expandGraphOperation }),
      ],
    });
  }
}
