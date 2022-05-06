import { PayloadParam, Node, Edge } from '../..';
import Expander from '..';
import NodeModel from '@/src/db/Node';
import EdgeModel from '@/src/db/Edge';
import winstonLogger from '@/src/winstonLogger';
import Raw from './Raw';

export type ConstructorParam = {

};

export default class DBExpander extends Expander {
  constructor (payload: ConstructorParam) {
    super({ expander: new Raw({}) });
  }

  async handleFail () {
    
  }
}
