import GetPageRankOperation from '../CrawlingCurrent/PageRankMethod/Graph/HashAdapter/Operation/GetPageRank';
import CheckIsVisitOperation from '../CrawlingCurrent/PageRankMethod/VisitMap/Operation/CheckIsVisit';

export type ConstructorParam = {
  getPageRankOperation: GetPageRankOperation;
  checkIsVisitOperation: CheckIsVisitOperation;
};

export default class Selector {
  static MAX_SELECT_RATE = 0.001;

  getPageRankOperation: GetPageRankOperation;

  checkIsVisitOperation: CheckIsVisitOperation;

  constructor (payload: ConstructorParam) {
    this.getPageRankOperation = payload.getPageRankOperation;
    this.checkIsVisitOperation = payload.checkIsVisitOperation;
  }

  select () {
    const rank = this.getPageRankOperation.getPageRank();
    const rankSort = Array.from(rank.entries()).sort((a, b) => a[1] - b[1]);
    const selectedIds = [];
    for (let i = 0, j = 0; i < rankSort.length && j < Math.max(1, rankSort.length * Selector.MAX_SELECT_RATE); i++) {
      if (!this.checkIsVisitOperation.checkIsVisit({ id: rankSort[i][0] })) {
        selectedIds.push(rankSort[i][0]);
        j++;
      }
    }
    return selectedIds;
  }
}
