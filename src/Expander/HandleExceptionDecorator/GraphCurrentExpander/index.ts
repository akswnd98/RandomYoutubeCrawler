import Expander from '..';
import winstonLogger from '@/src/winstonLogger';
import Raw from './Raw';
import ExpandOperation from '@/src/CrawlingCurrent/PageRankMethod/Graph/HashAdapter/Operation/Expand';

export type ConstructorParam = {
  expandOperation: ExpandOperation;
};

export default class GraphCurrentExpander extends Expander {
  constructor (payload: ConstructorParam) {
    super({ expander: new Raw({ ...payload }) });
  }

  async handleFail () {
    
  }
}
