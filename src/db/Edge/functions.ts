import { Edge } from "@/src/CrawlingCurrent/PageRankMethod/Graph/HashAdapter/Operation/Expand";
import EdgeModel from '@/src/db/Node';
import { Op } from 'sequelize';
import winstonLogger from '@/src/winstonLogger';

export async function insertNewEdges (newEdges: Edge[]) {
  try {
    await EdgeModel.bulkCreate(newEdges);
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
    throw Error('cancelBulkEdgeInsertionByNewEdgesSafely failed');
  }
}

export async function cancelInsertionByNewEdges (newEdges: Edge[]) {
  try {
    await EdgeModel.destroy({
      where: {
        [Op.and]: {
          baseId: {
            [Op.in]: newEdges.map((v) => v.baseId),
          },
          relatedId: {
            [Op.in]: newEdges.map((v) => v.relatedId),
          },
        },
      },
    });
  } catch (e) {
    winstonLogger.error(e);
    throw Error('cancelBulkEdgeInsertionByNewEdges failed');
  }
}
