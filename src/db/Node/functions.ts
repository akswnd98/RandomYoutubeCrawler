import { Edge } from "@/src/CrawlingCurrent/PageRankMethod/Graph/HashAdapter/Operation/Expand";
import NodeModel from '@/src/db/Node';
import { Op } from 'sequelize';
import winstonLogger from '@/src/winstonLogger';
import EdgeModel from '@/src/db/Edge';

export async function insertNewNodes (ids: string[]) {
  try {
    await NodeModel.bulkCreate(ids.map((v) => ({ ytId: v, visit: false })));
  } catch (e) {
    winstonLogger.error(e);
    throw Error('insertNewNodes failed');
  }
}

export async function cancelInsertionByNewEdgesSafely (newEdges: Edge[], maxRetryNum: number) {
  try {
    while (maxRetryNum-- > 1) {
      try {
        await cancelInsertionByNewEdges(newEdges);
      } catch (e) {
        winstonLogger.error(e);
      }
    }
    await cancelInsertionByNewEdges(newEdges);
  } catch (e) {
    winstonLogger.error(e);
    throw Error('cancelBulkNodeInsertionByNewEdgesSafely failed');
  }
}

export async function cancelInsertionByNewEdges (newEdges: Edge[]) {
  try {
    await NodeModel.destroy({
      where: {
        ytId: {
          [Op.in]: newEdges.map((v) => v.relatedId),
        },
      },
    });
  } catch (e) {
    winstonLogger.error(e);
    throw Error('cancelBulkNodeInsertionByNewEdges failed');
  }
}
