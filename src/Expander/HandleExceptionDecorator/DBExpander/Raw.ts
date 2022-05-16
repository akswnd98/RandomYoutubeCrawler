import Expander, { PayloadParam, Node, Edge } from '../..';
import NodeModel from '@/src/db/Node';
import EdgeModel from '@/src/db/Edge';
import winstonLogger from '@/src/winstonLogger';
import { Op } from 'sequelize';

export type ConstructorParam = {
  iterationCount?: number;
};

export default class Raw extends Expander {
  iterationCount: number = 5;

  constructor (payload: ConstructorParam) {
    super();
    if (payload.iterationCount !== undefined) this.iterationCount = payload.iterationCount;
  }

  async expand (payload: PayloadParam) {
    try {
      await this.readyNodeForEdge(payload.edge);
      await this.expandEdgeSafely(payload.edge);
    } catch (e: any) {
      winstonLogger.error(e.stack);
      throw Error('Raw.expand failed');
    }
  }

  private async readyNodeForEdge (edge: Edge) {
    try {
      if (await NodeModel.findOne({ where: { ytId: edge.baseId } }) === null) {
        await this.expandNodeSafely({ id: edge.baseId });
      }
      await this.updateVisitSafely({ id: edge.baseId });
      if (await NodeModel.findOne({ where: { ytId: edge.relatedId } }) === null) {
        await this.expandNodeSafely({ id: edge.relatedId });
      }
    } catch (e: any) {
      winstonLogger.error(e.stack);
      throw Error('readyNodeForEdge failed');
    }
  }

  private async expandNodeSafely (node: Node) {
    try {
      for (let i = 0; i < this.iterationCount; i++) {
        await this.failNodeExpansion(node);
      }
      throw Error('expandNodeSafely failed');
    } catch (e) {
      return;
    }
  }

  private async updateVisitSafely (node: Node) {
    try {
      for (let i = 0; i < this.iterationCount; i++) {
        await NodeModel.update({ visit: true }, { where: { ytId: node.id } });
      }
      throw Error('updateVisitSafely failed');
    } catch (e) {
      return;
    }
  }

  private async failNodeExpansion (node: Node) {
    try {
      const isNode = await NodeModel.findOne({ where: { ytId: node.id } });
      if (isNode === null) {
        await NodeModel.create({ ytId: node.id, visit: false });
      } else {
        throw Error('failNodeExpansion isNode === false');
      }
    } catch (e: any) {
      return;
    }
    throw Error('failNodeExpansion failed');
  }

  private async expandEdgeSafely (edge: Edge) {
    try {
      for (let i = 0; i < this.iterationCount; i++) {
        await this.failEdgeExpansion(edge);
      }
      winstonLogger.error(`expandEdgeSafely failed`);
    } catch (e) {
    }
  }

  private async failEdgeExpansion (edge: Edge) {
    try {
      const isValid = await NodeModel.findOne({ where: { ytId: edge.baseId } }) !== null
        && await NodeModel.findOne({ where: { ytId: edge.relatedId } }) !== null
        && await EdgeModel.findOne({ where: { [Op.and]: { baseId: edge.baseId, relatedId: edge.relatedId } } }) === null;
      if (isValid) {
        await EdgeModel.create({ baseId: edge.baseId, relatedId: edge.relatedId });
      } else {
        throw Error('failEdgeExpansion isValid === false');
      }
    } catch (e: any) {
      winstonLogger.error(e.stack);
      return;
    }
    throw Error('failEdgeExpansion failed');
  }
}
