import SetVisitOperation from '@/src/CrawlingCurrent/PageRankMethod/VisitMap/Operation/Set';
import NodeModel from '@/src/db/Node';
import winstonLogger from '@/src/winstonLogger';

export type ConstructorParam = {
  setVisitOperation: SetVisitOperation;
};

export type Node = {
  id: string;
};

export default class VisitSetter {
  setVisitOperation: SetVisitOperation;

  maxTryNum: number = 5;

  constructor (payload: ConstructorParam) {
    this.setVisitOperation = payload.setVisitOperation;
  }

  async set (node: Node) {
    try {
      await this.updateDBSafely(node);
      this.setVisitOperation.set(node);
    } catch (e: any) {
      winstonLogger.error(e.stack);
    }
  }

  async updateDBSafely (node: Node) {
    try {
      for (let i = 0; i < this.maxTryNum; i++) {
        await this.failUpdateDB(node);
      }
      throw Error(`VisitSetter.updateDBSafely failed: ${node}`);
    } catch (e) {
    }
  }

  async failUpdateDB (node: Node) {
    try {
      await NodeModel.update({ visit: true }, { where: { ytId: node.id } });
    } catch (e: any) {
      winstonLogger.error(e.stack);
      return;
    }
    throw Error(`VisitSetter.updateDB failed: ${node.id}`);
  }
}
